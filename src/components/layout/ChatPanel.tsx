import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, Trash2, Bot, User, Loader2, Settings } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useChatStore } from '@/store/chatStore';
import { useModelProviderStore } from '@/store/modelProviderStore';
import { Button } from '@/components/ui/button';
import { ChatMessage } from '@/types/chat.types';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SUGGESTIONS = [
  "Find social media accounts for a username",
  "Check if an email has been breached",
  "Investigate a phone number",
  "Search for domain information",
];

export const ChatPanel = () => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  
  const { messages, isOpen, isStreaming, addMessage, updateMessage, togglePanel, clearMessages, setIsStreaming } = useChatStore();
  const { selectedModel, getActiveProvider } = useModelProviderStore();
  
  const activeProvider = getActiveProvider();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isStreaming) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    addMessage(userMessage);
    const userInput = input;
    setInput('');
    setIsStreaming(true);

    // Check if model provider is configured
    if (!activeProvider?.isConnected || !selectedModel || !activeProvider?.apiUrl || !activeProvider?.apiKey) {
      const aiMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: `I'll help you with that. Based on your request "${userInput}", I recommend using the appropriate OSINT tools from the sidebar. Would you like me to execute a specific tool?\n\n*Note: Configure an AI model in Settings for enhanced responses.*`,
        timestamp: new Date().toISOString(),
      };
      setTimeout(() => {
        addMessage(aiMessage);
        setIsStreaming(false);
      }, 500);
      return;
    }

    // Use the configured model provider
    const aiMessageId = crypto.randomUUID();
    const aiMessage: ChatMessage = {
      id: aiMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };
    addMessage(aiMessage);

    try {
      const chatMessages = [
        ...messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user' as const, content: userInput }
      ];

      const response = await fetch(`${activeProvider.apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeProvider.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: 'system', content: 'You are an OSINT (Open Source Intelligence) assistant. Help users with intelligence gathering, username searches, email investigations, and other security research tasks. Be helpful, informative, and security-conscious.' },
            ...chatMessages
          ],
          stream: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                if (content) {
                  fullContent += content;
                  updateMessage(aiMessageId, { content: fullContent });
                }
              } catch {
                // Skip malformed JSON
              }
            }
          }
        }
      }

      if (!fullContent) {
        // Handle non-streaming response
        const data = await response.json();
        fullContent = data.choices?.[0]?.message?.content || 'No response received';
        updateMessage(aiMessageId, { content: fullContent });
      }
    } catch (error) {
      console.error('Chat error:', error);
      updateMessage(aiMessageId, { 
        content: `Error communicating with the AI model. Please check your settings.\n\nError: ${error instanceof Error ? error.message : 'Unknown error'}` 
      });
      toast.error('Failed to get AI response');
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-screen w-[400px] bg-card border-l border-border z-50 flex flex-col"
        >
          {/* Header */}
          <div className="h-16 flex items-center justify-between px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">AI Assistant</h3>
                <p className="text-xs text-muted-foreground">
                  {activeProvider?.isConnected && selectedModel ? (
                    <span className="font-mono">{activeProvider.name}: {selectedModel}</span>
                  ) : (
                    'No model configured'
                  )}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Link to="/settings">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={clearMessages}
                className="h-8 w-8 text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePanel}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Bot className="w-8 h-8 text-primary" />
                </div>
                <h4 className="font-semibold mb-2">How can I help?</h4>
                <p className="text-sm text-muted-foreground mb-6">
                  I can help you execute OSINT tools and analyze results.
                </p>
                <div className="space-y-2 w-full">
                  {SUGGESTIONS.map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="w-full text-left px-3 py-2 rounded-lg bg-secondary hover:bg-secondary/80 text-sm transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    'flex gap-3',
                    message.role === 'user' && 'flex-row-reverse'
                  )}
                >
                  <div
                    className={cn(
                      'w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center',
                      message.role === 'user' ? 'bg-accent' : 'bg-primary/20'
                    )}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-accent-foreground" />
                    ) : (
                      <Bot className="w-4 h-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-2.5 rounded-2xl text-sm',
                      message.role === 'user'
                        ? 'bg-accent text-accent-foreground rounded-tr-sm'
                        : 'bg-secondary rounded-tl-sm'
                    )}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))
            )}
            {isStreaming && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
                <div className="bg-secondary px-4 py-2.5 rounded-2xl rounded-tl-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="relative">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about OSINT tools..."
                rows={1}
                className={cn(
                  'w-full resize-none rounded-xl bg-secondary border border-border',
                  'px-4 py-3 pr-12 text-sm',
                  'focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary',
                  'placeholder:text-muted-foreground'
                )}
                style={{ minHeight: '48px', maxHeight: '120px' }}
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim() || isStreaming}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-lg"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
