export interface ToolExecution {
  toolId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: unknown;
  executionId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  toolExecutions?: ToolExecution[];
}

export interface ChatContext {
  currentPage: string;
  currentTool?: string;
  recentExecutions: string[];
}
