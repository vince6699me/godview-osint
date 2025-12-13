import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const UsernameSearch = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'username')!;
  const tools = getToolsByCategory('username');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default UsernameSearch;
