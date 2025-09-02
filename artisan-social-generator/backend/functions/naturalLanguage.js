const { LanguageServiceClient } = require('@google-cloud/language');

// Initialize Language client
const languageClient = new LanguageServiceClient();

/**
 * Analyze text with Natural Language API
 * @param {string} text - Text to analyze
 * @returns {Promise<Object>} Natural Language analysis results
 */
exports.analyzeWithNaturalLanguage = async (text) => {
  try {
    // Create document
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    
    // Analyze sentiment
    const [sentimentResult] = await languageClient.analyzeSentiment({ document });
    const sentiment = sentimentResult.documentSentiment;
    
    // Analyze entities
    const [entitiesResult] = await languageClient.analyzeEntities({ document });
    const entities = entitiesResult.entities;
    
    // Analyze syntax
    const [syntaxResult] = await languageClient.analyzeSyntax({ document });
    const tokens = syntaxResult.tokens;
    
    // Analyze categories
    const [categoriesResult] = await languageClient.classifyText({ document }).catch(() => [{ categories: [] }]);
    const categories = categoriesResult.categories || [];
    
    return {
      sentiment: {
        score: sentiment.score,
        magnitude: sentiment.magnitude
      },
      entities: entities.map(entity => ({
        name: entity.name,
        type: entity.type,
        salience: entity.salience,
        metadata: entity.metadata
      })),
      syntax: {
        tokens: tokens.map(token => ({
          text: token.text.content,
          partOfSpeech: token.partOfSpeech.tag,
          dependencyEdge: token.dependencyEdge
        }))
      },
      categories: categories.map(category => ({
        name: category.name,
        confidence: category.confidence
      }))
    };
  } catch (error) {
    console.error('Error analyzing text with Natural Language API:', error);
    throw error;
  }
};