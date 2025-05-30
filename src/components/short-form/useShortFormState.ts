
import { useState, useEffect } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory, NarrativeSelection, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ContentType, ContentGoal } from './types';
import { useToast } from '@/components/ui/use-toast';
import { useDraftAutoSave } from '@/hooks/useDraftAutoSave';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  contentType: ContentType;
  selectedClientId?: string;
}

interface ProductContextInputs {
  selectedProductContextType: 'features' | 'usecases' | 'differentiators' | '';
  selectedFeatures: ProductFeature[];
  selectedUseCases: ProductUseCase[];
  selectedDifferentiators: ProductDifferentiator[];
}

export const useShortFormState = ({
  scripts,
  authors,
  successStories,
  ideas,
  contentType,
  selectedClientId
}: UseShortFormStateProps) => {
  const { toast } = useToast();
  
  // Core form state
  const [selectedICP, setSelectedICP] = useState<string>('');
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>('');
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>('');
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>({ type: 'awareness', description: '' });
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [additionalContext, setAdditionalContext] = useState<string>('');
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>('');
  const [wordCount, setWordCount] = useState<number>(150);
  const [emailCount, setEmailCount] = useState<number>(3);
  const [selectedIdeaId, setSelectedIdeaId] = useState<string | null>(null);
  const [triggerInput, setTriggerInput] = useState<string>('');

  // Product Context state
  const [productInputs, setProductInputs] = useState<ProductContextInputs>({
    selectedProductContextType: '',
    selectedFeatures: [],
    selectedUseCases: [],
    selectedDifferentiators: []
  });

  console.log('🎯 useShortFormState - Current state:', {
    selectedICP,
    selectedAuthor,
    scriptsCount: scripts.length,
    authorsCount: authors.length,
    selectedClientId,
    contentType
  });

  // Auto-save functionality
  const {
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useDraftAutoSave({
    contentType,
    selectedClientId,
    formData: {
      selectedICP,
      selectedAuthor,
      selectedAuthorTone,
      selectedAuthorExperience,
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
    }
  });

  // Get client name for display
  const getClientName = () => {
    if (!selectedClientId) return '';
    
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      const clients = JSON.parse(savedClients);
      const client = clients.find((c: any) => c.id === selectedClientId);
      return client?.name || '';
    }
    return '';
  };

  const clientName = getClientName();

  // Filter data by selected client
  const getFilteredScripts = () => {
    console.log('🔍 Filtering scripts:', {
      selectedClientId,
      totalScripts: scripts.length,
      scriptsFirst3: scripts.slice(0, 3).map(s => ({ id: s.id, name: s.name, clientId: s.clientId }))
    });
    
    const filtered = selectedClientId 
      ? scripts.filter(script => script.clientId === selectedClientId)
      : scripts;
    
    console.log('🔍 Filtered scripts result:', {
      filteredCount: filtered.length,
      filteredFirst3: filtered.slice(0, 3).map(s => ({ id: s.id, name: s.name, clientId: s.clientId }))
    });
    
    return filtered;
  };

  const getFilteredAuthors = () => {
    console.log('🔍 Filtering authors:', {
      selectedClientId,
      totalAuthors: authors.length,
      authorsFirst3: authors.slice(0, 3).map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
    });
    
    const filtered = selectedClientId 
      ? authors.filter(author => author.clientId === selectedClientId)
      : authors;
    
    console.log('🔍 Filtered authors result:', {
      filteredCount: filtered.length,
      filteredFirst3: filtered.slice(0, 3).map(a => ({ id: a.id, name: a.name, clientId: a.clientId }))
    });
    
    return filtered;
  };

  const getFilteredSuccessStories = () => {
    return selectedClientId 
      ? successStories.filter(story => story.clientId === selectedClientId)
      : successStories;
  };

  // Get filtered data
  const filteredScripts = getFilteredScripts();
  const filteredAuthors = getFilteredAuthors();
  const filteredSuccessStories = getFilteredSuccessStories();

  // Get available narrative anchors
  const availableAnchors = [
    { value: 'belief', label: 'Core Beliefs' },
    { value: 'pain', label: 'Internal Pains' },
    { value: 'struggle', label: 'External Struggles' },
    { value: 'transformation', label: 'Desired Transformations' }
  ];

  const getSelectedIdea = () => {
    if (!selectedIdeaId) return null;
    return ideas.find(idea => idea.id === selectedIdeaId) || null;
  };

  return {
    // Core state
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
    triggerInput,
    productInputs,
    toast,
    getSelectedIdea,
    
    // Filtered data
    filteredScripts,
    filteredAuthors,
    filteredSuccessStories,
    
    // Setters
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
