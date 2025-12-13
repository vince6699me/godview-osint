export type OSINTCategory =
  | 'username'
  | 'email'
  | 'phone'
  | 'webscraping'
  | 'socialmedia'
  | 'breach'
  | 'darkweb'
  | 'automation';

export interface ToolParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'select';
  required: boolean;
  description: string;
  options?: string[];
  validation?: string;
}

export interface OSINTTool {
  id: string;
  name: string;
  category: OSINTCategory;
  description: string;
  command: string;
  parameters: ToolParameter[];
  outputFormat: 'json' | 'text' | 'csv';
  estimatedDuration: number;
  icon?: string;
}

export interface ScanExecution {
  id: string;
  toolId: string;
  toolName: string;
  parameters: Record<string, unknown>;
  status: 'queued' | 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  duration?: number;
  output?: string;
  error?: string;
  userId: string;
}

export interface ScanResult {
  executionId: string;
  data: unknown;
  parsedData?: unknown;
  rawOutput: string;
  metadata: {
    toolName: string;
    target: string;
    timestamp: string;
  };
}

export interface ToolCategory {
  id: OSINTCategory;
  name: string;
  icon: string;
  description: string;
}
