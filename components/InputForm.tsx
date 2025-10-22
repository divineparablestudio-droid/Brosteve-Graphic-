import React, { useState, useRef, useEffect } from 'react';
import { ImageFile } from '../types';
import { UploadIcon, TrashIcon } from './icons';

interface InputFormProps {
  onGenerate: (prompt: string, imageFiles: ImageFile[], aspectRatio: string) => void;
  isLoading: boolean;
  imageToEdit: ImageFile | null;
  onImageToEditConsumed: () => void;
}

export const InputForm: React.FC<InputFormProps> = ({ onGenerate, isLoading, imageToEdit, onImageToEditConsumed }) => {
  const [prompt, setPrompt] = useState<string>('');
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const [aspectRatio, setAspectRatio] = useState('1:1');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (imageToEdit) {
      imageFiles.forEach(f => URL.revokeObjectURL(f.preview));
      setImageFiles([imageToEdit]);
      onImageToEditConsumed();
    }
  }, [imageToEdit, onImageToEditConsumed]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImageFiles = files.map(file => ({
        file,
        preview: URL.createObjectURL(file),
      }));
      setImageFiles(prev => [...prev, ...newImageFiles]);
    }
  };

  const removeImage = (indexToRemove: number) => {
    const imageToRemove = imageFiles[indexToRemove];
    if (imageToRemove) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt, imageFiles, aspectRatio);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-400 mb-2">
                Describe your design idea...
            </label>
            <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., a logo for a coffee shop called 'Cosmic Brews'"
                rows={5}
                className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                disabled={isLoading}
            />
            <div className="mt-4">
                <label htmlFor="aspect-ratio" className="block text-sm font-medium text-gray-400 mb-2">
                    Aspect Ratio
                </label>
                <select
                    id="aspect-ratio"
                    value={aspectRatio}
                    onChange={(e) => setAspectRatio(e.target.value)}
                    className="w-full bg-gray-700 border-gray-600 rounded-md p-3 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                    disabled={isLoading}
                >
                    <option value="1:1">1:1 (Square)</option>
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Portrait)</option>
                    <option value="4:3">4:3 (Landscape)</option>
                    <option value="3:4">3:4 (Vertical)</option>
                </select>
            </div>
        </div>

        <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">
                Upload images (optional)
            </label>
            <div className="mt-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
                {imageFiles.map((imageFile, index) => (
                    <div key={index} className="relative group aspect-square">
                        <img src={imageFile.preview} alt={`Preview ${index + 1}`} className="h-full w-full object-cover rounded-md" />
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-md">
                            <button type="button" onClick={() => removeImage(index)} className="p-2 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors">
                                <TrashIcon />
                            </button>
                        </div>
                    </div>
                ))}
                <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer flex justify-center items-center aspect-square border-2 border-gray-600 border-dashed rounded-md text-gray-400 hover:border-purple-500 hover:text-purple-400 transition-colors"
                >
                    <div className="text-center">
                        <UploadIcon />
                        <span className="mt-2 block text-xs">Add Images</span>
                    </div>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" ref={fileInputRef} disabled={isLoading} multiple />
                </label>
            </div>
        </div>
      </div>
      
      <div className="mt-6 text-right">
        <button
          type="submit"
          disabled={isLoading || !prompt.trim()}
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed transition"
        >
          {isLoading ? 'Generating...' : '✨ Generate Design'}
        </button>
      </div>
    </form>
  );
};