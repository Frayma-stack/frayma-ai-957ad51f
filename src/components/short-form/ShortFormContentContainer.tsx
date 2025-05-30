
import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { ICPStoryScript, Author, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { usePageReloadProtection } from '@/hooks/usePageReloadProtection';
import { useShortFormContentCreator } from './useShortFormContentCreator';
import { ContentType } from './types';
import ShortFormHeader from './ShortFormHeader';
import ShortFormMainContent from './ShortFormMainContent';
import ContentGenerationDisplay from './ContentGenerationDisplay';

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
  const {
    // State
    selectedICP,
    selectedAuthor,
    selectedAuthorTone,
    selectedAuthorExperience,
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
    productInputs,
    getSelectedIdea,
    
    // Actions
    setSelectedICP,
    setSelectedAuthor,
    setSelectedAuthorTone,
    setSelectedAuthorExperience,
    setNarrativeSelections,
    setContentGoal,
    setGeneratedContent,
    setAdditionalContext,
    setSelectedSuccessStory,
    setWordCount,
    setEmailCount,
    setSelectedIdeaId,
    setTriggerInput,
    setProductInputs,
    
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

  console.log('📝 ShortFormContentContainer - Final data passed to components:', {
    authorsToPass: filteredAuthors.length,
    scriptsToPass: filteredScripts.length,
    successStoriesToPass: filteredSuccessStories.length,
    ideasToPass: filteredIdeas.length
  });

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
          narrativeSelections={narrativeSelections}
          contentGoal={contentGoal}
          selectedSuccessStory={selectedSuccessStory}
          wordCount={wordCount}
          emailCount={emailCount}
          additionalContext={additionalContext}
          triggerInput={triggerInput}
          selectedIdeaId={selectedIdeaId}
          availableAnchors={availableAnchors}
          productInputs={productInputs}
          isGenerating={isGenerating}
          isFormValid={isFormValid()}
          getContentTypeLabel={getContentTypeLabel}
          onICPChange={setSelectedICP}
          onAuthorChange={setSelectedAuthor}
          onAuthorToneChange={setSelectedAuthorTone}
          onAuthorExperienceChange={setSelectedAuthorExperience}
          onNarrativeSelectionsChange={setNarrativeSelections}
          onContentGoalChange={setContentGoal}
          onSuccessStoryChange={setSelectedSuccessStory}
          onWordCountChange={setWordCount}
          onEmailCountChange={setEmailCount}
          onAdditionalContextChange={setAdditionalContext}
          onTriggerInputChange={setTriggerInput}
          onIdeaSelect={setSelectedIdeaId}
          onProductInputsChange={setProductInputs}
          onGenerateContent={generateContent}
        />
      </Card>
        
      <ContentGenerationDisplay
        content={generatedContent}
        onContentChange={setGeneratedContent}
        contentType={contentType}
        contentTypeLabel={getContentTypeLabel()}
        isGenerating={isGenerating}
        isSaving={isSaving}
        lastSaved={lastSaved}
        showRestoreDialog={showRestoreDialog}
        availableDrafts={availableDrafts}
        onSetShowRestoreDialog={setShowRestoreDialog}
        onRestoreDraft={handleRestoreDraft}
        onDeleteDraft={handleDeleteDraft}
        onClearDraft={clearCurrentDraft}
      />
    </div>
  );
};

export default ShortFormContentContainer;
