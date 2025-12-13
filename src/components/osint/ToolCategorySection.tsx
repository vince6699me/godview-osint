import { motion } from 'framer-motion';
import { ToolCard } from './ToolCard';
import { OSINTTool } from '@/types/osint.types';

interface ToolCategorySectionProps {
  title: string;
  description: string;
  tools: OSINTTool[];
}

export const ToolCategorySection = ({ title, description, tools }: ToolCategorySectionProps) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold cyber-gradient-text">{title}</h1>
        <p className="text-muted-foreground mt-1">{description}</p>
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <ToolCard tool={tool} />
          </motion.div>
        ))}
      </div>

      {tools.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p>No tools available in this category yet.</p>
        </div>
      )}
    </div>
  );
};
