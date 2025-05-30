
import { useToast } from "@/components/ui/use-toast";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { useFormPersistedState } from '@/hooks/useFormPersistedState';
import { useIdeaIntegration } from '@/hooks/useIdeaIntegration';
import { useClientNameResolver } from '@/hooks/useClientNameResolver';
import { useNarrativeAnchors } from '@/hooks/useNarrativeAnchors';
import { useAutoSaveIntegration } from '@/hooks/useAutoSaveIntegration';
import { useShortFormLocalState } from './state/useShortFormLocalState';
import { usePersistedStateMethods } from './state/usePersistedStateMethods';
import { useShortFormStateEffects } from './state/useShortFormStateEffects';

interface UseShortFormStateProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  contentType: string;
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
  const { toast } = useToast();
  
  // Use form persistence
  const {
    persistedValues,
    updatePersistedValue,
    clearPersistedData,
    isPersistenceLoaded
  } = useFormPersistedState();

  // Use local state
  const localState = useShortFormLocalState({ persistedValues });

  // Create persisted state methods
  const persistedMethods = usePersistedStateMethods({
    ...localState,
    updatePersistedValue
  });

  // Handle state effects
  useShortFormStateEffects({
    isPersistenceLoaded,
    persistedValues,
    selectedAuthor: localState.selectedAuthor,
    setSelectedICP: localState.setSelectedICP,
    setSelectedAuthor: localState.setSelectedAuthor,
    setSelectedAuthorTone: localState.setSelectedAuthorTone,
    setSelectedAuthorExperience: localState.setSelectedAuthorExperience,
    setContentGoal: localState.setContentGoal,
    setAdditionalContext: localState.setAdditionalContext,
    setSelectedSuccessStory: localState.setSelectedSuccessStory,
    setWordCount: localState.setWordCount,
    setEmailCount: localState.setEmailCount,
    setSelectedIdeaId: localState.setSelectedIdeaId,
    setTriggerInput: localState.setTriggerInput,
    updatePersistedValue
  });

  // Auto-save integration
  const autoSaveIntegration = useAutoSaveIntegration({
    contentType,
    clientId: selectedClientId,
    onDraftRestored: (title, content) => {
      toast({
        title: "Draft restored",
        description: "Your previous content has been restored.",
      });
    }
  });

  // Use client name resolver
  const { clientName } = useClientNameResolver({ scripts, authors, successStories });

  // Use idea integration
  const { getSelectedIdea } = useIdeaIntegration({
    ideas,
    selectedIdeaId: localState.selectedIdeaId,
    updatePersistedValue,
    setAdditionalContext: persistedMethods.setAdditionalContextWithPersistence,
    setContentGoal: persistedMethods.setContentGoalWithPersistence,
    additionalContext: localState.additionalContext
  });

  // Use narrative anchors
  const { availableAnchors } = useNarrativeAnchors({
    selectedICP: localState.selectedICP,
    scripts,
    narrativeSelections: localState.narrativeSelections,
    setNarrativeSelections: localState.setNarrativeSelections
  });

  return {
    // State
    ...localState,
    generatedContent: autoSaveIntegration.content,
    clientName,
    availableAnchors,
    
    // Methods
    toast,
    getSelectedIdea,
    ...persistedMethods,
    clearPersistedData,
    
    // Auto-save functionality
    isSaving: autoSaveIntegration.isSaving,
    lastSaved: autoSaveIntegration.lastSaved,
    showRestoreDialog: autoSaveIntegration.showRestoreDialog,
    setShowRestoreDialog: autoSaveIntegration.setShowRestoreDialog,
    availableDrafts: autoSaveIntegration.availableDrafts,
    handleRestoreDraft: autoSaveIntegration.handleRestoreDraft,
    handleDeleteDraft: autoSaveIntegration.handleDeleteDraft,
    clearCurrentDraft: autoSaveIntegration.clearCurrentDraft,
    setGeneratedContent: autoSaveIntegration.setContent,
    setIsGenerating: localState.setIsGenerating
  };
};
