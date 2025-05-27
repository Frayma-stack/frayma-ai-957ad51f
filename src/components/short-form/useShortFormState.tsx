
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
}

export const useShortFormState = ({
  scripts,
  authors,
  successStories,
  ideas
}: UseShortFormStateProps) => {
  const [selectedICP, setSelectedICP] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>("");
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>("");
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>("learn_more");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState<string>("");
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>("none");
  const [wordCount, setWordCount] = useState<number>(300);
  const [emailCount, setEmailCount] = useState<number>(3);
  const [availableAnchors, setAvailableAnchors] = useState<{value: string, label: string}[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  
  const { toast } = useToast();

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
      setAdditionalContext(`Based on saved idea: ${ideaSummary}`);
      
      // Pre-populate CTA if available
      if (selectedIdea.cta) {
        const ctaLower = selectedIdea.cta.toLowerCase();
        if (ctaLower.includes('call') || ctaLower.includes('meeting') || ctaLower.includes('demo')) {
          setContentGoal('book_call');
        } else if (ctaLower.includes('learn') || ctaLower.includes('discover') || ctaLower.includes('find out')) {
          setContentGoal('learn_more');
        } else if (ctaLower.includes('try') || ctaLower.includes('start') || ctaLower.includes('free')) {
          setContentGoal('try_product');
        }
      }
    } else {
      if (additionalContext.startsWith('Based on saved idea:')) {
        setAdditionalContext('');
      }
    }
  }, [selectedIdeaId]);

  // Determine client name
  useEffect(() => {
    if (scripts.length > 0 || authors.length > 0 || successStories.length > 0) {
      const scriptClientId = scripts.length > 0 ? scripts[0].clientId : undefined;
      const authorClientId = authors.length > 0 ? authors[0].clientId : undefined;
      const storyClientId = successStories.length > 0 ? successStories[0].clientId : undefined;
      
      const clientId = scriptClientId || authorClientId || storyClientId;
      if (clientId) {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          const clients = JSON.parse(savedClients);
          const client = clients.find((c: any) => c.id === clientId);
          if (client) {
            setClientName(client.name);
          }
        }
      } else {
        setClientName("All Clients");
      }
    } else {
      setClientName(null);
    }
  }, [scripts, authors, successStories]);

  // Update available narrative anchors when ICP changes
  useEffect(() => {
    if (selectedICP) {
      const script = scripts.find(script => script.id === selectedICP);
      if (script) {
        const options = [];
        
        if (script.coreBeliefs.some(item => item.content.trim())) {
          options.push({value: 'belief', label: 'Core Belief'});
        }
        
        if (script.internalPains.some(item => item.content.trim())) {
          options.push({value: 'pain', label: 'Internal Pain'});
        }
        
        if (script.externalStruggles.some(item => item.content.trim())) {
          options.push({value: 'struggle', label: 'External Struggle'});
        }
        
        if (script.desiredTransformations.some(item => item.content.trim())) {
          options.push({value: 'transformation', label: 'Desired Transformation'});
        }
        
        setAvailableAnchors(options);
        
        if (narrativeSelections.length === 0) {
          const firstOption = options[0]?.value as NarrativeAnchor;
          if (firstOption) {
            setNarrativeSelections([{ type: firstOption, items: [] }]);
          }
        }
      }
    }
  }, [selectedICP]);
  
  // Reset author tone and experience when author changes
  useEffect(() => {
    setSelectedAuthorTone("");
    setSelectedAuthorExperience("");
  }, [selectedAuthor]);

  return {
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    narrativeSelections,
    contentGoal,
    generatedContent,
    isGenerating,
    clientName,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    toast,
    getSelectedIdea,
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId
  };
};
