import { useCallback } from 'react';
import { useMCPStore } from '@/store/mcpStore';
import { createMCPClient } from '@/services/mcpClient';
import type { MCPToolCallRequest, MCPToolCallResponse } from '@/types/mcp.types';

export const useMCPTools = () => {
  const { getActiveServer, servers } = useMCPStore();

  const callTool = useCallback(async (
    toolName: string,
    args: Record<string, unknown>
  ): Promise<MCPToolCallResponse | null> => {
    const activeServer = getActiveServer();
    
    if (!activeServer?.isConnected) {
      console.error('No active MCP server connected');
      return null;
    }

    const client = createMCPClient(activeServer.url);
    
    try {
      const request: MCPToolCallRequest = {
        name: toolName,
        arguments: args,
      };
      
      const response = await client.callTool(request);
      return response;
    } catch (error) {
      console.error(`Failed to call MCP tool ${toolName}:`, error);
      throw error;
    }
  }, [getActiveServer]);

  const getAvailableTools = useCallback(() => {
    const activeServer = getActiveServer();
    return activeServer?.tools || [];
  }, [getActiveServer]);

  const getAllTools = useCallback(() => {
    return servers.flatMap((server) => 
      server.tools.map((tool) => ({
        ...tool,
        serverId: server.id,
        serverName: server.name,
      }))
    );
  }, [servers]);

  const isConnected = useCallback(() => {
    const activeServer = getActiveServer();
    return activeServer?.isConnected || false;
  }, [getActiveServer]);

  return {
    callTool,
    getAvailableTools,
    getAllTools,
    isConnected,
  };
};
