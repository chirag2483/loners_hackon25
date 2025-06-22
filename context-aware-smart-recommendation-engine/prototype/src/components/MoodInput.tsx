"use client";

import { useState } from 'react';

interface MoodInputProps {
  onMoodChange: (mood: string) => void;
  currentMood: string;
}

export default function MoodInput({ onMoodChange, currentMood }: MoodInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const moodOptions = [
    { value: 'happy', label: '😊 Happy', color: 'from-yellow-500 to-orange-500' },
    { value: 'sad', label: '😢 Sad', color: 'from-blue-500 to-indigo-600' },
    { value: 'excited', label: '🤩 Excited', color: 'from-pink-500 to-red-500' },
    { value: 'relaxed', label: '😌 Relaxed', color: 'from-green-500 to-emerald-500' },
    { value: 'romantic', label: '😍 Romantic', color: 'from-pink-400 to-rose-500' },
    { value: 'adventurous', label: '🚀 Adventurous', color: 'from-purple-500 to-indigo-600' }
  ];

  const selectedMood = moodOptions.find(mood => mood.value === currentMood);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-3 px-6 py-3 rounded-xl bg-gradient-to-r ${
          selectedMood ? selectedMood.color : 'from-gray-600 to-gray-700'
        } text-white font-medium shadow-lg transition-all duration-200 hover:shadow-xl min-w-[200px]`}
      >
        <span>{selectedMood ? selectedMood.label : '🎭 Select Your Mood'}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => {
                onMoodChange(mood.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 hover:bg-gray-800 transition-colors duration-150 flex items-center space-x-3 ${
                currentMood === mood.value ? 'bg-gray-800 border-l-4 border-blue-500' : ''
              }`}
            >
              <span className="text-white">{mood.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
