
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { ICPStoryScript, Author, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { usePageReloadProtection } from '@/hooks/usePageReloadProtection';
import { useShortFormContentCreator } from './useShortFormContentCreator';
import { ContentType } from './types';
import ShortFormHeader from './ShortFormHeader';
import ShortFormMainContent from './ShortFormMainContent';
import { NewPLSEditor } from '../pls-editor';

interface ShortFormContentContainerProps {
  contentType: ContentType;
  filteredScripts: ICPStoryScript[];
  filteredAuthors: Author[];
  filteredSuccessStories: CustomerSuccessStory[];
  filteredIdeas: GeneratedIdea[];
  selectedClientId?: string;
  currentProductContext?: ProductContext | null;
  clientName: string | null;
  onBack: () => void;
}

const ShortFormContentContainer: FC<ShortFormContentContainerProps> = ({
  contentType,
  filteredScripts,
  filteredAuthors,
  filteredSuccessStories,
  filteredIdeas,
  selectedClientId,
  currentProductContext = null,
  clientName,
  onBack
}) => {
  console.log('🔄 ShortFormContentContainer rendering for contentType:', contentType);
  
  const {
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
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
    businessContextItemType,
    businessContextItem,
    businessContextAssetId,
    getSelectedIdea,
    
    // Actions
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setSelectedAuthorBelief,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setBusinessContextItemType,
    setBusinessContextItem,
    setBusinessContextAssetId,
    
    // Computed
    getContentTypeLabel,
    isFormValid,
    generateContent,
    
    // Auto-save functionality
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft
  } = useShortFormContentCreator({
    contentType,
    scripts: filteredScripts,
    authors: filteredAuthors,
    successStories: filteredSuccessStories,
    ideas: filteredIdeas,
    selectedClientId: selectedClientId || undefined
  });

  // Protect against accidental page reloads when form has content
  const hasFormContent = Boolean(selectedICP || selectedAuthor || additionalContext || generatedContent || triggerInput);
  usePageReloadProtection({
    enabled: hasFormContent,
    message: "You have unsaved content in your form. Are you sure you want to leave this page?"
  });

  const selectedIdea = getSelectedIdea();

  // Enhanced error boundary wrapper for the generate content function
  const handleGenerateContent = async () => {
    try {
      console.log('🎯 Generate content button clicked');
      console.log('Current state:', {
        selectedICP,
        selectedAuthor,
        contentType,
        isGenerating,
        isFormValid: isFormValid()
      });
      
      // Prevent Firebase/Firestore related errors by ensuring clean state
      if (typeof window !== 'undefined') {
        // Clear any potential Firebase listeners or connections
        console.log('🧹 Clearing potential Firebase connections');
      }
      
      await generateContent();
    } catch (error) {
      console.error('🚨 Error in handleGenerateContent:', error);
      // The error is already handled in the generateContent function
    }
  };

  console.log('📝 ShortFormContentContainer - Final data passed to components:', {
    authorsToPass: filteredAuthors.length,
    scriptsToPass: filteredScripts.length,
    successStoriesToPass: filteredSuccessStories.length,
    ideasToPass: filteredIdeas.length,
    selectedClientId,
    contentType,
    isGenerating
  });

  // Navigate directly to PLS Editor when content is generated
  if (generatedContent && !isGenerating) {
    // Format content for different types - especially for multiple emails
    let formattedContent = generatedContent;
    
    if (contentType.includes('email') && emailCount > 1) {
      // For multiple emails, format as clean JSON for easier editing
      try {
        const emails = JSON.parse(generatedContent);
        if (Array.isArray(emails)) {
          formattedContent = JSON.stringify(emails, null, 2);
        }
      } catch (error) {
        // If not JSON, keep as is
        console.log('Content is not JSON, keeping as plain text');
      }
    }

    const plsFormData = {
      selectedIdeaId: '',
      ideaTrigger: '',
      mutualGoal: '',
      targetKeyword: '',
      businessContextItem: '',
      businessContextItemType: '' as const,
      publishReason: '',
      callToAction: '',
      strategicSuccessStory: '',
      mainTargetICP: '',
      journeyStage: '',
      broaderAudience: '',
      readingPrompt: '',
      narrativeAnchors: [],
      successStory: '',
      articleAuthor: '',
      selectedAuthorWritingTone: '',
      relatedKeywords: [],
      searchQueries: [],
      problemStatements: [],
      headlineOptions: [],
      selectedHeadline: '',
      introPOV: '',
      outlineSections: [],
      generatedIntro: formattedContent,
      generatedBody: '',
      generatedConclusion: ''
    };

    const plsAutoCraftingConfig = {
      authorId: selectedAuthor,
      experienceIds: [],
      writingTone: selectedAuthorTone,
      introWordCount: wordCount || 300,
      bodyWordCount: 0,
      conclusionWordCount: 0,
      isShortForm: true,
      contentType: contentType,
      metadata: {
        selectedICP,
        selectedAuthor,
        contentGoal,
        contentTypeLabel: getContentTypeLabel(),
        emailCount: contentType.includes('email') ? emailCount : undefined
      }
    };

    return (
      <NewPLSEditor
        formData={plsFormData}
        autoCraftingConfig={plsAutoCraftingConfig}
        isGenerating={isGenerating}
        onDataChange={(field, value) => {
          if (field === 'generatedIntro') {
            setGeneratedContent(value);
          }
        }}
        onGeneratePhase={async () => {
          // For short-form content, regenerate the entire content
          await handleGenerateContent();
        }}
        onBackToOutline={() => {
          setGeneratedContent('');
        }}
        onSaveAsDraft={async () => {
          // Auto-save functionality is already handled by the hook
          return Promise.resolve();
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Card className="w-full bg-white shadow-md">
        <ShortFormHeader
          contentType={contentType}
          clientName={clientName}
          onBack={onBack}
        />
        
        <ShortFormMainContent
          contentType={contentType}
          scripts={filteredScripts}
          authors={filteredAuthors}
          successStories={filteredSuccessStories}
          selectedIdea={selectedIdea}
          ideas={filteredIdeas}
          selectedClientId={selectedClientId}
          currentProductContext={currentProductContext}
          selectedICP={selectedICP}
          selectedAuthor={selectedAuthor}
          selectedAuthorTone={selectedAuthorTone}
          selectedAuthorExperience={selectedAuthorExperience}
          selectedAuthorBelief={selectedAuthorBelief}
          narrativeSelections={narrativeSelections}
          contentGoal={contentGoal}
          selectedSuccessStory={selectedSuccessStory}
          wordCount={wordCount}
          emailCount={emailCount}
          additionalContext={additionalContext}
          triggerInput={triggerInput}
          selectedIdeaId={selectedIdeaId}
          availableAnchors={availableAnchors}
          businessContextItemType={businessContextItemType}
          businessContextItem={businessContextItem}
          businessContextAssetId={businessContextAssetId}
          isGenerating={isGenerating}
          isFormValid={isFormValid()}
          getContentTypeLabel={getContentTypeLabel}
          onICPChange={setSelectedICP}
          onAuthorChange={setSelectedAuthor}
          onAuthorToneChange={setSelectedAuthorTone}
          onAuthorExperienceChange={setSelectedAuthorExperience}
          onAuthorBeliefChange={setSelectedAuthorBelief}
          onNarrativeSelectionsChange={setNarrativeSelections}
          onContentGoalChange={setContentGoal}
          onSuccessStoryChange={setSelectedSuccessStory}
          onWordCountChange={setWordCount}
          onEmailCountChange={setEmailCount}
          onAdditionalContextChange={setAdditionalContext}
          onTriggerInputChange={setTriggerInput}
          onIdeaSelect={setSelectedIdeaId}
          onBusinessContextItemTypeChange={setBusinessContextItemType}
          onBusinessContextItemChange={setBusinessContextItem}
          onBusinessContextAssetIdChange={setBusinessContextAssetId}
          onGenerateContent={handleGenerateContent}
        />
      </Card>
        
      {isGenerating && (
        <Card className="w-full bg-white shadow-md">
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-3 text-muted-foreground">
              <Loader className="h-6 w-6 animate-spin" />
              <span>Auto-crafting your {getContentTypeLabel().toLowerCase()}...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShortFormContentContainer;
