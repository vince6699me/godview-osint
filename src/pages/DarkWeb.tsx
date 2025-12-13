import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const DarkWeb = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'darkweb')!;
  const tools = getToolsByCategory('darkweb');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default DarkWeb;
