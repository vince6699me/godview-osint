import { useState } from 'react';
import { Settings as SettingsIcon, Loader2, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useModelProviderStore, ModelInfo } from '@/store/modelProviderStore';
import { toast } from 'sonner';

const Settings = () => {
  const {
    apiUrl,
    apiKey,
    selectedModel,
    availableModels,
    isConnected,
    setApiUrl,
    setApiKey,
    setSelectedModel,
    setAvailableModels,
    setIsConnected,
    clearCredentials,
  } = useModelProviderStore();

  const [tempApiUrl, setTempApiUrl] = useState(apiUrl);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const testCredentials = async () => {
    if (!tempApiUrl.trim() || !tempApiKey.trim()) {
      toast.error('Please enter both API URL and API Key');
      return;
    }

    setIsTesting(true);
    setTestStatus('idle');

    try {
      // Normalize the URL
      let baseUrl = tempApiUrl.trim();
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      // Try to fetch models from the OpenAI-compatible endpoint
      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${tempApiKey.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Parse models from OpenAI-compatible response
      let models: ModelInfo[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        models = data.data.map((model: any) => ({
          id: model.id,
          name: model.id,
        }));
      } else if (Array.isArray(data)) {
        models = data.map((model: any) => ({
          id: model.id || model.name || model,
          name: model.name || model.id || model,
        }));
      }

      if (models.length === 0) {
        throw new Error('No models found in the response');
      }

      // Save credentials and models
      setApiUrl(baseUrl);
      setApiKey(tempApiKey.trim());
      setAvailableModels(models);
      setIsConnected(true);
      setTestStatus('success');
      
      toast.success(`Connected! Found ${models.length} models`);
    } catch (error) {
      console.error('Failed to test credentials:', error);
      setTestStatus('error');
      setIsConnected(false);
      setAvailableModels([]);
      toast.error(error instanceof Error ? error.message : 'Failed to connect to API');
    } finally {
      setIsTesting(false);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    toast.success(`Selected model: ${modelId}`);
  };

  const handleClear = () => {
    clearCredentials();
    setTempApiUrl('');
    setTempApiKey('');
    setTestStatus('idle');
    toast.info('Credentials cleared');
  };

  return (
    <div className="p-6 max-w-2xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Configure your AI model provider</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            Model Provider Configuration
            {isConnected && (
              <span className="flex items-center gap-1 text-sm font-normal text-green-500">
                <CheckCircle className="w-4 h-4" />
                Connected
              </span>
            )}
          </h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiUrl">API URL (OpenAI-compatible)</Label>
              <Input
                id="apiUrl"
                placeholder="https://api.openai.com/v1"
                value={tempApiUrl}
                onChange={(e) => setTempApiUrl(e.target.value)}
                className="bg-secondary"
              />
              <p className="text-xs text-muted-foreground">
                Enter the base URL for your OpenAI-compatible API (e.g., OpenAI, Ollama, LM Studio, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                placeholder="sk-..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className="bg-secondary"
              />
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={testCredentials} 
                disabled={isTesting || !tempApiUrl.trim() || !tempApiKey.trim()}
                className="flex-1"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : testStatus === 'success' ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Connected
                  </>
                ) : testStatus === 'error' ? (
                  <>
                    <XCircle className="w-4 h-4 mr-2" />
                    Retry
                  </>
                ) : (
                  'Test & Load Models'
                )}
              </Button>
              
              {isConnected && (
                <Button variant="destructive" size="icon" onClick={handleClear}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {availableModels.length > 0 && (
          <div className="space-y-2 pt-4 border-t border-border">
            <Label>Select Model</Label>
            <Select value={selectedModel} onValueChange={handleModelSelect}>
              <SelectTrigger className="bg-secondary">
                <SelectValue placeholder="Choose a model..." />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              This model will be used in the AI Chat panel
            </p>
          </div>
        )}

        {selectedModel && (
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm">
              <span className="text-muted-foreground">Active model:</span>{' '}
              <span className="font-mono text-primary">{selectedModel}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
