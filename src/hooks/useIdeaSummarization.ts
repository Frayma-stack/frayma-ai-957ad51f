
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { GeneratedIdea } from '@/types/ideas';

export const useIdeaSummarization = () => {
  const { generateContent } = useChatGPT();

  const summarizeIdeaForContent = async (idea: GeneratedIdea): Promise<string> => {
    const prompt = `You are a content strategist tasked with summarizing saved ideas for content creation. 

Given the following saved idea, create a concise trigger/thesis/anti-thesis summary that can be used as the foundation for creating sales emails, LinkedIn posts, or custom content.

Saved Idea Details:
- Title: ${idea.title}
- Narrative: ${idea.narrative || 'Not provided'}
- Product Tie-in: ${idea.productTieIn || 'Not provided'}
- Call to Action: ${idea.cta || 'Not provided'}

Please provide a summary that:
1. Captures the core message and value proposition
2. Maintains the key insights from the narrative
3. Is specific enough to guide content creation
4. Is concise but comprehensive (2-3 sentences maximum)

Format your response as a clear, actionable trigger statement that content creators can use as their starting point.`;

    try {
      const summary = await generateContent(prompt);
      return summary || `Based on saved idea "${idea.title}": ${idea.narrative || 'Core concept to be expanded for content creation.'}`;
    } catch (error) {
      console.error('Error summarizing idea:', error);
      // Fallback summary if API fails
      return `Based on saved idea "${idea.title}": ${idea.narrative || 'Core concept to be expanded for content creation.'}`;
    }
  };

  return {
    summarizeIdeaForContent
  };
};
