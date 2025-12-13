import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const SocialMedia = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'socialmedia')!;
  const tools = getToolsByCategory('socialmedia');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default SocialMedia;
