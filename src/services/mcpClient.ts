import type {
  MCPInitializeResponse,
  MCPListToolsResponse,
  MCPListResourcesResponse,
  MCPToolCallRequest,
  MCPToolCallResponse,
} from '@/types/mcp.types';

class MCPClient {
  private baseUrl: string;
  private sessionId: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async request<T>(endpoint: string, body?: unknown): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.sessionId && { 'X-Session-Id': this.sessionId }),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MCP request failed: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  async initialize(): Promise<MCPInitializeResponse> {
    const response = await this.request<MCPInitializeResponse>('/mcp/initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {
        roots: { listChanged: true },
      },
      clientInfo: {
        name: 'GodView OSINT',
        version: '1.0.0',
      },
    });

    // Generate a session ID for subsequent requests
    this.sessionId = crypto.randomUUID();
    return response;
  }

  async listTools(): Promise<MCPListToolsResponse> {
    return this.request<MCPListToolsResponse>('/mcp/tools/list');
  }

  async listResources(): Promise<MCPListResourcesResponse> {
    return this.request<MCPListResourcesResponse>('/mcp/resources/list');
  }

  async callTool(request: MCPToolCallRequest): Promise<MCPToolCallResponse> {
    return this.request<MCPToolCallResponse>('/mcp/tools/call', {
      name: request.name,
      arguments: request.arguments,
    });
  }

  async readResource(uri: string): Promise<{ contents: Array<{ uri: string; text?: string; blob?: string }> }> {
    return this.request('/mcp/resources/read', { uri });
  }

  async ping(): Promise<boolean> {
    try {
      await this.request('/mcp/ping');
      return true;
    } catch {
      return false;
    }
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  setBaseUrl(url: string): void {
    this.baseUrl = url.replace(/\/$/, '');
  }
}

// Singleton instance for the default MCP server
let defaultClient: MCPClient | null = null;

export const getMCPClient = (baseUrl?: string): MCPClient => {
  if (baseUrl) {
    return new MCPClient(baseUrl);
  }
  if (!defaultClient) {
    defaultClient = new MCPClient('http://localhost:5000');
  }
  return defaultClient;
};

export const createMCPClient = (baseUrl: string): MCPClient => {
  return new MCPClient(baseUrl);
};

export type { MCPClient };
