"use client";

import { useState } from "react";
import { UserContext } from "@/types";

interface HealthPopupProps {
  userContext: UserContext;
  onHealthChange: (health: 'healthy' | 'ill') => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthPopup({ 
  userContext, 
  onHealthChange, 
  isOpen, 
  onClose 
}: HealthPopupProps) {
  const [selectedHealth, setSelectedHealth] = useState(userContext.health);

  const handleHealthSelect = (health: 'healthy' | 'ill') => {
    setSelectedHealth(health);
    onHealthChange(health);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-glass-gradient border border-orange-500/20 rounded-xl p-8 max-w-md w-full shadow-2xl backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-white">How are you feeling today?</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl transition-colors"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-6">
          <button
            onClick={() => handleHealthSelect('healthy')}
            className={`w-full flex items-center gap-6 p-6 rounded-xl transition-all border-2 ${
              selectedHealth === 'healthy'
                ? 'bg-success/20 text-success border-success'
                : 'bg-secondary/50 hover:bg-secondary border-transparent hover:border-success/50'
            }`}
          >
            <div className="flex-shrink-0">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Feeling Great!</div>
              <div className="text-sm opacity-80">Ready for action-packed movies and adventures</div>
            </div>
          </button>
          
          <button
            onClick={() => handleHealthSelect('ill')}
            className={`w-full flex items-center gap-6 p-6 rounded-xl transition-all border-2 ${
              selectedHealth === 'ill'
                ? 'bg-danger/20 text-danger border-danger'
                : 'bg-secondary/50 hover:bg-secondary border-transparent hover:border-danger/50'
            }`}
          >
            <div className="flex-shrink-0">
              <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-semibold text-lg">Not feeling well</div>
              <div className="text-sm opacity-80">Comfort movies and easy watching for you</div>
            </div>
          </button>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            This helps us recommend movies that match your current mood
          </p>
        </div>
      </div>
    </div>
  );
} 