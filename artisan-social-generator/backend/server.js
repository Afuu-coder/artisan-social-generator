const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { Storage } = require('@google-cloud/storage');
const { ImageAnnotatorClient } = require('@google-cloud/vision');
const { LanguageServiceClient } = require('@google-cloud/language');
const { SpeechClient } = require('@google-cloud/speech');
const { TranslationServiceClient } = require('@google-cloud/translate').v2;
const { VertexAI } = require('@google-cloud/vertexai');

// Import function handlers
const { generateWithVertexAI } = require('./functions/vertexAI');
const { analyzeWithVisionAPI } = require('./functions/visionAPI');
const { analyzeWithNaturalLanguage } = require('./functions/naturalLanguage');
const { translateContent } = require('./functions/translation');
const { predictWithBigQuery } = require('./functions/bigquery');
const { moderateContent } = require('./functions/contentModeration');

// Initialize Express app
const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(morgan('dev'));

// Initialize Google Cloud clients
const storage = new Storage();
const visionClient = new ImageAnnotatorClient();
const languageClient = new LanguageServiceClient();
const speechClient = new SpeechClient();
const translationClient = new TranslationServiceClient();

// Initialize Vertex AI
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'us-central1';
const vertexAI = new VertexAI({ project: projectId, location });

// API Routes
app.post('/api/generate-content', async (req, res) => {
  try {
    const result = await generateWithVertexAI(req.body);
    res.json(result);
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).json({ error: 'Failed to generate content' });
  }
});

app.post('/api/analyze-image', async (req, res) => {
  try {
    const analysis = await analyzeWithVisionAPI(req.body.imageUrl);
    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing image:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
});

app.post('/api/transcribe-audio', async (req, res) => {
  try {
    const { audioContent, encoding, sampleRateHertz, languageCode } = req.body;
    
    const request = {
      audio: {
        content: audioContent
      },
      config: {
        encoding,
        sampleRateHertz,
        languageCode,
        alternativeLanguageCodes: ['en-IN'],
        enableAutomaticPunctuation: true
      }
    };
    
    const [response] = await speechClient.recognize(request);
    const transcript = response.results
      .map(result => result.alternatives[0].transcript)
      .join('\n');
    
    res.json({ transcript });
  } catch (error) {
    console.error('Error transcribing audio:', error);
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

app.post('/api/schedule-post', async (req, res) => {
  try {
    // Simulated scheduling for the hackathon demo
    res.json({
      message: 'Post scheduled successfully',
      scheduleId: `scheduled_${Date.now()}`,
      scheduledTime: `${req.body.date} ${req.body.time}`
    });
  } catch (error) {
    console.error('Error scheduling post:', error);
    res.status(500).json({ error: 'Failed to schedule post' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;