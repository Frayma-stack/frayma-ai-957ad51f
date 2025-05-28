
import { GeneratedIdea } from '@/types/ideas';

export const useIdeaSummarization = () => {
  const summarizeIdeaForContent = async (idea: GeneratedIdea): Promise<string> => {
    // Create a summary that can be used as trigger input for new idea generation
    const summary = `${idea.title}

Narrative Foundation: ${idea.narrative}

${idea.productTieIn ? `Product Connection: ${idea.productTieIn}` : ''}

${idea.cta ? `Call to Action: ${idea.cta}` : ''}

This idea can serve as inspiration and foundation for generating new related content concepts.`;

    return summary;
  };

  return {
    summarizeIdeaForContent
  };
};
