import { motion } from 'framer-motion';
import {
  Activity,
  Search,
  Clock,
  TrendingUp,
  Zap,
  Users,
  Mail,
  Shield,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TOOL_CATEGORIES, OSINT_TOOLS } from '@/config/tools.config';
import { cn } from '@/utils/cn';
import { useNavigate } from 'react-router-dom';

const stats = [
  { label: 'Scans Today', value: '24', change: '+12%', icon: Activity, color: 'text-primary' },
  { label: 'Active Scans', value: '3', change: 'Running', icon: Zap, color: 'text-cyber-orange' },
  { label: 'Total Results', value: '1,234', change: '+8%', icon: TrendingUp, color: 'text-accent' },
  { label: 'Avg Duration', value: '45s', change: '-5%', icon: Clock, color: 'text-cyber-purple' },
];

const recentScans = [
  { id: 1, tool: 'Sherlock', target: 'john_doe', status: 'completed', time: '2 min ago', results: 15 },
  { id: 2, tool: 'theHarvester', target: 'example.com', status: 'running', time: '5 min ago', results: null },
  { id: 3, tool: 'PhoneInfoga', target: '+1234567890', status: 'completed', time: '10 min ago', results: 8 },
  { id: 4, tool: 'Holehe', target: 'user@email.com', status: 'failed', time: '15 min ago', results: 0 },
];

const quickTools = [
  { id: 'sherlock', name: 'Sherlock', icon: Users, category: 'username' },
  { id: 'holehe', name: 'Holehe', icon: Mail, category: 'email' },
  { id: 'hibp', name: 'HaveIBeenPwned', icon: Shield, category: 'breach' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold cyber-gradient-text">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back. Here's your intelligence overview.</p>
        </div>
        <Button className="gap-2">
          <Play className="w-4 h-4" />
          New Scan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card glow-border">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-3xl font-bold mt-1 font-mono">{stat.value}</p>
                    <p className={cn('text-xs mt-1', stat.color)}>{stat.change}</p>
                  </div>
                  <div className={cn('w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Scans</CardTitle>
              <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate('/history')}>
                View All <ArrowRight className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Search className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{scan.tool}</p>
                        <p className="text-xs text-muted-foreground font-mono">{scan.target}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={cn(
                          'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                          scan.status === 'completed' && 'bg-primary/20 text-primary',
                          scan.status === 'running' && 'bg-cyber-orange/20 text-cyber-orange',
                          scan.status === 'failed' && 'bg-destructive/20 text-destructive'
                        )}
                      >
                        {scan.status === 'running' && (
                          <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 animate-pulse" />
                        )}
                        {scan.status}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">{scan.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickTools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => navigate(`/${tool.category}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-all hover:translate-x-1"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <tool.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{tool.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{tool.category}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 ml-auto text-muted-foreground" />
                </button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tool Categories */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Tool Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {TOOL_CATEGORIES.slice(0, 8).map((category) => {
                const toolCount = OSINT_TOOLS.filter(t => t.category === category.id).length;
                return (
                  <button
                    key={category.id}
                    onClick={() => navigate(`/${category.id}`)}
                    className="flex items-center gap-3 p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-all text-left group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Zap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{category.name}</p>
                      <p className="text-xs text-muted-foreground">{toolCount} tools</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Dashboard;
