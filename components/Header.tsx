import React from 'react';
import { PaintBrushIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3">
        <PaintBrushIcon />
        <h1 className="text-4xl md:text-5xl font-bold font-poppins bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
          Brosteve Graphic
        </h1>
      </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Your professional AI assistant for creating stunning visual designs.
      </p>
      <div className="mt-8 w-32 mx-auto">
        <div className="h-0.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full"></div>
        <div className="h-0.5 bg-gradient-to-r from-pink-500 to-red-500 rounded-full mt-1.5"></div>
      </div>
    </header>
  );
};
