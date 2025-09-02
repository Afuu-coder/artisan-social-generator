const { TranslationServiceClient } = require('@google-cloud/translate');

// Initialize Translation client
const translationClient = new TranslationServiceClient();

/**
 * Translate content to multiple languages
 * @param {Object} content - Content to translate (caption and hashtags)
 * @returns {Promise<Object>} Translated content in multiple languages
 */
exports.translateContent = async (content) => {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    const location = 'global';
    
    // Target languages for Indian artisans
    const targetLanguages = [
      'hi', // Hindi
      'bn', // Bengali
      'ta', // Tamil
      'te', // Telugu
      'mr', // Marathi
      'gu'  // Gujarati
    ];
    
    const translations = {};
    
    // Translate content to each target language
    for (const language of targetLanguages) {
      // Translate caption
      const captionRequest = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: [content.caption],
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: language
      };
      
      const [captionResponse] = await translationClient.translateText(captionRequest);
      const translatedCaption = captionResponse.translations[0].translatedText;
      
      // Translate hashtags (only the text part, not the # symbol)
      const hashtagTexts = content.hashtags.map(tag => tag.replace('#', ''));
      
      const hashtagRequest = {
        parent: `projects/${projectId}/locations/${location}`,
        contents: hashtagTexts,
        mimeType: 'text/plain',
        sourceLanguageCode: 'en',
        targetLanguageCode: language
      };
      
      const [hashtagResponse] = await translationClient.translateText(hashtagRequest);
      const translatedHashtags = hashtagResponse.translations.map(
        translation => `#${translation.translatedText.replace(/\s+/g, '')}`
      );
      
      // Store translations
      translations[language] = {
        caption: translatedCaption,
        hashtags: translatedHashtags
      };
    }
    
    return translations;
  } catch (error) {
    console.error('Error translating content:', error);
    throw error;
  }
};