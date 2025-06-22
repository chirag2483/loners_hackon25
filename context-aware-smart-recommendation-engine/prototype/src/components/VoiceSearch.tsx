"use client";

import { useState, useEffect, useRef } from "react";

interface VoiceSearchProps {
  onTranscriptChange: (transcript: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function VoiceSearch({ onTranscriptChange, searchQuery, onSearchChange }: VoiceSearchProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSupported, setIsSupported] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        if (finalTranscript) {
          setTranscript(finalTranscript);
          onTranscriptChange(finalTranscript);
          onSearchChange(finalTranscript);
          setShowPopup(true);
          // Auto-hide popup after 3 seconds
          setTimeout(() => setShowPopup(false), 3000);
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [onTranscriptChange, onSearchChange]);

  const startListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error starting speech recognition:', error);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsListening(false);
      } catch (error) {
        console.error('Error stopping speech recognition:', error);
      }
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchChange(query);
  };

  return (
    <>
      {/* Voice Search Icon */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={isListening ? stopListening : startListening}
          className={`flex items-center justify-center w-14 h-14 rounded-full font-medium transition-all shadow-lg ${
            isListening 
              ? 'bg-danger text-white animate-pulse-glow' 
              : 'bg-orange-gradient hover:bg-primary-hover text-white'
          }`}
          disabled={!isSupported}
          title={isListening ? 'Stop Voice Search' : 'Start Voice Search'}
        >
          {isListening ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      {/* Transcript Popup */}
      {showPopup && transcript && (
        <div className="fixed bottom-20 left-6 z-50 bg-glass-gradient border border-orange-500/20 rounded-lg p-4 shadow-xl max-w-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-400">Transcript:</span>
            <button 
              onClick={() => setShowPopup(false)}
              className="ml-auto text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-white">{transcript}</p>
        </div>
      )}

      {/* Hidden input for fallback */}
      <input
        type="text"
        placeholder="Search movies..."
        value={searchQuery}
        onChange={handleSearchChange}
        className="sr-only"
      />
    </>
  );
} 