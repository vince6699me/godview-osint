import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MCPServer, MCPTool, MCPResource } from '@/types/mcp.types';

interface MCPState {
  servers: MCPServer[];
  activeServerId: string | null;
  addServer: (server: Omit<MCPServer, 'id'>) => string;
  updateServer: (id: string, updates: Partial<Omit<MCPServer, 'id'>>) => void;
  removeServer: (id: string) => void;
  setActiveServer: (id: string | null) => void;
  getActiveServer: () => MCPServer | null;
  updateServerTools: (id: string, tools: MCPTool[]) => void;
  updateServerResources: (id: string, resources: MCPResource[]) => void;
}

export const useMCPStore = create<MCPState>()(
  persist(
    (set, get) => ({
      servers: [],
      activeServerId: null,

      addServer: (server) => {
        const id = crypto.randomUUID();
        set((state) => ({
          servers: [...state.servers, { ...server, id }],
          activeServerId: state.activeServerId || id,
        }));
        return id;
      },

      updateServer: (id, updates) => {
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, ...updates } : s
          ),
        }));
      },

      removeServer: (id) => {
        set((state) => {
          const newServers = state.servers.filter((s) => s.id !== id);
          return {
            servers: newServers,
            activeServerId:
              state.activeServerId === id
                ? newServers[0]?.id || null
                : state.activeServerId,
          };
        });
      },

      setActiveServer: (id) => {
        set({ activeServerId: id });
      },

      getActiveServer: () => {
        const state = get();
        return state.servers.find((s) => s.id === state.activeServerId) || null;
      },

      updateServerTools: (id, tools) => {
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, tools } : s
          ),
        }));
      },

      updateServerResources: (id, resources) => {
        set((state) => ({
          servers: state.servers.map((s) =>
            s.id === id ? { ...s, resources } : s
          ),
        }));
      },
    }),
    {
      name: 'godview-mcp-servers',
    }
  )
);
