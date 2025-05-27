
import { FC } from 'react';
import { Card } from "@/components/ui/card";
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';
import ShortFormHeader from './short-form/ShortFormHeader';
import ShortFormMainContent from './short-form/ShortFormMainContent';
import ContentGenerationDisplay from './short-form/ContentGenerationDisplay';
import { useShortFormContentCreator } from './short-form/useShortFormContentCreator';
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

  const selectedIdea = getSelectedIdea();

  return (
    <div className="space-y-4">
      {/* Idea Selector */}
      {ideas.length > 0 && (
        <IdeaSelector
          ideas={ideas}
          selectedIdeaId={selectedIdeaId}
          onIdeaSelect={setSelectedIdeaId}
          selectedClientId={selectedClientId}
        />
      )}

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
