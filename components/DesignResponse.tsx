import React from 'react';
import { DownloadIcon, EditIcon, WandIcon, BackgroundRemoveIcon, SpinnerIcon } from './icons';

interface DesignResponseProps {
  imageUrl: string;
  onAdjustImage: () => void;
  onRefineWithAI: () => void;
  onRemoveBackground: () => void;
  isRemovingBackground: boolean;
}

export const DesignResponse: React.FC<DesignResponseProps> = ({ imageUrl, onAdjustImage, onRefineWithAI, onRemoveBackground, isRemovingBackground }) => {
  const anyLoading = isRemovingBackground;

  return (
    <div className="bg-gray-800/50 p-4 md:p-8 rounded-lg flex flex-col items-center gap-6">
      <img
        src={imageUrl}
        alt="Generated Design"
        className="max-w-full max-h-[70vh] rounded-md object-contain shadow-lg"
      />
      <div className="flex flex-wrap justify-center gap-4">
        <a
          href={imageUrl}
          download={`brosteve-graphic-${Date.now()}.png`}
          className={`inline-flex items-center justify-center gap-2 px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition ${anyLoading ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <DownloadIcon />
          Download Image
        </a>
        <button
          onClick={onAdjustImage}
          disabled={anyLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-purple-500 text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition disabled:opacity-50"
        >
          <EditIcon />
          Adjust Image
        </button>
        <button
          onClick={onRefineWithAI}
          disabled={anyLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-purple-500 text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition disabled:opacity-50"
        >
          <WandIcon />
          Refine with AI
        </button>
        <button
          onClick={onRemoveBackground}
          disabled={anyLoading}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-purple-500 text-base font-medium rounded-md shadow-sm text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 transition disabled:opacity-50 disabled:cursor-wait"
        >
          {isRemovingBackground ? (
            <>
              <SpinnerIcon />
              Removing...
            </>
          ) : (
            <>
              <BackgroundRemoveIcon />
              Remove Background
            </>
          )}
        </button>
      </div>
    </div>
  );
};