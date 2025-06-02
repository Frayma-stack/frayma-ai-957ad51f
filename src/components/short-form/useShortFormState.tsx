
import { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  contentType: ContentType;
  selectedClientId?: string;
}

export const useShortFormState = ({
  scripts,
  authors,
  successStories,
  ideas,
  contentType,
  selectedClientId
}: UseShortFormStateProps) => {
  // Core form state
  const [selectedICP, setSelectedICP] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedAuthorTone, setSelectedAuthorTone] = useState('');
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState('');
  const [selectedAuthorBelief, setSelectedAuthorBelief] = useState('');
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>({ type: 'book_call', description: 'Book a call' });
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [additionalContext, setAdditionalContext] = useState('');
  const [selectedSuccessStory, setSelectedSuccessStory] = useState('');
  const [wordCount, setWordCount] = useState(150);
  const [emailCount, setEmailCount] = useState(3);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [triggerInput, setTriggerInput] = useState('');
  const [productInputs, setProductInputs] = useState<any>({});

  const { toast } = useToast();

  // Reset form when client changes
  useEffect(() => {
    console.log('🔄 Client changed, resetting form state:', { selectedClientId });
    setSelectedICP('');
    setSelectedAuthor('');
    setSelectedAuthorTone('');
    setSelectedAuthorExperience('');
    setSelectedAuthorBelief('');
    setNarrativeSelections([]);
    setAdditionalContext('');
    setSelectedSuccessStory('');
    setSelectedIdeaId(null);
    setTriggerInput('');
    setProductInputs({});
    setGeneratedContent('');
  }, [selectedClientId]);

  // Reset author-dependent selections when author changes
  useEffect(() => {
    console.log('👤 Author changed, resetting dependent selections:', { selectedAuthor });
    setSelectedAuthorTone('');
    setSelectedAuthorExperience('');
    setSelectedAuthorBelief('');
  }, [selectedAuthor]);

  // Derive client name from available data
  const clientName = useMemo(() => {
    if (!selectedClientId) return null;
    
    // Try to get client name from authors first (they have organization field)
    const authorWithClient = authors.find(a => a.clientId === selectedClientId);
    if (authorWithClient?.organization) return authorWithClient.organization;
    
    // For scripts and success stories, we don't have direct client name access
    // so we'll return null and let the parent component handle it
    return null;
  }, [selectedClientId, authors]);

  // Compute available anchors
  const availableAnchors = useMemo(() => {
    const selectedScript = scripts.find(script => script.id === selectedICP);
    if (!selectedScript) return [];

    const anchors = [];
    if (selectedScript.coreBeliefs?.length > 0) {
      anchors.push({ value: 'coreBeliefs', label: 'Core Beliefs' });
    }
    if (selectedScript.internalPains?.length > 0) {
      anchors.push({ value: 'internalPains', label: 'Internal Pains' });
    }
    if (selectedScript.externalStruggles?.length > 0) {
      anchors.push({ value: 'externalStruggles', label: 'External Struggles' });
    }
    if (selectedScript.desiredTransformations?.length > 0) {
      anchors.push({ value: 'desiredTransformations', label: 'Desired Transformations' });
    }
    return anchors;
  }, [selectedICP, scripts]);

  const getSelectedIdea = () => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  };

  return {
    // State
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
    selectedAuthorBelief,
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
    triggerInput,
    productInputs,
    toast,
    getSelectedIdea,
    
    // Setters
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setIsGenerating,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setProductInputs
  };
};
