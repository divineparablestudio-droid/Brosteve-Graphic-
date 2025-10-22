import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CloseIcon, CheckIcon, ResetIcon } from './icons';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (newImageUrl: string) => void;
  onClose: () => void;
}

const initialFilters = {
  brightness: 100,
  contrast: 100,
  saturate: 100,
  grayscale: 0,
  sepia: 0,
  invert: 0,
};

type FilterName = keyof typeof initialFilters;

export const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onSave, onClose }) => {
  const [filters, setFilters] = useState(initialFilters);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filterString = `
    brightness(${filters.brightness}%) 
    contrast(${filters.contrast}%) 
    saturate(${filters.saturate}%) 
    grayscale(${filters.grayscale}%) 
    sepia(${filters.sepia}%) 
    invert(${filters.invert}%)
  `.trim();

  const handleFilterChange = (filterName: FilterName, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: parseInt(value, 10) }));
  };

  const resetFilters = () => {
    setFilters(initialFilters);
  };

  const handleSave = useCallback(() => {
    const image = imageRef.current;
    const canvas = canvasRef.current;
    if (image && canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.filter = filterString;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        onSave(dataUrl);
      }
    }
  }, [filterString, onSave]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="image-editor-title">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-fade-in-up">
        <header className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 id="image-editor-title" className="text-xl font-bold font-poppins">Image Editor</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors" aria-label="Close editor">
            <CloseIcon />
          </button>
        </header>

        <main className="flex-1 p-4 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-y-auto">
          <div className="md:col-span-2 flex items-center justify-center bg-gray-900 rounded-md p-2">
            <img 
              ref={imageRef} 
              src={imageUrl} 
              alt="Editing preview" 
              className="max-w-full max-h-[65vh] object-contain" 
              style={{ filter: filterString }} 
              crossOrigin="anonymous"
            />
            <canvas ref={canvasRef} className="hidden" aria-hidden="true"></canvas>
          </div>
          <aside className="space-y-4">
            <h3 className="text-lg font-semibold">Adjustments</h3>
            
            {Object.entries(initialFilters).map(([key]) => {
                const name = key as FilterName;
                const value = filters[name];
                const max = (name === 'brightness' || name === 'contrast' || name === 'saturate') ? 200 : 100;
                return (
                    <div key={name}>
                        <label htmlFor={name} className="capitalize text-sm text-gray-400 flex justify-between">
                            <span>{name}</span>
                            <span>{value}</span>
                        </label>
                        <input
                            id={name}
                            type="range"
                            min="0"
                            max={max}
                            value={value}
                            onChange={(e) => handleFilterChange(name, e.target.value)}
                            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-thumb"
                        />
                    </div>
                );
            })}

            <button onClick={resetFilters} className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 transition">
              <ResetIcon /> Reset Filters
            </button>
          </aside>
        </main>

        <footer className="flex justify-end items-center p-4 border-t border-gray-700 gap-4">
          <button onClick={onClose} className="px-6 py-2 border border-gray-600 text-base font-medium rounded-md text-gray-300 hover:bg-gray-700 transition">
            Cancel
          </button>
          <button onClick={handleSave} className="inline-flex items-center justify-center gap-2 px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition">
            <CheckIcon /> Save Changes
          </button>
        </footer>
      </div>
      <style>{`
        .range-thumb::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          background: #a855f7;
          cursor: pointer;
          border-radius: 50%;
          margin-top: -6px;
        }
        .range-thumb::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #a855f7;
          cursor: pointer;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};