import React from 'react';
import { X, Clock } from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tempEmailId: string;
}

export function ComposeModal({ isOpen, onClose }: ComposeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <Clock className="w-6 h-6 mr-2 text-[#4A90E2]" />
            Coming Soon
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="text-center mb-6">
          <p className="text-gray-600">
            Email composition feature is currently under development and will be available soon. Stay tuned for updates!
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#4A90E2] text-white rounded-lg px-4 py-2 hover:bg-[#357ABD] transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
}
