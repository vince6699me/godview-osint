import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const Automation = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'automation')!;
  const tools = getToolsByCategory('automation');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default Automation;
