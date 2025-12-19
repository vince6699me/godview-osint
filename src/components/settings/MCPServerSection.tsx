import { useState } from 'react';
import { 
  Terminal, 
  Loader2, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Plus, 
  Wrench,
  RefreshCw,
  ChevronDown,
  ChevronUp 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useMCPStore } from '@/store/mcpStore';
import { createMCPClient } from '@/services/mcpClient';
import { toast } from 'sonner';
import { cn } from '@/utils/cn';
import type { MCPTool } from '@/types/mcp.types';

const PRESET_SERVERS = [
  { name: 'Kali Linux MCP (Local)', url: 'http://localhost:5000' },
  { name: 'Custom MCP Server', url: '' },
];

const MCPServerSection = () => {
  const {
    servers,
    activeServerId,
    addServer,
    updateServer,
    removeServer,
    setActiveServer,
    updateServerTools,
    updateServerResources,
  } = useMCPStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newServerName, setNewServerName] = useState('');
  const [newServerUrl, setNewServerUrl] = useState('http://localhost:5000');
  const [isTesting, setIsTesting] = useState<string | null>(null);
  const [expandedServer, setExpandedServer] = useState<string | null>(null);

  const testAndConnect = async (serverId: string, serverUrl: string) => {
    setIsTesting(serverId);

    try {
      const client = createMCPClient(serverUrl);
      
      // Initialize connection
      const initResponse = await client.initialize();
      console.log('MCP Server initialized:', initResponse);

      // Fetch available tools
      let tools: MCPTool[] = [];
      try {
        const toolsResponse = await client.listTools();
        tools = toolsResponse.tools || [];
      } catch (e) {
        console.log('No tools endpoint or empty tools list');
      }

      // Fetch available resources
      let resources: { uri: string; name: string; description?: string }[] = [];
      try {
        const resourcesResponse = await client.listResources();
        resources = resourcesResponse.resources || [];
      } catch (e) {
        console.log('No resources endpoint or empty resources list');
      }

      updateServer(serverId, {
        isConnected: true,
        lastConnected: new Date().toISOString(),
      });
      updateServerTools(serverId, tools);
      updateServerResources(serverId, resources);

      toast.success(`Connected to ${initResponse.serverInfo?.name || 'MCP Server'}! Found ${tools.length} tools.`);
    } catch (error) {
      console.error('Failed to connect to MCP server:', error);
      updateServer(serverId, {
        isConnected: false,
        tools: [],
        resources: [],
      });
      toast.error(error instanceof Error ? error.message : 'Failed to connect to MCP server');
    } finally {
      setIsTesting(null);
    }
  };

  const handleAddServer = async () => {
    if (!newServerName.trim() || !newServerUrl.trim()) {
      toast.error('Please enter server name and URL');
      return;
    }

    const id = addServer({
      name: newServerName.trim(),
      url: newServerUrl.trim(),
      isConnected: false,
      tools: [],
      resources: [],
    });

    await testAndConnect(id, newServerUrl.trim());

    setNewServerName('');
    setNewServerUrl('http://localhost:5000');
    setIsAdding(false);
  };

  const handlePresetSelect = (preset: typeof PRESET_SERVERS[0]) => {
    setNewServerName(preset.name);
    setNewServerUrl(preset.url);
  };

  const handleRemoveServer = (id: string) => {
    removeServer(id);
    toast.info('MCP server removed');
  };

  const toggleServerExpand = (id: string) => {
    setExpandedServer(expandedServer === id ? null : id);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">MCP Servers</h2>
        </div>
        <Button onClick={() => setIsAdding(true)} size="sm" disabled={isAdding}>
          <Plus className="w-4 h-4 mr-2" />
          Add Server
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        Connect to MCP (Model Context Protocol) servers to access external tools like Kali Linux security tools.
      </p>

      {servers.length === 0 && !isAdding && (
        <div className="glass-card p-8 text-center">
          <Terminal className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground mb-4">No MCP servers configured</p>
          <Button onClick={() => {
            setIsAdding(true);
            handlePresetSelect(PRESET_SERVERS[0]);
          }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Kali Linux MCP Server
          </Button>
        </div>
      )}

      {servers.map((server) => (
        <div
          key={server.id}
          className={cn(
            'glass-card p-4 transition-all',
            activeServerId === server.id && 'ring-2 ring-primary'
          )}
        >
          <div 
            className="flex items-start justify-between cursor-pointer"
            onClick={() => setActiveServer(server.id)}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center',
                server.isConnected ? 'bg-green-500/20' : 'bg-muted'
              )}>
                <Terminal className={cn(
                  'w-5 h-5',
                  server.isConnected ? 'text-green-500' : 'text-muted-foreground'
                )} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{server.name}</h3>
                  {server.isConnected ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <XCircle className="w-4 h-4 text-destructive" />
                  )}
                  {activeServerId === server.id && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground font-mono">{server.url}</p>
                {server.tools.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    <Wrench className="w-3 h-3 inline mr-1" />
                    {server.tools.length} tools available
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  testAndConnect(server.id, server.url);
                }}
                disabled={isTesting === server.id}
              >
                {isTesting === server.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleServerExpand(server.id);
                }}
              >
                {expandedServer === server.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveServer(server.id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Expanded Tools View */}
          {expandedServer === server.id && server.tools.length > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Wrench className="w-4 h-4" />
                Available Tools
              </h4>
              <div className="grid gap-2 max-h-64 overflow-y-auto">
                {server.tools.map((tool) => (
                  <div 
                    key={tool.name} 
                    className="p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="font-mono text-sm text-primary">{tool.name}</div>
                    {tool.description && (
                      <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add New Server Form */}
      {isAdding && (
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-semibold">Add MCP Server</h3>
          
          <div className="flex gap-2 flex-wrap">
            {PRESET_SERVERS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset)}
                className={cn(
                  newServerName === preset.name && 'ring-2 ring-primary'
                )}
              >
                {preset.name}
              </Button>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverName">Server Name</Label>
            <Input
              id="serverName"
              placeholder="Kali Linux MCP"
              value={newServerName}
              onChange={(e) => setNewServerName(e.target.value)}
              className="bg-secondary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="serverUrl">Server URL</Label>
            <Input
              id="serverUrl"
              placeholder="http://localhost:5000"
              value={newServerUrl}
              onChange={(e) => setNewServerUrl(e.target.value)}
              className="bg-secondary"
            />
            <p className="text-xs text-muted-foreground">
              The MCP server should be running locally on port 5000
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleAddServer} className="flex-1">
              Connect Server
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsAdding(false);
                setNewServerName('');
                setNewServerUrl('http://localhost:5000');
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPServerSection;
