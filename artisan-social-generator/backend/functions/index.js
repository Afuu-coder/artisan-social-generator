const functions = require('@google-cloud/functions-framework');
const cors = require('cors')({ origin: true });
const { VertexAI } = require('@google-cloud/vertexai');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { LanguageServiceClient } = require('@google-cloud/language');
const { TranslationServiceClient } = require('@google-cloud/translate');
const { SpeechClient } = require('@google-cloud/speech');
const { BigQuery } = require('@google-cloud/bigquery');
const { DLP } = require('@google-cloud/dlp');
const { Storage } = require('@google-cloud/storage');
const { Firestore } = require('@google-cloud/firestore');

// Import specialized handlers
const { generateWithVertexAI } = require('./vertexAI');
const { analyzeWithVisionAPI } = require('./visionAPI');
const { analyzeWithNaturalLanguage } = require('./naturalLanguage');
const { translateContent } = require('./translation');
const { predictWithBigQuery } = require('./bigquery');
const { moderateContent } = require('./contentModeration');

// Initialize services
const visionClient = new ImageAnnotatorClient();
const languageClient = new LanguageServiceClient();
const translationClient = new TranslationServiceClient();
const speechClient = new SpeechClient();
const bigqueryClient = new BigQuery();
const dlpClient = new DLP();
const storage = new Storage();
const firestore = new Firestore();

// Initialize Vertex AI
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'us-central1';
const vertexAI = new VertexAI({ project: projectId, location });

// Main content generation endpoint
functions.http('generateContent', async (req, res) => {
  cors(req, res, async () => {
    try {
      const { 
        productData, 
        imageUrl, 
        imageAnalysis, 
        voiceTranscript,
        activeServices 
      } = req.body;
      
      // Validate required fields
      if (!productData || !imageUrl) {
        return res.status(400).json({ 
          error: 'Missing required fields: productData and imageUrl are required' 
        });
      }
      
      // 1. Generate content with Vertex AI
      const generatedContent = await generateWithVertexAI(req.body);
      
      // 2. Apply content moderation if enabled
      let moderatedContent = generatedContent;
      if (activeServices.dlp) {
        moderatedContent = await moderateContent(generatedContent);
      }
      
      // 3. Analyze sentiment and entities if natural language is enabled
      let nlpAnalysis = null;
      if (activeServices.naturalLanguage) {
        // Extract all captions for analysis
        const allCaptions = Object.values(moderatedContent.platforms)
          .map(platform => platform.caption)
          .join(' ');
          
        nlpAnalysis = await analyzeWithNaturalLanguage(allCaptions);
      }
      
      // 4. Generate translations if enabled
      let translations = null;
      if (activeServices.translation) {
        // Focus on Instagram content for translations
        const instagramContent = moderatedContent.platforms.instagram;
        translations = await translateContent(instagramContent);
      }
      
      // 5. Get analytics predictions if BigQuery is enabled
      let analytics = null;
      if (activeServices.bigQuery) {
        analytics = await predictWithBigQuery(moderatedContent, productData.category);
      }
      
      // 6. Store in Firestore for future reference
      const docRef = firestore.collection('generated_content').doc();
      await docRef.set({
        productData,
        content: moderatedContent,
        imageUrl,
        imageAnalysis,
        voiceTranscript,
        timestamp: new Date().toISOString(),
        docId: docRef.id
      });
      
      // 7. Combine all results and return
      const result = {
        ...moderatedContent,
        nlpAnalysis,
        translations,
        analytics,
        docId: docRef.id
      };
      
      res.status(200).json(result);
      
    } catch (error) {
      console.error('Error generating content:', error);
      res.status(500).json({ 
        error: 'Failed to generate content',
        details: error.message 
      });
    }
  });
});

// Image analysis endpoint
functions.http('analyzeImage', async (req, res) => {
  cors(req, res, async () => {
    try {
      const { imageUrl } = req.body;
      
      if (!imageUrl) {
        return res.status(400).json({ error: 'Missing imageUrl parameter' });
      }
      
      const analysis = await analyzeWithVisionAPI(imageUrl);
      res.status(200).json(analysis);
      
    } catch (error) {
      console.error('Error analyzing image:', error);
      res.status(500).json({ 
        error: 'Failed to analyze image',
        details: error.message 
      });
    }
  });
});

// Audio transcription endpoint
functions.http('transcribeAudio', async (req, res) => {
  cors(req, res, async () => {
    try {
      const { 
        audioContent, 
        encoding = 'WEBM_OPUS', 
        sampleRateHertz = 48000, 
        languageCode = 'hi-IN',
        alternativeLanguageCodes = ['en-IN'] 
      } = req.body;
      
      if (!audioContent) {
        return res.status(400).json({ error: 'Missing audioContent parameter' });
      }
      
      // Create the speech request configuration
      const request = {
        audio: {
          content: audioContent
        },
        config: {
          encoding,
          sampleRateHertz,
          languageCode,
          alternativeLanguageCodes,
          model: 'latest_long',
          enableAutomaticPunctuation: true,
          enableSpokenPunctuation: true
        }
      };
      
      // Perform the transcription
      const [response] = await speechClient.recognize(request);
      
      // Extract the transcript from the response
      const transcript = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');
      
      res.status(200).json({ transcript });
      
    } catch (error) {
      console.error('Error transcribing audio:', error);
      res.status(500).json({ 
        error: 'Failed to transcribe audio',
        details: error.message 
      });
    }
  });
});

// Schedule post endpoint
functions.http('schedulePost', async (req, res) => {
  cors(req, res, async () => {
    try {
      const { date, time, platforms, content } = req.body;
      
      if (!date || !time || !platforms || !content) {
        return res.status(400).json({ 
          error: 'Missing required fields: date, time, platforms, and content are required' 
        });
      }
      
      // In a real implementation, this would use Cloud Scheduler to schedule the post
      // For the hackathon demo, we'll simulate scheduling
      
      // Store scheduled post in Firestore
      const docRef = firestore.collection('scheduled_posts').doc();
      await docRef.set({
        date,
        time,
        platforms,
        content,
        status: 'scheduled',
        timestamp: new Date().toISOString(),
        docId: docRef.id
      });
      
      res.status(200).json({ 
        message: 'Post scheduled successfully',
        scheduleId: docRef.id,
        scheduledTime: `${date} ${time}`
      });
      
    } catch (error) {
      console.error('Error scheduling post:', error);
      res.status(500).json({ 
        error: 'Failed to schedule post',
        details: error.message 
      });
    }
  });
});

// Export all functions
module.exports = {
  generateContent: functions.http('generateContent'),
  analyzeImage: functions.http('analyzeImage'),
  transcribeAudio: functions.http('transcribeAudio'),
  schedulePost: functions.http('schedulePost')
};