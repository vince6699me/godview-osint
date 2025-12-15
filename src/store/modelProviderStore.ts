import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ModelInfo {
  id: string;
  name: string;
}

interface ModelProviderState {
  apiUrl: string;
  apiKey: string;
  selectedModel: string;
  availableModels: ModelInfo[];
  isConnected: boolean;
  setApiUrl: (url: string) => void;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setAvailableModels: (models: ModelInfo[]) => void;
  setIsConnected: (connected: boolean) => void;
  clearCredentials: () => void;
}

export const useModelProviderStore = create<ModelProviderState>()(
  persist(
    (set) => ({
      apiUrl: '',
      apiKey: '',
      selectedModel: '',
      availableModels: [],
      isConnected: false,

      setApiUrl: (apiUrl) => set({ apiUrl }),
      setApiKey: (apiKey) => set({ apiKey }),
      setSelectedModel: (selectedModel) => set({ selectedModel }),
      setAvailableModels: (availableModels) => set({ availableModels }),
      setIsConnected: (isConnected) => set({ isConnected }),
      clearCredentials: () => set({ 
        apiUrl: '', 
        apiKey: '', 
        selectedModel: '', 
        availableModels: [], 
        isConnected: false 
      }),
    }),
    {
      name: 'godview-model-provider',
    }
  )
);
