const { VertexAI } = require('@google-cloud/vertexai');

// Initialize Vertex AI
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const location = 'us-central1';
const vertexAI = new VertexAI({ project: projectId, location });

/**
 * Generate content with Vertex AI
 * @param {Object} options - Generation options
 * @returns {Promise<Object>} Generated content
 */
exports.generateWithVertexAI = async (options) => {
  try {
    const { 
      productData, 
      imageUrl, 
      imageAnalysis, 
      voiceTranscript 
    } = options;
    
    // Access Gemini Pro model
    const generativeModel = vertexAI.getGenerativeModel({
      model: 'gemini-pro',
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
    
    // Construct prompt
    const prompt = `
      You are an expert social media strategist for artisans selling handcrafted products.
      
      PRODUCT INFORMATION:
      - Name: ${productData.title}
      - Category: ${productData.category}
      - Description: ${productData.description}
      - Artisan: ${productData.artisanName}
      - Location: ${productData.location}
      ${voiceTranscript ? `- Artisan's Voice Notes: ${voiceTranscript}` : ''}
      
      ${imageAnalysis ? `
      IMAGE ANALYSIS:
      - Detected Labels: ${imageAnalysis.labels.map(l => l.description).join(', ')}
      - Colors: ${imageAnalysis.colors ? JSON.stringify(imageAnalysis.colors) : 'Not available'}
      ` : ''}
      
      TASK:
      Generate social media content for this artisan product for Instagram, Facebook, and LinkedIn.
      
      For each platform, provide:
      1. An engaging caption (appropriate length for the platform)
      2. A list of 5-10 relevant hashtags
      
      Format your response as valid JSON with this structure:
      {
        "platforms": {
          "instagram": {
            "caption": "...",
            "hashtags": ["...", "..."]
          },
          "facebook": {
            "caption": "...",
            "hashtags": ["...", "..."]
          },
          "linkedin": {
            "caption": "...",
            "hashtags": ["...", "..."]
          }
        }
      }
      
      Make the content authentic, highlighting cultural heritage, craftsmanship, and sustainability aspects.
      Ensure Instagram captions are concise and visual, Facebook content is more detailed with storytelling elements, and LinkedIn content is professional and impact-focused.
    `;
    
    // Generate content
    const result = await generativeModel.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    });
    
    // Process response
    const responseText = result.response.text();
    
    // Parse JSON from response
    try {
      return JSON.parse(responseText);
    } catch (error) {
      console.error('Error parsing Vertex AI response:', error);
      console.log('Raw response:', responseText);
      
      // Return fallback content
      return {
        platforms: {
          instagram: {
            caption: `Handcrafted with love and tradition! This beautiful ${productData.title} from ${productData.location} represents generations of artisanal expertise. Each piece tells a unique story. 🤎 #Handmade #ArtisanCraft`,
            hashtags: ['#Handmade', '#ArtisanCraft', '#IndianHandicraft', '#SupportLocal', '#TraditionalArt', `#${productData.category.charAt(0).toUpperCase() + productData.category.slice(1)}`, '#MadeInIndia', '#Sustainable']
          },
          facebook: {
            caption: `Discover the beauty of traditional craftsmanship with this exquisite ${productData.title} from ${productData.location}. ${productData.artisanName} carefully creates each piece using techniques passed down through generations. Every curve, color, and pattern tells the story of our rich cultural heritage. By bringing this piece into your home, you're not just buying a product, you're preserving an ancient art form and supporting a local artisan family.`,
            hashtags: ['#Handmade', '#ArtisanCraft', '#CulturalHeritage', '#SupportLocal', '#IndianHandicraft']
          },
          linkedin: {
            caption: `Proud to showcase this exquisite ${productData.title} created by master artisan ${productData.artisanName} from ${productData.location}. Supporting traditional craftspeople not only preserves cultural heritage but also provides sustainable livelihoods in rural communities. Each purchase directly impacts artisan families and helps keep ancient techniques alive for future generations.`,
            hashtags: ['#SustainableBusiness', '#ArtisanCraft', '#CulturalHeritage', '#RuralLivelihoods', '#SocialImpact']
          }
        }
      };
    }
  } catch (error) {
    console.error('Error generating content with Vertex AI:', error);
    throw error;
  }
};