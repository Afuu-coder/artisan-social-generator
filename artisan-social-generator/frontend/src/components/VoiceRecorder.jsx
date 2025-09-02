import React, { useState, useRef, useEffect } from 'react';

const VoiceRecorder = ({ onRecordComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState('');
  
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  
  useEffect(() => {
    return () => {
      clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);
  
  const startRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onRecordComplete(audioBlob);
        
        // Stop all audio tracks
        stream.getAudioTracks().forEach(track => track.stop());
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prevTime => prevTime + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      clearInterval(timerRef.current);
      setIsRecording(false);
    }
  };
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="voice-recorder">
      <div className="recorder-controls">
        {!isRecording ? (
          <button 
            className="record-button" 
            onClick={startRecording}
          >
            <span className="button-icon">🎤</span>
            Start Recording
          </button>
        ) : (
          <button 
            className="stop-button" 
            onClick={stopRecording}
          >
            <span className="button-icon">⏹️</span>
            Stop Recording
          </button>
        )}
      </div>
      
      {isRecording && (
        <div className="recording-indicator">
          <div className="recording-dot"></div>
          Recording... {formatTime(recordingTime)}
        </div>
      )}
      
      {audioURL && !isRecording && (
        <div className="audio-playback">
          <audio 
            src={audioURL} 
            controls 
            className="audio-player"
          />
        </div>
      )}
      
      <div className="recorder-info">
        <small>Speak in Hindi or English about your product's story, crafting process, or special features.</small>
      </div>
    </div>
  );
};

export default VoiceRecorder;