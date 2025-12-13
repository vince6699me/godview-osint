import { getToolsByCategory, TOOL_CATEGORIES } from '@/config/tools.config';
import { ToolCategorySection } from '@/components/osint/ToolCategorySection';

const EmailInvestigation = () => {
  const category = TOOL_CATEGORIES.find(c => c.id === 'email')!;
  const tools = getToolsByCategory('email');

  return (
    <ToolCategorySection
      title={category.name}
      description={category.description}
      tools={tools}
    />
  );
};

export default EmailInvestigation;
