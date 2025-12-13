import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatMessage } from '@/types/chat.types';

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isStreaming: boolean;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, updates: Partial<ChatMessage>) => void;
  togglePanel: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isOpen: true,
      isStreaming: false,

      addMessage: (message) =>
        set((state) => ({
          messages: [...state.messages, message],
        })),

      updateMessage: (id, updates) =>
        set((state) => ({
          messages: state.messages.map((msg) =>
            msg.id === id ? { ...msg, ...updates } : msg
          ),
        })),

      togglePanel: () =>
        set((state) => ({
          isOpen: !state.isOpen,
        })),

      setIsOpen: (isOpen) => set({ isOpen }),
      setIsStreaming: (isStreaming) => set({ isStreaming }),

      clearMessages: () => set({ messages: [] }),
    }),
    {
      name: 'godview-chat',
      partialize: (state) => ({ messages: state.messages }),
    }
  )
);
