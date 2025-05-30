
import { useState, useEffect, useMemo } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useAutoSaveIntegration } from '@/hooks/useAutoSaveIntegration';

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
  const [contentGoal, setContentGoal] = useState<ContentGoal>('generate_leads');
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

  // Auto-save integration
  const {
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useAutoSaveIntegration({
    formData: {
      selectedICP,
      selectedAuthor,
      selectedAuthorTone,
      selectedAuthorExperience,
      selectedAuthorBelief,
      narrativeSelections,
      contentGoal,
      generatedContent,
      additionalContext,
      selectedSuccessStory,
      wordCount,
      emailCount,
      selectedIdeaId,
      triggerInput,
      productInputs
    },
    contentType,
    selectedClientId
  });

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
    
    // Try to get client name from scripts first
    const scriptWithClient = scripts.find(s => s.clientId === selectedClientId);
    if (scriptWithClient?.clientName) return scriptWithClient.clientName;
    
    // Then try authors
    const authorWithClient = authors.find(a => a.clientId === selectedClientId);
    if (authorWithClient?.organization) return authorWithClient.organization;
    
    // Finally try success stories
    const storyWithClient = successStories.find(s => s.clientId === selectedClientId);
    if (storyWithClient?.clientName) return storyWithClient.clientName;
    
    return null;
  }, [selectedClientId, scripts, authors, successStories]);

  // Compute available anchors
  const availableAnchors = useMemo(() => {
    const selectedScript = scripts.find(script => script.id === selectedICP);
    if (!selectedScript) return [];

    const anchors = [];
    if (selectedScript.painPoints?.length > 0) {
      anchors.push({ value: 'painPoints', label: 'Pain Points' });
    }
    if (selectedScript.currentSolutions?.length > 0) {
      anchors.push({ value: 'currentSolutions', label: 'Current Solutions' });
    }
    if (selectedScript.desiredOutcomes?.length > 0) {
      anchors.push({ value: 'desiredOutcomes', label: 'Desired Outcomes' });
    }
    if (selectedScript.jobsToComplete?.length > 0) {
      anchors.push({ value: 'jobsToComplete', label: 'Jobs to Complete' });
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
    setProductInputs,
    
    // Auto-save functionality
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  };
};
