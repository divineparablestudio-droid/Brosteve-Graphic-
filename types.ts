export interface ImageFile {
  file: File;
  preview: string;
}

export interface HistoryItem {
  id: number;
  prompt: string;
  generatedImage: string;
}