"use client";

import { UserContext } from "@/types";

interface ContextControlsProps {
  userContext: UserContext;
  onHealthChange: (health: 'healthy' | 'ill') => void;
  onSocialChange: (social: 'alone' | 'partner' | 'friends') => void;
  onHealthClick: () => void;
}

export default function ContextControls({ 
  userContext, 
  onHealthChange, 
  onSocialChange,
  onHealthClick
}: ContextControlsProps) {
  const getHealthEmoji = (health: 'healthy' | 'ill') => {
    return health === 'healthy' ? '😊' : '🤒';
  };

  const getHealthColor = (health: 'healthy' | 'ill') => {
    return health === 'healthy' ? 'text-success' : 'text-danger';
  };

  return (
    <div className="bg-card-bg border border-card-border rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4 text-white">Your Movie Context</h3>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Health Status Indicator */}
        <button
          onClick={onHealthClick}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all border-2 ${
            userContext.health === 'healthy'
              ? 'border-success bg-success bg-opacity-20'
              : 'border-danger bg-danger bg-opacity-20'
          }`}
        >
          <span className="text-xl">{getHealthEmoji(userContext.health)}</span>
          <span className={`font-medium ${getHealthColor(userContext.health)}`}>
            {userContext.health === 'healthy' ? 'Feeling Great' : 'Not feeling well'}
          </span>
          <span className="text-xs text-gray-400">(Click to change)</span>
        </button>

        {/* Social Context */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Watching with:</span>
          <div className="flex gap-1">
            <button
              onClick={() => onSocialChange('alone')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm ${
                userContext.social === 'alone'
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-card-border'
              }`}
            >
              <span>👤</span>
              <span>Alone</span>
            </button>
            <button
              onClick={() => onSocialChange('partner')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm ${
                userContext.social === 'partner'
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-card-border'
              }`}
            >
              <span>💕</span>
              <span>Partner</span>
            </button>
            <button
              onClick={() => onSocialChange('friends')}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm ${
                userContext.social === 'friends'
                  ? 'bg-primary text-white'
                  : 'bg-secondary hover:bg-card-border'
              }`}
            >
              <span>👥</span>
              <span>Friends</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 