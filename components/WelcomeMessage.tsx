import React from 'react';

export const WelcomeMessage: React.FC = () => {
  return (
    <div className="text-center p-8 bg-gray-800/50 rounded-lg">
      <h2 className="text-2xl font-bold font-poppins mb-4">Welcome to Brosteve Graphic!</h2>
      <p className="text-gray-400 max-w-3xl mx-auto">
        Your AI-powered design assistant. Describe your vision, upload an image for inspiration, and let's generate something amazing together.
      </p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-purple-300">🎨 Logos & Banners</h3>
          <p className="text-sm text-gray-400 mt-1">Generate stunning visuals for your brand.</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-pink-300">📱 Social Media Posts</h3>
          <p className="text-sm text-gray-400 mt-1">Create engaging images for your feed.</p>
        </div>
        <div className="bg-gray-700/50 p-4 rounded-lg">
          <h3 className="font-semibold text-red-300">🖼️ Digital Artwork</h3>
          <p className="text-sm text-gray-400 mt-1">Visualize creative ideas for posters or thumbnails.</p>
        </div>
      </div>
    </div>
  );
};