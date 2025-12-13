import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const WebScraping = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'webscraping')!;
  const tools = getToolsByCategory('webscraping');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default WebScraping;
