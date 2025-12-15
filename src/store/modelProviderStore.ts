import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ModelInfo {
  id: string;
  name: string;
}

export interface ModelProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey: string;
  availableModels: ModelInfo[];
  isConnected: boolean;
}

interface ModelProviderState {
  providers: ModelProvider[];
  activeProviderId: string | null;
  selectedModel: string;
  addProvider: (provider: Omit<ModelProvider, 'id'>) => string;
  updateProvider: (id: string, updates: Partial<Omit<ModelProvider, 'id'>>) => void;
  removeProvider: (id: string) => void;
  setActiveProvider: (id: string | null) => void;
  setSelectedModel: (model: string) => void;
  getActiveProvider: () => ModelProvider | null;
}

export const useModelProviderStore = create<ModelProviderState>()(
  persist(
    (set, get) => ({
      providers: [],
      activeProviderId: null,
      selectedModel: '',

      addProvider: (provider) => {
        const id = crypto.randomUUID();
        set((state) => ({
          providers: [...state.providers, { ...provider, id }],
          activeProviderId: state.activeProviderId || id,
        }));
        return id;
      },

      updateProvider: (id, updates) => {
        set((state) => ({
          providers: state.providers.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      removeProvider: (id) => {
        set((state) => {
          const newProviders = state.providers.filter((p) => p.id !== id);
          return {
            providers: newProviders,
            activeProviderId:
              state.activeProviderId === id
                ? newProviders[0]?.id || null
                : state.activeProviderId,
            selectedModel:
              state.activeProviderId === id ? '' : state.selectedModel,
          };
        });
      },

      setActiveProvider: (id) => {
        set({ activeProviderId: id, selectedModel: '' });
      },

      setSelectedModel: (selectedModel) => set({ selectedModel }),

      getActiveProvider: () => {
        const state = get();
        return state.providers.find((p) => p.id === state.activeProviderId) || null;
      },
    }),
    {
      name: 'godview-model-provider',
    }
  )
);
