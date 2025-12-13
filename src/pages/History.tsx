import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, Eye, RotateCcw, Trash2, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/utils/cn';

const mockHistory = [
  { id: '1', tool: 'Sherlock', target: 'john_doe', status: 'completed', startedAt: '2024-01-15T10:30:00Z', duration: 28, results: 15 },
  { id: '2', tool: 'theHarvester', target: 'example.com', status: 'completed', startedAt: '2024-01-15T10:00:00Z', duration: 120, results: 45 },
  { id: '3', tool: 'PhoneInfoga', target: '+1234567890', status: 'failed', startedAt: '2024-01-15T09:30:00Z', duration: 15, results: 0 },
  { id: '4', tool: 'Holehe', target: 'user@email.com', status: 'completed', startedAt: '2024-01-14T16:00:00Z', duration: 30, results: 8 },
  { id: '5', tool: 'GHunt', target: 'test@gmail.com', status: 'completed', startedAt: '2024-01-14T14:00:00Z', duration: 20, results: 12 },
  { id: '6', tool: 'Maigret', target: 'target_user', status: 'completed', startedAt: '2024-01-14T12:00:00Z', duration: 60, results: 156 },
  { id: '7', tool: 'OnionSearch', target: 'marketplace', status: 'completed', startedAt: '2024-01-13T18:00:00Z', duration: 120, results: 23 },
  { id: '8', tool: 'Snusbase', target: 'admin@company.com', status: 'completed', startedAt: '2024-01-13T15:00:00Z', duration: 10, results: 3 },
];

const History = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [toolFilter, setToolFilter] = useState<string>('all');

  const filteredHistory = mockHistory.filter((item) => {
    const matchesSearch = item.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.tool.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesTool = toolFilter === 'all' || item.tool === toolFilter;
    return matchesSearch && matchesStatus && matchesTool;
  });

  const uniqueTools = [...new Set(mockHistory.map(h => h.tool))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold cyber-gradient-text">Scan History</h1>
          <p className="text-muted-foreground mt-1">View and manage your past OSINT scans</p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Export All
        </Button>
      </div>

      {/* Filters */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by tool or target..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="running">Running</SelectItem>
              </SelectContent>
            </Select>
            <Select value={toolFilter} onValueChange={setToolFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Tool" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tools</SelectItem>
                {uniqueTools.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* History Table */}
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Tool</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Target</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Duration</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Results</th>
                  <th className="text-left p-4 text-sm font-medium text-muted-foreground">Date</th>
                  <th className="text-right p-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                  >
                    <td className="p-4">
                      <span className="font-medium">{item.tool}</span>
                    </td>
                    <td className="p-4">
                      <code className="text-sm font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                        {item.target}
                      </code>
                    </td>
                    <td className="p-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          item.status === 'completed' && 'bg-primary/20 text-primary',
                          item.status === 'running' && 'bg-cyber-orange/20 text-cyber-orange',
                          item.status === 'failed' && 'bg-destructive/20 text-destructive'
                        )}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground font-mono">
                      {item.duration}s
                    </td>
                    <td className="p-4 text-sm font-mono">
                      {item.results}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(item.startedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredHistory.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No scans found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
