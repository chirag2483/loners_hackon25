"use client";

import { useState, useRef, useEffect } from 'react';

interface VoiceEmotionDetectorProps {
  onEmotionDetected: (emotion: string) => void;
  currentEmotion: string;
}

export default function VoiceEmotionDetector({ onEmotionDetected, currentEmotion }: VoiceEmotionDetectorProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detectedEmotion, setDetectedEmotion] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      // Use a more compatible audio format
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsProcessing(true);
        try {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
          await sendAudioToFlask(audioBlob);
        } catch (err) {
          setError('Failed to process audio. Please try again.');
          console.error('Error processing audio:', err);
        } finally {
          setIsProcessing(false);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.');
      console.error('Error starting recording:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all tracks to release microphone
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const sendAudioToFlask = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', audioBlob, 'voice_sample.wav');

    try {
      const response = await fetch('http://localhost:5001/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.emotion) {
        setDetectedEmotion(result.emotion);
        
        // Use the raw emotion directly from the model
        onEmotionDetected(result.emotion);
        
        // Auto-hide success message after 3 seconds
        setTimeout(() => {
          setDetectedEmotion(null);
        }, 3000);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      setError('Failed to analyze voice. Please try again.');
      console.error('Error sending audio to Flask:', err);
    }
  };

  const getEmotionIcon = (emotion: string) => {
    const icons: { [key: string]: string } = {
      'happy': '😊',
      'sad': '😢',
      'angry': '😠',
      'fear': '😨',
      'surprise': '😲',
      'disgust': '🤢',
      'neutral': '😐'
    };
    return icons[emotion.toLowerCase()] || '🎭';
  };

  return (
    <div className="relative">
      {/* Main Recording Button */}
      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={isProcessing}
          className={`flex items-center justify-center w-16 h-16 rounded-full font-medium transition-all shadow-lg ${
            isRecording 
              ? 'bg-red-500 text-white animate-pulse' 
              : isProcessing
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white'
          }`}
          title={isRecording ? 'Stop Recording' : 'Start Voice Emotion Detection'}
        >
          {isProcessing ? (
            <svg className="w-6 h-6 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          ) : isRecording ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
        
        <div className="text-center">
          <p className="text-sm text-gray-400">
            {isRecording ? 'Recording... Click to stop' : 
             isProcessing ? 'Analyzing your voice...' : 
             'Click to detect emotion from voice'}
          </p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-20 left-6 z-50 bg-red-500 border border-red-400 rounded-lg p-4 shadow-xl max-w-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-red-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-red-200">Error:</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-white">{error}</p>
        </div>
      )}

      {/* Success Message */}
      {detectedEmotion && (
        <div className="fixed bottom-20 left-6 z-50 bg-green-500 border border-green-400 rounded-lg p-4 shadow-xl max-w-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-green-200">Detected:</span>
            <button 
              onClick={() => {
                setDetectedEmotion(null);
              }}
              className="ml-auto text-green-300 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-white">
            <p>Emotion: {getEmotionIcon(detectedEmotion)} {detectedEmotion}</p>
            <p className="text-green-200 mt-1">Emotion detected and applied!</p>
          </div>
        </div>
      )}
    </div>
  );
} 