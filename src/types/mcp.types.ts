// MCP (Model Context Protocol) Types

export interface MCPTool {
  name: string;
  description: string;
  inputSchema?: {
    type: string;
    properties?: Record<string, {
      type: string;
      description?: string;
    }>;
    required?: string[];
  };
}

export interface MCPResource {
  uri: string;
  name: string;
  description?: string;
  mimeType?: string;
}

export interface MCPServer {
  id: string;
  name: string;
  url: string;
  isConnected: boolean;
  tools: MCPTool[];
  resources: MCPResource[];
  lastConnected?: string;
}

export interface MCPToolCallRequest {
  name: string;
  arguments: Record<string, unknown>;
}

export interface MCPToolCallResponse {
  content: Array<{
    type: string;
    text?: string;
    data?: unknown;
  }>;
  isError?: boolean;
}

export interface MCPInitializeResponse {
  protocolVersion: string;
  capabilities: {
    tools?: Record<string, unknown>;
    resources?: Record<string, unknown>;
    prompts?: Record<string, unknown>;
  };
  serverInfo: {
    name: string;
    version: string;
  };
}

export interface MCPListToolsResponse {
  tools: MCPTool[];
}

export interface MCPListResourcesResponse {
  resources: MCPResource[];
}
