import { create } from 'zustand';
import { ScanExecution, ScanResult } from '@/types/osint.types';

interface OSINTState {
  activeExecutions: Map<string, ScanExecution>;
  recentResults: ScanResult[];
  addExecution: (execution: ScanExecution) => void;
  updateExecution: (id: string, updates: Partial<ScanExecution>) => void;
  removeExecution: (id: string) => void;
  addResult: (result: ScanResult) => void;
  clearResults: () => void;
}

export const useOSINTStore = create<OSINTState>((set) => ({
  activeExecutions: new Map(),
  recentResults: [],

  addExecution: (execution) =>
    set((state) => {
      const newMap = new Map(state.activeExecutions);
      newMap.set(execution.id, execution);
      return { activeExecutions: newMap };
    }),

  updateExecution: (id, updates) =>
    set((state) => {
      const newMap = new Map(state.activeExecutions);
      const existing = newMap.get(id);
      if (existing) {
        newMap.set(id, { ...existing, ...updates });
      }
      return { activeExecutions: newMap };
    }),

  removeExecution: (id) =>
    set((state) => {
      const newMap = new Map(state.activeExecutions);
      newMap.delete(id);
      return { activeExecutions: newMap };
    }),

  addResult: (result) =>
    set((state) => ({
      recentResults: [result, ...state.recentResults].slice(0, 50),
    })),

  clearResults: () => set({ recentResults: [] }),
}));
