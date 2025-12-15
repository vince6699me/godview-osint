import { useState } from 'react';
import { Settings as SettingsIcon, Loader2, CheckCircle, XCircle, Trash2, Plus, Server } from 'lucide-react';
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
import { cn } from '@/utils/cn';

const PRESET_PROVIDERS = [
  { name: 'OpenAI', url: 'https://api.openai.com/v1' },
  { name: 'Anthropic', url: 'https://api.anthropic.com/v1' },
  { name: 'Ollama (Local)', url: 'http://localhost:11434/v1' },
  { name: 'LM Studio (Local)', url: 'http://localhost:1234/v1' },
  { name: 'OpenRouter', url: 'https://openrouter.ai/api/v1' },
  { name: 'Custom', url: '' },
];

const Settings = () => {
  const {
    providers,
    activeProviderId,
    selectedModel,
    addProvider,
    updateProvider,
    removeProvider,
    setActiveProvider,
    setSelectedModel,
    getActiveProvider,
  } = useModelProviderStore();

  const [isAdding, setIsAdding] = useState(false);
  const [newProviderName, setNewProviderName] = useState('');
  const [newProviderUrl, setNewProviderUrl] = useState('');
  const [newProviderKey, setNewProviderKey] = useState('');
  const [isTesting, setIsTesting] = useState<string | null>(null);

  const activeProvider = getActiveProvider();

  const testAndLoadModels = async (providerId: string, apiUrl: string, apiKey: string) => {
    setIsTesting(providerId);

    try {
      let baseUrl = apiUrl.trim();
      if (baseUrl.endsWith('/')) {
        baseUrl = baseUrl.slice(0, -1);
      }

      const response = await fetch(`${baseUrl}/models`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey.trim()}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API returned ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
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

      updateProvider(providerId, {
        availableModels: models,
        isConnected: true,
      });

      toast.success(`Connected! Found ${models.length} models`);
    } catch (error) {
      console.error('Failed to test credentials:', error);
      updateProvider(providerId, {
        availableModels: [],
        isConnected: false,
      });
      toast.error(error instanceof Error ? error.message : 'Failed to connect to API');
    } finally {
      setIsTesting(null);
    }
  };

  const handleAddProvider = async () => {
    if (!newProviderName.trim() || !newProviderUrl.trim()) {
      toast.error('Please enter provider name and API URL');
      return;
    }

    const id = addProvider({
      name: newProviderName.trim(),
      apiUrl: newProviderUrl.trim(),
      apiKey: newProviderKey.trim(),
      availableModels: [],
      isConnected: false,
    });

    if (newProviderKey.trim()) {
      await testAndLoadModels(id, newProviderUrl.trim(), newProviderKey.trim());
    }

    setNewProviderName('');
    setNewProviderUrl('');
    setNewProviderKey('');
    setIsAdding(false);
  };

  const handlePresetSelect = (url: string) => {
    const preset = PRESET_PROVIDERS.find(p => p.url === url);
    if (preset) {
      setNewProviderName(preset.name);
      setNewProviderUrl(preset.url);
    }
  };

  const handleModelSelect = (modelId: string) => {
    setSelectedModel(modelId);
    toast.success(`Selected model: ${modelId}`);
  };

  const handleRemoveProvider = (id: string) => {
    removeProvider(id);
    toast.info('Provider removed');
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your AI model providers</p>
          </div>
        </div>
      </div>

      {/* Provider List */}
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Model Providers</h2>
          <Button onClick={() => setIsAdding(true)} size="sm" disabled={isAdding}>
            <Plus className="w-4 h-4 mr-2" />
            Add Provider
          </Button>
        </div>

        {providers.length === 0 && !isAdding && (
          <div className="glass-card p-8 text-center">
            <Server className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground mb-4">No providers configured</p>
            <Button onClick={() => setIsAdding(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Provider
            </Button>
          </div>
        )}

        {providers.map((provider) => (
          <div
            key={provider.id}
            className={cn(
              'glass-card p-4 cursor-pointer transition-all',
              activeProviderId === provider.id && 'ring-2 ring-primary'
            )}
            onClick={() => setActiveProvider(provider.id)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn(
                  'w-10 h-10 rounded-lg flex items-center justify-center',
                  provider.isConnected ? 'bg-green-500/20' : 'bg-muted'
                )}>
                  <Server className={cn(
                    'w-5 h-5',
                    provider.isConnected ? 'text-green-500' : 'text-muted-foreground'
                  )} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{provider.name}</h3>
                    {provider.isConnected && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                    {activeProviderId === provider.id && (
                      <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">{provider.apiUrl}</p>
                  {provider.availableModels.length > 0 && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {provider.availableModels.length} models available
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
                    testAndLoadModels(provider.id, provider.apiUrl, provider.apiKey);
                  }}
                  disabled={isTesting === provider.id || !provider.apiKey}
                >
                  {isTesting === provider.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Test'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveProvider(provider.id);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {/* Add New Provider Form */}
        {isAdding && (
          <div className="glass-card p-6 space-y-4">
            <h3 className="font-semibold">Add New Provider</h3>
            
            <div className="space-y-2">
              <Label>Quick Select</Label>
              <Select onValueChange={handlePresetSelect}>
                <SelectTrigger className="bg-secondary">
                  <SelectValue placeholder="Choose a preset..." />
                </SelectTrigger>
                <SelectContent>
                  {PRESET_PROVIDERS.map((preset) => (
                    <SelectItem key={preset.name} value={preset.url || 'custom'}>
                      {preset.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerName">Provider Name</Label>
              <Input
                id="providerName"
                placeholder="My Provider"
                value={newProviderName}
                onChange={(e) => setNewProviderName(e.target.value)}
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerUrl">API URL (OpenAI-compatible)</Label>
              <Input
                id="providerUrl"
                placeholder="https://api.openai.com/v1"
                value={newProviderUrl}
                onChange={(e) => setNewProviderUrl(e.target.value)}
                className="bg-secondary"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="providerKey">API Key</Label>
              <Input
                id="providerKey"
                type="password"
                placeholder="sk-..."
                value={newProviderKey}
                onChange={(e) => setNewProviderKey(e.target.value)}
                className="bg-secondary"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleAddProvider} className="flex-1">
                Add Provider
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsAdding(false);
                  setNewProviderName('');
                  setNewProviderUrl('');
                  setNewProviderKey('');
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Model Selection for Active Provider */}
      {activeProvider && activeProvider.availableModels.length > 0 && (
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-lg font-semibold">
            Select Model from {activeProvider.name}
          </h2>
          
          <Select value={selectedModel} onValueChange={handleModelSelect}>
            <SelectTrigger className="bg-secondary">
              <SelectValue placeholder="Choose a model..." />
            </SelectTrigger>
            <SelectContent>
              {activeProvider.availableModels.map((model) => (
                <SelectItem key={model.id} value={model.id}>
                  {model.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedModel && (
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-sm">
                <span className="text-muted-foreground">Active model:</span>{' '}
                <span className="font-mono text-primary">{selectedModel}</span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Settings;
