import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MCPToolCallResponse } from '@/types/mcp.types';

export interface ToolExecution {
  id: string;
  toolName: string;
  serverName: string;
  args: Record<string, unknown>;
  response: MCPToolCallResponse | null;
  error: string | null;
  timestamp: string;
  duration?: number;
}

interface MCPExecutionState {
  executions: ToolExecution[];
  addExecution: (execution: ToolExecution) => void;
  updateExecution: (id: string, updates: Partial<ToolExecution>) => void;
  removeExecution: (id: string) => void;
  clearExecutions: () => void;
  getRecentExecutions: (limit?: number) => ToolExecution[];
}

const MAX_EXECUTIONS = 100;

export const useMCPExecutionStore = create<MCPExecutionState>()(
  persist(
    (set, get) => ({
      executions: [],

      addExecution: (execution) => {
        set((state) => ({
          executions: [execution, ...state.executions].slice(0, MAX_EXECUTIONS),
        }));
      },

      updateExecution: (id, updates) => {
        set((state) => ({
          executions: state.executions.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      removeExecution: (id) => {
        set((state) => ({
          executions: state.executions.filter((e) => e.id !== id),
        }));
      },

      clearExecutions: () => {
        set({ executions: [] });
      },

      getRecentExecutions: (limit = 10) => {
        return get().executions.slice(0, limit);
      },
    }),
    {
      name: 'godview-mcp-executions',
    }
  )
);
