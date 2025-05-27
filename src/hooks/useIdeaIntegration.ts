
import { useState, useEffect } from 'react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummarization } from '@/hooks/useIdeaSummarization';

type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface UseIdeaIntegrationProps {
  ideas: GeneratedIdea[];
  selectedIdeaId: string | null;
  updatePersistedValue: (key: string, value: any) => void;
  setAdditionalContext: (value: string) => void;
  setContentGoal: (value: ContentGoal) => void;
  additionalContext: string;
}

export const useIdeaIntegration = ({
  ideas,
  selectedIdeaId,
  updatePersistedValue,
  setAdditionalContext,
  setContentGoal,
  additionalContext
}: UseIdeaIntegrationProps) => {
  const { summarizeIdeaForContent } = useIdeaSummarization();

  // Get the selected idea
  const getSelectedIdea = () => {
    if (!selectedIdeaId || !ideas) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  };

  // Generate idea summary for content generation
  const generateIdeaSummary = (idea: GeneratedIdea): string => {
    const parts = [];
    
    if (idea.title) {
      parts.push(`Title: "${idea.title}"`);
    }
    
    if (idea.narrative) {
      parts.push(`Core narrative: ${idea.narrative}`);
    }
    
    if (idea.productTieIn) {
      parts.push(`Product connection: ${idea.productTieIn}`);
    }
    
    if (idea.cta) {
      parts.push(`Suggested CTA: ${idea.cta}`);
    }

    return parts.join('. ');
  };

  // Update additional context when an idea is selected
  useEffect(() => {
    const selectedIdea = getSelectedIdea();
    if (selectedIdea) {
      const ideaSummary = generateIdeaSummary(selectedIdea);
      const newContext = `Based on saved idea: ${ideaSummary}`;
      setAdditionalContext(newContext);
      updatePersistedValue('additionalContext', newContext);
      
      // Pre-populate CTA if available
      if (selectedIdea.cta) {
        const ctaLower = selectedIdea.cta.toLowerCase();
        let newGoal: ContentGoal = 'learn_more';
        if (ctaLower.includes('call') || ctaLower.includes('meeting') || ctaLower.includes('demo')) {
          newGoal = 'book_call';
        } else if (ctaLower.includes('learn') || ctaLower.includes('discover') || ctaLower.includes('find out')) {
          newGoal = 'learn_more';
        } else if (ctaLower.includes('try') || ctaLower.includes('start') || ctaLower.includes('free')) {
          newGoal = 'try_product';
        }
        setContentGoal(newGoal);
        updatePersistedValue('contentGoal', newGoal);
      }
    } else {
      if (additionalContext.startsWith('Based on saved idea:')) {
        setAdditionalContext('');
        updatePersistedValue('additionalContext', '');
      }
    }
  }, [selectedIdeaId]);

  return {
    getSelectedIdea,
    generateIdeaSummary,
    summarizeIdeaForContent
  };
};
