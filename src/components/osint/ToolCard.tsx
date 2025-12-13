import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Loader2, CheckCircle, XCircle, Copy, Download } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/utils/cn';
import { OSINTTool, ToolParameter } from '@/types/osint.types';
import { toast } from 'sonner';

interface ToolCardProps {
  tool: OSINTTool;
}

export const ToolCard = ({ tool }: ToolCardProps) => {
  const [params, setParams] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'running' | 'completed' | 'failed'>('idle');
  const [output, setOutput] = useState<string | null>(null);

  const handleParamChange = (name: string, value: string) => {
    setParams((prev) => ({ ...prev, [name]: value }));
  };

  const handleExecute = async () => {
    // Validate required params
    const missingRequired = tool.parameters
      .filter((p) => p.required && !params[p.name])
      .map((p) => p.name);

    if (missingRequired.length > 0) {
      toast.error(`Missing required parameters: ${missingRequired.join(', ')}`);
      return;
    }

    setStatus('running');
    setOutput(null);

    // Simulate execution
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setStatus('completed');
        setOutput(JSON.stringify({
          tool: tool.name,
          target: params[tool.parameters[0]?.name],
          results: [
            { platform: 'Twitter', url: 'https://twitter.com/example', found: true },
            { platform: 'Instagram', url: 'https://instagram.com/example', found: true },
            { platform: 'GitHub', url: 'https://github.com/example', found: false },
            { platform: 'LinkedIn', url: 'https://linkedin.com/in/example', found: true },
          ],
          scannedAt: new Date().toISOString(),
        }, null, 2));
        toast.success(`${tool.name} scan completed`);
      } else {
        setStatus('failed');
        setOutput('Error: Connection timeout. Please try again.');
        toast.error(`${tool.name} scan failed`);
      }
    }, tool.estimatedDuration * 50);
  };

  const handleCopy = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      toast.success('Copied to clipboard');
    }
  };

  const renderParameter = (param: ToolParameter) => {
    if (param.type === 'select' && param.options) {
      return (
        <Select
          value={params[param.name] || ''}
          onValueChange={(value) => handleParamChange(param.name, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${param.name}`} />
          </SelectTrigger>
          <SelectContent>
            {param.options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    return (
      <Input
        type={param.type === 'number' ? 'number' : 'text'}
        placeholder={param.description}
        value={params[param.name] || ''}
        onChange={(e) => handleParamChange(param.name, e.target.value)}
      />
    );
  };

  return (
    <Card className="glass-card overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              {tool.name}
              {status === 'running' && <Loader2 className="w-4 h-4 animate-spin text-cyber-orange" />}
              {status === 'completed' && <CheckCircle className="w-4 h-4 text-primary" />}
              {status === 'failed' && <XCircle className="w-4 h-4 text-destructive" />}
            </CardTitle>
            <CardDescription className="mt-1">{tool.description}</CardDescription>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            ~{tool.estimatedDuration}s
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Parameters */}
        <div className="space-y-3">
          {tool.parameters.map((param) => (
            <div key={param.name} className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                {param.name}
                {param.required && <span className="text-destructive">*</span>}
              </Label>
              {renderParameter(param)}
            </div>
          ))}
        </div>

        {/* Execute Button */}
        <Button
          onClick={handleExecute}
          disabled={status === 'running'}
          className="w-full gap-2"
        >
          {status === 'running' ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Execute
            </>
          )}
        </Button>

        {/* Output */}
        {output && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">Output</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleCopy}>
                  <Copy className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7">
                  <Download className="w-3 h-3" />
                </Button>
              </div>
            </div>
            <pre
              className={cn(
                'p-3 rounded-lg bg-background/50 text-xs font-mono overflow-x-auto max-h-48',
                status === 'failed' && 'text-destructive'
              )}
            >
              {output}
            </pre>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};
