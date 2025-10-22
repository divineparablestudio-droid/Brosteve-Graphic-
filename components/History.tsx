import React from 'react';
import { HistoryItem } from '../types';
import { HistoryIcon, TrashIcon } from './icons';

interface HistoryProps {
  history: HistoryItem[];
  onSelect: (imageUrl: string) => void;
  onClear: () => void;
}

export const History: React.FC<HistoryProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="bg-gray-800/50 p-6 rounded-lg sticky top-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <HistoryIcon />
          <h2 className="text-xl font-bold font-poppins">History</h2>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClear}
            className="text-sm text-gray-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            aria-label="Clear history"
          >
            <TrashIcon className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>
      <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
        {history.length === 0 ? (
          <p className="text-gray-500 text-center py-4 text-sm">Your generated images will appear here.</p>
        ) : (
          history.map(item => (
            <div key={item.id} className="relative group">
              <button
                onClick={() => onSelect(item.generatedImage)}
                className="w-full text-left p-3 bg-gray-700/60 rounded-md hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 flex items-center gap-4"
              >
                <img 
                  src={item.generatedImage}
                  alt="History item preview"
                  className="w-16 h-16 object-cover rounded-md bg-gray-600 flex-shrink-0"
                />
                <p className="text-sm font-medium text-gray-200 truncate flex-1">{item.prompt}</p>
              </button>

              {/* --- Preview Popover --- */}
              <div
                className="absolute top-1/2 -translate-y-1/2 right-full mr-4 w-64
                           bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-2xl z-20
                           invisible opacity-0 group-hover:visible group-hover:opacity-100 
                           transition-all duration-200 pointer-events-none"
                aria-hidden="true"
              >
                <img
                  src={item.generatedImage}
                  alt="History item large preview"
                  className="w-full aspect-square object-cover rounded-md mb-3"
                />
                <p className="text-sm text-gray-300 whitespace-normal break-words">
                  {item.prompt}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
