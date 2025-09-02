import React, { useState, useEffect } from 'react';
import { googleCloudService } from '../services/googleCloudService';
import VoiceRecorder from './VoiceRecorder';
import PostPreview from './PostPreview';
import AnalyticsDashboard from './AnalyticsDashboard';
import ContentScheduler from './ContentScheduler';
import '../styles/GoogleCloudGenerator.css';

const GoogleCloudSocialMediaGenerator = ({ productData }) => {
  // State management
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [voiceInput, setVoiceInput] = useState(null);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [generatedContent, setGeneratedContent] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [visionAnalysis, setVisionAnalysis] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Google Cloud services configuration
  const [cloudServices, setCloudServices] = useState({
    vertexAI: true,
    visionAPI: true,
    naturalLanguage: true,
    translation: true,
    bigQuery: true,
    speechToText: true,
    documentAI: false,
    dlp: true
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      
      // Create preview URL
      const previewURL = URL.createObjectURL(file);
      setImagePreview(previewURL);
    }
  };

  // Handle voice input from VoiceRecorder component
  const handleVoiceInput = (audioBlob) => {
    setVoiceInput(audioBlob);
    processVoiceInput(audioBlob);
  };

  // Process voice with Speech-to-Text API
  const processVoiceInput = async (audioBlob) => {
    try {
      const transcript = await googleCloudService.transcribeAudio(audioBlob);
      setVoiceTranscript(transcript);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      showToast('Failed to process voice input.');
    }
  };

  // Toggle Google Cloud services
  const toggleService = (service) => {
    setCloudServices({
      ...cloudServices,
      [service]: !cloudServices[service]
    });
  };

  // Generate content using Google Cloud
  const generateContent = async () => {
    if (!imageFile) {
      showToast('Please upload a product image first');
      return;
    }

    setLoading(true);
    
    try {
      // Step 1: Upload image to Cloud Storage
      const imageUrl = await googleCloudService.uploadImage(imageFile);
      
      // Step 2: Analyze image with Vision API
      let imageAnalysis = null;
      if (cloudServices.visionAPI) {
        imageAnalysis = await googleCloudService.analyzeImage(imageUrl);
        setVisionAnalysis(imageAnalysis);
      }
      
      // Step 3: Generate content with VertexAI and other enabled services
      const content = await googleCloudService.generateContent({
        productData,
        imageUrl,
        imageAnalysis,
        voiceTranscript,
        activeServices: cloudServices
      });
      
      setGeneratedContent(content);
      showToast('Content generated successfully!');
    } catch (error) {
      console.error('Error generating content:', error);
      showToast('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Copy content to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  // Display toast notification
  const showToast = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    
    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  return (
    <div className="google-cloud-generator">
      {/* Header */}
      <div className="gc-header">
        <img src="/google-cloud-logo.svg" alt="Google Cloud" className="gc-logo" />
        <div>
          <h1>AI-Powered Social Media Generator for Artisans</h1>
          <p>Powered by Google Cloud AI & ML Services</p>
        </div>
      </div>

      {/* Google Cloud Services Panel */}
      <div className="gc-services-panel">
        <h2>
          <span className="service-icon">⚙️</span>
          Google Cloud Services
        </h2>
        <div className="services-grid">
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.vertexAI} 
                onChange={() => toggleService('vertexAI')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Vertex AI</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.visionAPI} 
                onChange={() => toggleService('visionAPI')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Vision API</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.naturalLanguage} 
                onChange={() => toggleService('naturalLanguage')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Natural Language</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.translation} 
                onChange={() => toggleService('translation')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Translation API</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.bigQuery} 
                onChange={() => toggleService('bigQuery')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">BigQuery ML</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.speechToText} 
                onChange={() => toggleService('speechToText')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Speech-to-Text</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.documentAI} 
                onChange={() => toggleService('documentAI')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Document AI</span>
            </label>
          </div>
          
          <div className="service-toggle">
            <label>
              <input 
                type="checkbox" 
                checked={cloudServices.dlp} 
                onChange={() => toggleService('dlp')} 
              />
              <span className="toggle-slider"></span>
              <span className="service-name">Cloud DLP</span>
            </label>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <div className="gc-input-section">
        <div className="input-grid">
          {/* Product Image Upload */}
          <div className="input-card">
            <h3>
              <span className="input-icon">🖼️</span>
              Product Image
            </h3>
            <div className="upload-area">
              {imagePreview ? (
                <img src={imagePreview} alt="Product preview" className="image-preview" />
              ) : (
                <label className="upload-label" htmlFor="product-image">
                  <div className="upload-placeholder">
                    <span className="upload-icon">📷</span>
                    <span>Click to upload your product image</span>
                    <small>JPG, PNG or WEBP (max 5MB)</small>
                  </div>
                  <input 
                    type="file" 
                    id="product-image" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    style={{ display: 'none' }} 
                    aria-label="Upload image"
                  />
                </label>
              )}
            </div>
            {imagePreview && (
              <button 
                className="change-image-btn" 
                onClick={() => document.getElementById('product-image').click()}
              >
                Change Image
              </button>
            )}
          </div>
          
          {/* Voice Recording */}
          <div className="input-card">
            <h3>
              <span className="input-icon">🎤</span>
              Artisan's Voice Input
            </h3>
            <VoiceRecorder onRecordComplete={handleVoiceInput} />
            {voiceTranscript && (
              <div className="transcript-container">
                <h4>Transcript:</h4>
                <p className="transcript-text">{voiceTranscript}</p>
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="input-card">
            <h3>
              <span className="input-icon">📝</span>
              Product Details
            </h3>
            <div className="product-details">
              <p><strong>Name:</strong> {productData.title}</p>
              <p><strong>Category:</strong> {productData.category}</p>
              <p><strong>Description:</strong> {productData.description}</p>
              <p><strong>Artisan:</strong> {productData.artisanName}</p>
              <p><strong>Location:</strong> {productData.location}</p>
            </div>
          </div>
        </div>
        
        {/* Generate Button */}
        <button 
          className="generate-button" 
          onClick={generateContent} 
          disabled={loading || !imageFile}
        >
          {loading ? (
            <>
              <span className="loading-spinner">⚙️</span>
              Processing with Google Cloud...
            </>
          ) : (
            <>
              <img src="/vertex-ai-icon.svg" alt="" className="button-icon" />
              Generate Content with Google Cloud
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {generatedContent && (
        <div className="gc-results">
          {/* Platform Tabs */}
          <div className="platform-tabs">
            {Object.keys(generatedContent.platforms).map(platform => (
              <button
                key={platform}
                className={`platform-tab ${selectedPlatform === platform ? 'active' : ''}`}
                onClick={() => setSelectedPlatform(platform)}
              >
                <span className="platform-icon">
                  {platform === 'instagram' ? '📷' : 
                   platform === 'facebook' ? '👤' : 
                   platform === 'linkedin' ? '💼' : 
                   platform === 'twitter' ? '🐦' : '📱'}
                </span>
                {platform.charAt(0).toUpperCase() + platform.slice(1)}
              </button>
            ))}
          </div>
          
          {/* Results Grid */}
          <div className="results-grid">
            {/* Main Content Card */}
            <div className="result-card">
              <h3>
                <span className="card-icon">📝</span>
                Generated Content
              </h3>
              <div className="content-display">
                <div className="caption-section">
                  <h4>Caption</h4>
                  <p>{generatedContent.platforms[selectedPlatform].caption}</p>
                  <button 
                    className="copy-button" 
                    onClick={() => copyToClipboard(generatedContent.platforms[selectedPlatform].caption)}
                  >
                    <span className="copy-icon">📋</span>
                    Copy Caption
                  </button>
                </div>
                
                <div className="hashtags-section">
                  <h4>Hashtags</h4>
                  <div className="hashtags-list">
                    {generatedContent.platforms[selectedPlatform].hashtags.map((tag, index) => (
                      <span key={index} className="hashtag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="copy-button" 
                    onClick={() => copyToClipboard(generatedContent.platforms[selectedPlatform].hashtags.join(' '))}
                  >
                    <span className="copy-icon">📋</span>
                    Copy Hashtags
                  </button>
                </div>
              </div>
            </div>
            
            {/* Post Preview Card */}
            <div className="result-card">
              <h3>
                <span className="card-icon">📱</span>
                Visual Preview
              </h3>
              <PostPreview 
                platform={selectedPlatform}
                imageUrl={imagePreview}
                content={generatedContent.platforms[selectedPlatform]}
                productData={productData}
              />
            </div>
            
            {/* Vision API Analysis */}
            {visionAnalysis && (
              <div className="result-card">
                <h3>
                  <span className="card-icon">👁️</span>
                  Vision API Analysis
                </h3>
                <div className="vision-analysis">
                  <div className="analysis-section">
                    <h4>Labels Detected</h4>
                    <div className="labels-list">
                      {visionAnalysis.labels.map((label, index) => (
                        <div key={index} className="label-item">
                          <span>{label.description}</span>
                          <span className="confidence">{Math.round(label.score * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="analysis-section">
                    <h4>Dominant Colors</h4>
                    <div className="color-palette">
                      {visionAnalysis.colors.map((color, index) => (
                        <div 
                          key={index} 
                          className="color-swatch" 
                          style={{ 
                            backgroundColor: `rgb(${color.red}, ${color.green}, ${color.blue})` 
                          }}
                          title={`RGB(${color.red}, ${color.green}, ${color.blue})`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* NLP Analysis */}
            {generatedContent.nlpAnalysis && (
              <div className="result-card">
                <h3>
                  <span className="card-icon">🧠</span>
                  Natural Language Analysis
                </h3>
                <div className="nlp-analysis">
                  <div className="sentiment-meter">
                    <h4>Sentiment Analysis</h4>
                    <div className="meter">
                      <div 
                        className="meter-fill" 
                        style={{ 
                          width: `${(generatedContent.nlpAnalysis.sentiment.score + 1) * 50}%`,
                          background: generatedContent.nlpAnalysis.sentiment.score > 0 ? '#34A853' : '#EA4335'
                        }}
                      />
                    </div>
                    <p>
                      Score: <strong>{generatedContent.nlpAnalysis.sentiment.score.toFixed(2)}</strong> 
                      (Magnitude: {generatedContent.nlpAnalysis.sentiment.magnitude.toFixed(2)})
                    </p>
                    <p className="sentiment-explanation">
                      {generatedContent.nlpAnalysis.sentiment.score > 0.5 ? 'Very positive tone' :
                       generatedContent.nlpAnalysis.sentiment.score > 0 ? 'Positive tone' :
                       generatedContent.nlpAnalysis.sentiment.score > -0.5 ? 'Neutral tone' : 'Negative tone'}
                    </p>
                  </div>
                  
                  <div className="entities-section">
                    <h4>Key Entities</h4>
                    {generatedContent.nlpAnalysis.entities.slice(0, 5).map((entity, index) => (
                      <div key={index} className="entity-item">
                        <div>
                          <span className="entity-name">{entity.name}</span>
                          <span className="entity-type">{entity.type}</span>
                        </div>
                        <span className="entity-salience">{Math.round(entity.salience * 100)}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Translations */}
            {generatedContent.translations && (
              <div className="result-card full-width">
                <h3>
                  <span className="card-icon">🌐</span>
                  Translations (Cloud Translation API)
                </h3>
                <div className="translations-grid">
                  {Object.entries(generatedContent.translations).map(([lang, content]) => (
                    <div key={lang} className="translation-item">
                      <div className="lang-header">
                        <span className="lang-flag">
                          {lang === 'hi' ? '🇮🇳' : 
                           lang === 'bn' ? '🇧🇩' : 
                           lang === 'ta' ? '🇱🇰' : 
                           lang === 'te' ? '🇮🇳' : 
                           lang === 'mr' ? '🇮🇳' : 
                           lang === 'gu' ? '🇮🇳' : '🌐'}
                        </span>
                        <span className="lang-name">
                          {lang === 'hi' ? 'Hindi' : 
                           lang === 'bn' ? 'Bengali' : 
                           lang === 'ta' ? 'Tamil' : 
                           lang === 'te' ? 'Telugu' : 
                           lang === 'mr' ? 'Marathi' : 
                           lang === 'gu' ? 'Gujarati' : lang}
                        </span>
                      </div>
                      <p className="translated-text">{content.caption}</p>
                      <div className="translated-hashtags">
                        {content.hashtags.map((tag, index) => (
                          <span key={index} className="hashtag-small">{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Analytics Dashboard */}
            {generatedContent.analytics && (
              <div className="result-card full-width">
                <h3>
                  <span className="card-icon">📊</span>
                  Performance Predictions (BigQuery ML)
                </h3>
                <AnalyticsDashboard 
                  analytics={generatedContent.analytics} 
                  platform={selectedPlatform} 
                />
              </div>
            )}
            
            {/* Content Scheduler */}
            <div className="result-card full-width">
              <h3>
                <span className="card-icon">📅</span>
                Schedule Content (Cloud Scheduler)
              </h3>
              <ContentScheduler 
                content={generatedContent.platforms[selectedPlatform]} 
                platform={selectedPlatform}
                onSchedule={showToast}
              />
            </div>
          </div>
        </div>
      )}
      
      {/* Toast Notification */}
      {showNotification && (
        <div className="toast-notification">
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default GoogleCloudSocialMediaGenerator;