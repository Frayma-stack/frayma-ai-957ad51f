
import { GeneratedIdea } from '@/types/ideas';

export const useIdeaSummary = () => {
  const generateIdeaSummary = (idea: GeneratedIdea): string => {
    const parts = [];
    
    if (idea.title) {
      parts.push(`Title: "${idea.title}"`);
    }
    
    if (idea.narrative) {
      const narrativeSnippet = idea.narrative.length > 150 
        ? idea.narrative.substring(0, 150) + "..."
        : idea.narrative;
      parts.push(`Core narrative: ${narrativeSnippet}`);
    }
    
    if (idea.productTieIn) {
      const productSnippet = idea.productTieIn.length > 100
        ? idea.productTieIn.substring(0, 100) + "..."
        : idea.productTieIn;
      parts.push(`Product connection: ${productSnippet}`);
    }

    if (idea.cta) {
      parts.push(`Suggested CTA: ${idea.cta}`);
    }

    return parts.join('. ') + '.';
  };

  const generateContentTrigger = (idea: GeneratedIdea): string => {
    const summary = generateIdeaSummary(idea);
    return `Use this saved idea as the foundation for content creation: ${summary} Build upon this narrative foundation while maintaining the core message and product connection.`;
  };

  return {
    generateIdeaSummary,
    generateContentTrigger
  };
};
