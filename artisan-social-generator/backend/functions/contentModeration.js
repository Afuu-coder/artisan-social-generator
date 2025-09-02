const { DlpServiceClient } = require('@google-cloud/dlp');

// Initialize DLP client
const dlpClient = new DlpServiceClient();

/**
 * Moderate content with Cloud DLP
 * @param {Object} content - Content to moderate
 * @returns {Promise<Object>} Moderated content
 */
exports.moderateContent = async (content) => {
  try {
    const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
    
    // Function to moderate a single text string
    const moderateText = async (text) => {
      // Configure DLP inspection
      const inspectConfig = {
        infoTypes: [
          { name: 'PHONE_NUMBER' },
          { name: 'EMAIL_ADDRESS' },
          { name: 'PERSON_NAME' },
          { name: 'CREDIT_CARD_NUMBER' },
          { name: 'US_SOCIAL_SECURITY_NUMBER' }
        ],
        includeQuote: true,
        minLikelihood: 'POSSIBLE'
      };
      
      const item = { value: text };
      
      // Create request configuration
      const request = {
        parent: `projects/${projectId}/locations/global`,
        inspectConfig,
        item
      };
      
      // Inspect content
      const [response] = await dlpClient.inspectContent(request);
      const findings = response.result.findings;
      
      // No findings means the content is clean
      if (!findings || findings.length === 0) {
        return text;
      }
      
      // Moderate the content by replacing sensitive information
      let moderatedText = text;
      findings.forEach(finding => {
        const startIndex = parseInt(finding.location.byteRange.start);
        const endIndex = parseInt(finding.location.byteRange.end);
        const quote = finding.quote;
        
        // Replace sensitive information with [REDACTED]
        moderatedText = moderatedText.replace(quote, '[REDACTED]');
      });
      
      return moderatedText;
    };
    
    // Create a copy of the content to avoid modifying the original
    const moderatedContent = JSON.parse(JSON.stringify(content));
    
    // Moderate all captions
    for (const platform in moderatedContent.platforms) {
      moderatedContent.platforms[platform].caption = 
        await moderateText(moderatedContent.platforms[platform].caption);
    }
    
    return moderatedContent;
  } catch (error) {
    console.error('Error moderating content with DLP:', error);
    // If moderation fails, return the original content
    return content;
  }
};