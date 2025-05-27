
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useFormPersistence } from '@/hooks/useFormPersistence';

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
  // Use form persistence for the main form state
  const {
    values: persistedValues,
    updateValue: updatePersistedValue,
    clearPersistedData,
    isLoaded: isPersistenceLoaded
  } = useFormPersistence({
    key: 'short_form_content',
    defaultValues: {
      selectedICP: "",
      selectedAuthor: "",
      selectedAuthorTone: "",
      selectedAuthorExperience: "",
      contentGoal: "learn_more" as ContentGoal,
      additionalContext: "",
      selectedSuccessStory: "none",
      wordCount: 300,
      emailCount: 3,
      selectedIdeaId: null as string | null
    }
  });

  const [selectedICP, setSelectedICP] = useState<string>(persistedValues.selectedICP);
  const [selectedAuthor, setSelectedAuthor] = useState<string>(persistedValues.selectedAuthor);
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>(persistedValues.selectedAuthorTone);
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>(persistedValues.selectedAuthorExperience);
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>(persistedValues.contentGoal);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState<string>(persistedValues.additionalContext);
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>(persistedValues.selectedSuccessStory);
  const [wordCount, setWordCount] = useState<number>(persistedValues.wordCount);
  const [emailCount, setEmailCount] = useState<number>(persistedValues.emailCount);
  const [availableAnchors, setAvailableAnchors] = useState<{value: string, label: string}[]>([]);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(persistedValues.selectedIdeaId);
  
  const { toast } = useToast();

  // Update local state when persisted values load
  useEffect(() => {
    if (isPersistenceLoaded) {
      setSelectedICP(persistedValues.selectedICP);
      setSelectedAuthor(persistedValues.selectedAuthor);
      setSelectedAuthorTone(persistedValues.selectedAuthorTone);
      setSelectedAuthorExperience(persistedValues.selectedAuthorExperience);
      setContentGoal(persistedValues.contentGoal);
      setAdditionalContext(persistedValues.additionalContext);
      setSelectedSuccessStory(persistedValues.selectedSuccessStory);
      setWordCount(persistedValues.wordCount);
      setEmailCount(persistedValues.emailCount);
      setSelectedIdeaId(persistedValues.selectedIdeaId);
    }
  }, [isPersistenceLoaded, persistedValues]);

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
    updatePersistedValue('selectedAuthorTone', "");
    updatePersistedValue('selectedAuthorExperience', "");
  }, [selectedAuthor]);

  // Custom setters that also update persistence
  const setSelectedICPWithPersistence = (value: string) => {
    setSelectedICP(value);
    updatePersistedValue('selectedICP', value);
  };

  const setSelectedAuthorWithPersistence = (value: string) => {
    setSelectedAuthor(value);
    updatePersistedValue('selectedAuthor', value);
  };

  const setSelectedAuthorToneWithPersistence = (value: string) => {
    setSelectedAuthorTone(value);
    updatePersistedValue('selectedAuthorTone', value);
  };

  const setSelectedAuthorExperienceWithPersistence = (value: string) => {
    setSelectedAuthorExperience(value);
    updatePersistedValue('selectedAuthorExperience', value);
  };

  const setContentGoalWithPersistence = (value: ContentGoal) => {
    setContentGoal(value);
    updatePersistedValue('contentGoal', value);
  };

  const setAdditionalContextWithPersistence = (value: string) => {
    setAdditionalContext(value);
    updatePersistedValue('additionalContext', value);
  };

  const setSelectedSuccessStoryWithPersistence = (value: string) => {
    setSelectedSuccessStory(value);
    updatePersistedValue('selectedSuccessStory', value);
  };

  const setWordCountWithPersistence = (value: number) => {
    setWordCount(value);
    updatePersistedValue('wordCount', value);
  };

  const setEmailCountWithPersistence = (value: number) => {
    setEmailCount(value);
    updatePersistedValue('emailCount', value);
  };

  const setSelectedIdeaIdWithPersistence = (value: string | null) => {
    setSelectedIdeaId(value);
    updatePersistedValue('selectedIdeaId', value);
  };

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
    setSelectedICP: setSelectedICPWithPersistence,
    setSelectedAuthor: setSelectedAuthorWithPersistence,
    setSelectedAuthorTone: setSelectedAuthorToneWithPersistence,
    setSelectedAuthorExperience: setSelectedAuthorExperienceWithPersistence,
    setNarrativeSelections,
    setContentGoal: setContentGoalWithPersistence,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext: setAdditionalContextWithPersistence,
    setSelectedSuccessStory: setSelectedSuccessStoryWithPersistence,
    setWordCount: setWordCountWithPersistence,
    setEmailCount: setEmailCountWithPersistence,
    setSelectedIdeaId: setSelectedIdeaIdWithPersistence,
    clearPersistedData
  };
};
