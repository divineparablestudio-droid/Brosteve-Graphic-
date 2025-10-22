import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { InputForm } from './components/InputForm';
import { DesignResponse } from './components/DesignResponse';
import { WelcomeMessage } from './components/WelcomeMessage';
import { Spinner } from './components/Spinner';
import { History } from './components/History';
import { LoginScreen } from './components/LoginScreen';
import { ImageEditor } from './components/ImageEditor';
import { generateImage, removeBackgroundImage } from './services/geminiService';
import { fileToBase64, dataUrlToFile } from './utils/fileUtils';
import { ImageFile, HistoryItem } from './types';

const App: React.FC = () => {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRemovingBackground, setIsRemovingBackground] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [imageToEdit, setImageToEdit] = useState<ImageFile | null>(null);
  const [editingImageUrl, setEditingImageUrl] = useState<string | null>(null);

  const handleGenerate = useCallback(async (prompt: string, imageFiles: ImageFile[], aspectRatio: string) => {
    if (!prompt.trim()) {
      setError('Please enter a design request.');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const imagesPayload: { base64: string; mimeType: string }[] = [];
      const userParts: any[] = [];

      for (const imageFile of imageFiles) {
        const base64String = await fileToBase64(imageFile.file);
        const imageBase64 = base64String.split(',')[1];
        const mimeType = imageFile.file.type;
        imagesPayload.push({ base64: imageBase64, mimeType: mimeType });
        userParts.push({
          inlineData: {
            data: imageBase64,
            mimeType: mimeType,
          },
        });
      }

      const fullPrompt = `${prompt}\n\n(Generate in ${aspectRatio} aspect ratio)`;
      userParts.push({ text: fullPrompt });

      const response = await generateImage(prompt, imagesPayload, aspectRatio, chatHistory);
      
      const modelParts = response.candidates[0].content.parts;
      const imagePart = modelParts.find(part => part.inlineData);

      if (imagePart?.inlineData?.data) {
        const imageB64Data = imagePart.inlineData.data;
        const imageUrl = `data:image/png;base64,${imageB64Data}`;
        setGeneratedImage(imageUrl);
        setHistory(prev => [{ id: Date.now(), prompt, generatedImage: imageUrl }, ...prev]);
        setChatHistory(prev => [...prev, { role: 'user', parts: userParts }, { role: 'model', parts: modelParts }]);
      } else {
        setError("The AI didn't return an image. Please try a different prompt.");
      }

    } catch (e) {
      console.error(e);
      setError('An error occurred while generating the image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [chatHistory]);
  
  const handleRefineWithAI = useCallback(async () => {
    if (!generatedImage) return;

    try {
      const file = await dataUrlToFile(generatedImage, `edit-${Date.now()}.png`);
      setImageToEdit({ file, preview: generatedImage });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      console.error("Error creating file from data URL:", e);
      setError("Could not prepare image for editing. Please try again.");
    }
  }, [generatedImage]);
  
  const handleAdjustImage = useCallback(() => {
    if (generatedImage) {
      setEditingImageUrl(generatedImage);
    }
  }, [generatedImage]);

  const handleSaveAdjustedImage = useCallback((newImageUrl: string) => {
    setGeneratedImage(newImageUrl);
    setHistory(prev => [{
      id: Date.now(),
      prompt: 'Manual image adjustments',
      generatedImage: newImageUrl
    }, ...prev]);
    setEditingImageUrl(null);
  }, []);

  const handleRemoveBackground = useCallback(async () => {
    if (!generatedImage) return;

    setIsRemovingBackground(true);
    setError(null);

    try {
      const response = await removeBackgroundImage(generatedImage);
      const modelParts = response.candidates[0].content.parts;
      const imagePart = modelParts.find(part => part.inlineData);

      if (imagePart?.inlineData?.data) {
        const imageB64Data = imagePart.inlineData.data;
        const newImageUrl = `data:image/png;base64,${imageB64Data}`;
        setGeneratedImage(newImageUrl);
        setHistory(prev => [{
          id: Date.now(),
          prompt: 'Background removed',
          generatedImage: newImageUrl
        }, ...prev]);
      } else {
        setError("The AI couldn't remove the background. Please try again.");
      }
    } catch (e) {
      console.error(e);
      setError('An error occurred while removing the background. Please try again.');
    } finally {
      setIsRemovingBackground(false);
    }
  }, [generatedImage]);

  const onImageToEditConsumed = useCallback(() => {
    setImageToEdit(null);
  }, []);

  const handleSelectHistoryItem = useCallback((imageUrl: string) => {
    setGeneratedImage(imageUrl);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    setChatHistory([]);
  }, []);

  if (!showApp) {
    return <LoginScreen onEnter={() => setShowApp(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col items-center">
      <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <Header />
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <InputForm 
              onGenerate={handleGenerate} 
              isLoading={isLoading}
              imageToEdit={imageToEdit}
              onImageToEditConsumed={onImageToEditConsumed}
            />
            
            <div className="mt-12">
              {isLoading && <Spinner />}
              {error && <div className="text-center text-red-400 bg-red-900/50 p-4 rounded-lg">{error}</div>}
              
              {!isLoading && !error && generatedImage && 
                <DesignResponse 
                  imageUrl={generatedImage} 
                  onAdjustImage={handleAdjustImage} 
                  onRefineWithAI={handleRefineWithAI}
                  onRemoveBackground={handleRemoveBackground}
                  isRemovingBackground={isRemovingBackground}
                />
              }
              {!isLoading && !error && !generatedImage && <WelcomeMessage />}
            </div>
          </div>
          <div className="lg:col-span-1">
            <History 
              history={history} 
              onSelect={handleSelectHistoryItem}
              onClear={handleClearHistory} 
            />
          </div>
        </main>
      </div>
      {editingImageUrl && (
        <ImageEditor
          imageUrl={editingImageUrl}
          onSave={handleSaveAdjustedImage}
          onClose={() => setEditingImageUrl(null)}
        />
      )}
    </div>
  );
};

export default App;