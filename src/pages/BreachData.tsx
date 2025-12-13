import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const BreachData = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'breach')!;
  const tools = getToolsByCategory('breach');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default BreachData;
