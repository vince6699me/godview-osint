import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const PhoneNumber = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'phone')!;
  const tools = getToolsByCategory('phone');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default PhoneNumber;
