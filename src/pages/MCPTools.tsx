import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Play, 
  Server, 
  Loader2, 
  ChevronDown, 
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Copy,
  Trash2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { useMCPStore } from '@/store/mcpStore';
import { useMCPTools } from '@/hooks/useMCPTools';
import { useMCPExecutionStore, type ToolExecution } from '@/store/mcpExecutionStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import type { MCPTool } from '@/types/mcp.types';
import { Link } from 'react-router-dom';

const MCPTools = () => {
  const { servers } = useMCPStore();
  const { callTool, isConnected } = useMCPTools();
  const { executions, addExecution, updateExecution, clearExecutions } = useMCPExecutionStore();
  const [selectedTool, setSelectedTool] = useState<MCPTool | null>(null);
  const [selectedServer, setSelectedServer] = useState<string>('');
  const [toolArgs, setToolArgs] = useState<Record<string, string>>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set());
  const [loadingExecutionId, setLoadingExecutionId] = useState<string | null>(null);

  const connectedServers = servers.filter(s => s.isConnected);
  const allTools = connectedServers.flatMap(server => 
    server.tools.map(tool => ({ ...tool, serverId: server.id, serverName: server.name }))
  );

  // Auto-expand first connected server
  useEffect(() => {
    if (connectedServers.length > 0 && expandedServers.size === 0) {
      setExpandedServers(new Set([connectedServers[0].id]));
    }
  }, [connectedServers]);

  const toggleServer = (serverId: string) => {
    setExpandedServers(prev => {
      const next = new Set(prev);
      if (next.has(serverId)) {
        next.delete(serverId);
      } else {
        next.add(serverId);
      }
      return next;
    });
  };

  const handleSelectTool = (tool: MCPTool & { serverName: string }) => {
    setSelectedTool(tool);
    setSelectedServer(tool.serverName);
    const initialArgs: Record<string, string> = {};
    if (tool.inputSchema?.properties) {
      Object.keys(tool.inputSchema.properties).forEach(key => {
        initialArgs[key] = '';
      });
    }
    setToolArgs(initialArgs);
  };

  const handleExecute = async () => {
    if (!selectedTool) return;

    setIsExecuting(true);
    const executionId = crypto.randomUUID();
    const startTime = Date.now();
    
    const newExecution: ToolExecution = {
      id: executionId,
      toolName: selectedTool.name,
      serverName: selectedServer,
      args: { ...toolArgs },
      response: null,
      error: null,
      timestamp: new Date().toISOString(),
    };
    
    addExecution(newExecution);
    setLoadingExecutionId(executionId);

    try {
      const response = await callTool(selectedTool.name, toolArgs);
      const duration = Date.now() - startTime;
      updateExecution(executionId, { response, duration });
      toast.success(`Tool "${selectedTool.name}" executed successfully`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const duration = Date.now() - startTime;
      updateExecution(executionId, { error: errorMessage, duration });
      toast.error(`Failed to execute tool: ${errorMessage}`);
    } finally {
      setIsExecuting(false);
      setLoadingExecutionId(null);
    }
  };

  const handleRerun = (execution: ToolExecution) => {
    const tool = allTools.find(t => t.name === execution.toolName);
    if (tool) {
      setSelectedTool(tool);
      setSelectedServer(execution.serverName);
      const args: Record<string, string> = {};
      Object.entries(execution.args).forEach(([key, value]) => {
        args[key] = String(value);
      });
      setToolArgs(args);
      toast.info(`Loaded "${execution.toolName}" - click Execute to run`);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const handleClearExecutions = () => {
    clearExecutions();
    toast.success('Execution history cleared');
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '';
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (!isConnected()) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-2xl bg-muted flex items-center justify-center mb-6">
              <Server className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold mb-2">No MCP Server Connected</h2>
            <p className="text-muted-foreground mb-6 max-w-md">
              Connect to an MCP server to access powerful tools like Kali Linux security utilities.
            </p>
            <Link to="/settings">
              <Button>
                Configure MCP Server
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">MCP Tools</h1>
          <p className="text-muted-foreground">
            Execute tools from connected MCP servers. {allTools.length} tools available.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tools List */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  Available Tools
                </CardTitle>
                <CardDescription>
                  Select a tool to configure and execute
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="px-4 pb-4">
                    {connectedServers.map(server => (
                      <div key={server.id} className="mb-4">
                        <button
                          onClick={() => toggleServer(server.id)}
                          className="flex items-center gap-2 w-full text-left py-2 hover:text-primary transition-colors"
                        >
                          {expandedServers.has(server.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                          <Server className="w-4 h-4 text-primary" />
                          <span className="font-medium text-sm">{server.name}</span>
                          <Badge variant="secondary" className="ml-auto text-xs">
                            {server.tools.length}
                          </Badge>
                        </button>
                        
                        {expandedServers.has(server.id) && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="ml-6 space-y-1"
                          >
                            {server.tools.map(tool => (
                              <button
                                key={tool.name}
                                onClick={() => handleSelectTool({ ...tool, serverName: server.name })}
                                className={cn(
                                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                                  selectedTool?.name === tool.name
                                    ? 'bg-primary/20 text-primary'
                                    : 'hover:bg-muted'
                                )}
                              >
                                <div className="font-medium truncate">{tool.name}</div>
                                <div className="text-xs text-muted-foreground truncate">
                                  {tool.description || 'No description'}
                                </div>
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Tool Configuration */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Tool Configuration</CardTitle>
                <CardDescription>
                  {selectedTool ? selectedTool.name : 'Select a tool to configure'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedTool ? (
                  <div className="space-y-4">
                    <div className="p-3 rounded-lg bg-muted/50">
                      <p className="text-sm text-muted-foreground">
                        {selectedTool.description || 'No description available'}
                      </p>
                    </div>

                    {selectedTool.inputSchema?.properties && (
                      <div className="space-y-4">
                        {Object.entries(selectedTool.inputSchema.properties).map(([key, prop]) => (
                          <div key={key}>
                            <Label htmlFor={key} className="flex items-center gap-2">
                              {key}
                              {selectedTool.inputSchema?.required?.includes(key) && (
                                <Badge variant="destructive" className="text-[10px] px-1 py-0">
                                  required
                                </Badge>
                              )}
                            </Label>
                            <p className="text-xs text-muted-foreground mb-2">
                              {prop.description || `Type: ${prop.type}`}
                            </p>
                            {prop.type === 'string' && (prop.description?.includes('content') || key.includes('content')) ? (
                              <Textarea
                                id={key}
                                value={toolArgs[key] || ''}
                                onChange={(e) => setToolArgs(prev => ({ ...prev, [key]: e.target.value }))}
                                placeholder={`Enter ${key}...`}
                                className="font-mono text-sm"
                                rows={4}
                              />
                            ) : (
                              <Input
                                id={key}
                                value={toolArgs[key] || ''}
                                onChange={(e) => setToolArgs(prev => ({ ...prev, [key]: e.target.value }))}
                                placeholder={`Enter ${key}...`}
                                className="font-mono"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <Button 
                      onClick={handleExecute} 
                      disabled={isExecuting}
                      className="w-full"
                    >
                      {isExecuting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Execute Tool
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <Terminal className="w-12 h-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">
                      Select a tool from the list to configure and execute it
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Execution Results */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-220px)]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Execution Results</CardTitle>
                    <CardDescription>
                      {executions.length} execution{executions.length !== 1 ? 's' : ''}
                    </CardDescription>
                  </div>
                  {executions.length > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearExecutions}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[calc(100vh-340px)]">
                  <div className="px-4 pb-4 space-y-3">
                    {executions.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <Play className="w-12 h-12 text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">
                          Execute a tool to see results here
                        </p>
                      </div>
                    ) : (
                      executions.map(execution => {
                        const isLoading = loadingExecutionId === execution.id;
                        return (
                          <motion.div
                            key={execution.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="p-3 bg-muted/30 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {isLoading ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                ) : execution.error ? (
                                  <AlertCircle className="w-4 h-4 text-destructive" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-green-500" />
                                )}
                                <span className="font-mono text-sm font-medium">
                                  {execution.toolName}
                                </span>
                                {execution.duration && (
                                  <Badge variant="outline" className="text-[10px] px-1">
                                    {formatDuration(execution.duration)}
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => handleRerun(execution)}
                                  title="Re-run with same arguments"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </Button>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTimestamp(execution.timestamp)}
                                </span>
                              </div>
                            </div>
                            
                            <div className="p-3">
                              {isLoading ? (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Executing...
                                </div>
                              ) : execution.error ? (
                                <div className="text-sm text-destructive">
                                  {execution.error}
                                </div>
                              ) : execution.response ? (
                                <div className="space-y-2">
                                  {execution.response.content.map((content, i) => (
                                    <div key={i} className="relative">
                                      <pre className="text-xs font-mono bg-muted/50 p-2 rounded overflow-x-auto max-h-48">
                                        {content.text || JSON.stringify(content.data, null, 2)}
                                      </pre>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={() => copyToClipboard(content.text || JSON.stringify(content.data))}
                                      >
                                        <Copy className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="text-sm text-muted-foreground">No response</div>
                              )}
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MCPTools;
