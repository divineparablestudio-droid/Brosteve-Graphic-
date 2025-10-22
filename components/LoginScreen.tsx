import React from 'react';
import { PaintBrushIcon } from './icons';

interface LoginScreenProps {
  onEnter: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onEnter }) => {
  return (
    <div className="bg-gradient-animated min-h-screen w-full flex flex-col justify-center items-center p-4 text-white">
      <div className="text-center max-w-2xl mx-auto">
        <div 
          className="animate-float" 
          style={{ animationDelay: '0s' }}
        >
          <PaintBrushIcon />
        </div>
        <h1 
          className="text-4xl md:text-6xl font-bold font-poppins bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text mt-4 animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Welcome to Brosteve Graphic
        </h1>
        <p 
          className="mt-6 text-lg md:text-xl text-gray-300 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          Your AI partner for creating, refining, and visualizing any design imaginable. Let's bring your ideas to life.
        </p>
        <div 
          className="mt-12 animate-fade-in-up"
          style={{ animationDelay: '0.6s' }}
        >
          <button
            onClick={onEnter}
            className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-lg font-medium rounded-full shadow-lg text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform hover:scale-105 transition-transform duration-300 ease-in-out"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};