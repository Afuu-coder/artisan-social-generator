import { firebaseConfig } from './firebaseConfig';
import { initializeApp } from 'firebase/app';
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL 
} from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';
import { apiClient } from './apiClient';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const firestore = getFirestore(app);

class GoogleCloudService {
  /**
   * Upload an image to Cloud Storage
   * @param {File} file - The file to upload
   * @returns {Promise<string>} The public URL of the uploaded file
   */
  async uploadImage(file) {
    try {
      // Create a unique filename
      const timestamp = Date.now();
      const filename = `products/${timestamp}_${file.name}`;
      const storageRef = ref(storage, filename);
      
      // Upload file
      const snapshot = await uploadBytes(storageRef, file);
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
  
  /**
   * Analyze an image using Vision API
   * @param {string} imageUrl - The URL of the image to analyze
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeImage(imageUrl) {
    try {
      const response = await apiClient.post('/api/analyze-image', { imageUrl });
      return response.data;
    } catch (error) {
      console.error('Error analyzing image:', error);
      throw error;
    }
  }
  
  /**
   * Transcribe audio using Speech-to-Text API
   * @param {Blob} audioBlob - The audio data to transcribe
   * @returns {Promise<string>} The transcribed text
   */
  async transcribeAudio(audioBlob) {
    try {
      // Convert blob to base64
      const base64Audio = await this.blobToBase64(audioBlob);
      
      const response = await apiClient.post('/api/transcribe-audio', {
        audioContent: base64Audio,
        encoding: 'WEBM_OPUS',
        sampleRateHertz: 48000,
        languageCode: 'hi-IN',
        alternativeLanguageCodes: ['en-IN']
      });
      
      return response.data.transcript;
    } catch (error) {
      console.error('Error transcribing audio:', error);
      throw error;
    }
  }
  
  /**
   * Generate content using Vertex AI and other Google Cloud services
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated content
   */
  async generateContent(options) {
    try {
      const response = await apiClient.post('/api/generate-content', options);
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  }
  
  /**
   * Schedule a post using Cloud Scheduler
   * @param {Object} scheduleOptions - Options for scheduling
   * @returns {Promise<Object>} Scheduled job details
   */
  async schedulePost(scheduleOptions) {
    try {
      const response = await apiClient.post('/api/schedule-post', scheduleOptions);
      return response.data;
    } catch (error) {
      console.error('Error scheduling post:', error);
      throw error;
    }
  }
  
  /**
   * Convert a Blob to base64 string
   * @param {Blob} blob - The blob to convert
   * @returns {Promise<string>} Base64 string
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data URL prefix (e.g., "data:audio/webm;base64,")
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}

export const googleCloudService = new GoogleCloudService();