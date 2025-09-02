const { ImageAnnotatorClient } = require('@google-cloud/vision');

// Initialize Vision client
const visionClient = new ImageAnnotatorClient();

/**
 * Analyze an image with Vision API
 * @param {string} imageUrl - URL of the image to analyze
 * @returns {Promise<Object>} Vision API analysis results
 */
exports.analyzeWithVisionAPI = async (imageUrl) => {
  try {
    // Perform multiple types of analysis on the image
    const [result] = await visionClient.annotateImage({
      image: { source: { imageUri: imageUrl } },
      features: [
        { type: 'LABEL_DETECTION', maxResults: 10 },
        { type: 'IMAGE_PROPERTIES', maxResults: 5 },
        { type: 'SAFE_SEARCH_DETECTION' },
        { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
        { type: 'TEXT_DETECTION' }
      ]
    });
    
    // Extract relevant information from the response
    const labels = result.labelAnnotations || [];
    
    // Extract dominant colors
    const colors = result.imagePropertiesAnnotation?.dominantColors?.colors?.map(color => ({
      red: Math.round(color.color.red),
      green: Math.round(color.color.green),
      blue: Math.round(color.color.blue),
      score: color.score,
      pixelFraction: color.pixelFraction
    })) || [];
    
    // Safe search annotations
    const safeSearch = result.safeSearchAnnotation;
    
    // Detected objects
    const objects = result.localizedObjectAnnotations?.map(obj => ({
      name: obj.name,
      score: obj.score,
      boundingBox: obj.boundingPoly
    })) || [];
    
    // Text detection
    const textAnnotations = result.textAnnotations || [];
    const text = textAnnotations.length > 0 ? textAnnotations[0].description : '';
    
    return {
      labels,
      colors,
      safeSearch,
      objects,
      text
    };
  } catch (error) {
    console.error('Error analyzing image with Vision API:', error);
    throw error;
  }
};