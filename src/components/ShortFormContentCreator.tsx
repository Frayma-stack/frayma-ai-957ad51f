
import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import ShortFormHeader from './short-form/ShortFormHeader';
import ShortFormMainContent from './short-form/ShortFormMainContent';
import ContentGenerationDisplay from './short-form/ContentGenerationDisplay';
import { useShortFormContentCreator } from './short-form/useShortFormContentCreator';
import { usePageReloadProtection } from '@/hooks/usePageReloadProtection';
import { ContentType } from './short-form/types';

interface ShortFormContentCreatorProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  successStories,
  ideas = [],
  selectedClientId,
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
    clientName,
    additionalContext,
    selectedSuccessStory,
    wordCount,
    emailCount,
    availableAnchors,
    selectedIdeaId,
    triggerInput,
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
    
    // Computed
    getContentTypeLabel,
    isFormValid,
    generateContent
  } = useShortFormContentCreator({
    contentType,
    scripts,
    authors,
    successStories,
    ideas
  });

  // Protect against accidental page reloads when form has content
  const hasFormContent = Boolean(selectedICP || selectedAuthor || additionalContext || generatedContent || triggerInput);
  usePageReloadProtection({
    enabled: hasFormContent,
    message: "You have unsaved content in your form. Are you sure you want to leave this page?"
  });

  const selectedIdea = getSelectedIdea();

  // Filter ideas by selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

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
          scripts={scripts}
          authors={authors}
          successStories={successStories}
          selectedIdea={selectedIdea}
          ideas={filteredIdeas}
          selectedClientId={selectedClientId}
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
          onGenerateContent={generateContent}
        />
        
        <ContentGenerationDisplay
          contentType={contentType}
          generatedContent={generatedContent}
          onContentChange={setGeneratedContent}
        />
      </Card>
    </div>
  );
};

export default ShortFormContentCreator;
