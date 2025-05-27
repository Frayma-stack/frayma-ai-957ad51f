
import { FC } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import TriggerInputField from './TriggerInputField';
import ICPAuthorSelectors from './ICPAuthorSelectors';
import NarrativeAnchorSelector from './NarrativeAnchorSelector';
import ContentOptionsSection from './ContentOptionsSection';
import { useNarrativeAnchorLogic } from './useNarrativeAnchorLogic';
import { ContentType } from './types';

interface ShortFormMainContentProps {
  contentType: ContentType;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  selectedIdea: GeneratedIdea | null;
  ideas: GeneratedIdea[];
  selectedClientId?: string;
  // State props
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  narrativeSelections: any[];
  contentGoal: any;
  selectedSuccessStory: string;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  availableAnchors: {value: string, label: string}[];
  isGenerating: boolean;
  isFormValid: boolean;
  getContentTypeLabel: () => string;
  // Action props
  onICPChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
  onNarrativeSelectionsChange: (selections: any[]) => void;
  onContentGoalChange: (goal: any) => void;
  onSuccessStoryChange: (story: string) => void;
  onWordCountChange: (count: number) => void;
  onEmailCountChange: (count: number) => void;
  onAdditionalContextChange: (context: string) => void;
  onTriggerInputChange: (trigger: string) => void;
  onGenerateContent: () => void;
}

const ShortFormMainContent: FC<ShortFormMainContentProps> = ({
  contentType,
  scripts,
  authors,
  successStories,
  selectedIdea,
  ideas,
  selectedClientId,
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  narrativeSelections,
  contentGoal,
  selectedSuccessStory,
  wordCount,
  emailCount,
  additionalContext,
  triggerInput,
  availableAnchors,
  isGenerating,
  isFormValid,
  getContentTypeLabel,
  onICPChange,
  onAuthorChange,
  onAuthorToneChange,
  onAuthorExperienceChange,
  onNarrativeSelectionsChange,
  onContentGoalChange,
  onSuccessStoryChange,
  onWordCountChange,
  onEmailCountChange,
  onAdditionalContextChange,
  onTriggerInputChange,
  onGenerateContent
}) => {
  const {
    toggleAnchorType,
    toggleItemSelection
  } = useNarrativeAnchorLogic({
    narrativeSelections,
    setNarrativeSelections: onNarrativeSelectionsChange
  });

  return (
    <CardContent className="space-y-6">
      <TriggerInputField
        triggerInput={triggerInput}
        onTriggerInputChange={onTriggerInputChange}
        ideas={ideas}
        selectedClientId={selectedClientId}
      />
      
      <ICPAuthorSelectors
        selectedICP={selectedICP}
        selectedAuthor={selectedAuthor}
        selectedAuthorTone={selectedAuthorTone}
        selectedAuthorExperience={selectedAuthorExperience}
        scripts={scripts}
        authors={authors}
        selectedIdea={selectedIdea}
        onICPChange={onICPChange}
        onAuthorChange={onAuthorChange}
        onAuthorToneChange={onAuthorToneChange}
        onAuthorExperienceChange={onAuthorExperienceChange}
      />
      
      {!triggerInput && !selectedIdea && (
        <NarrativeAnchorSelector
          selectedICP={selectedICP}
          scripts={scripts}
          narrativeSelections={narrativeSelections}
          availableAnchors={availableAnchors}
          onToggleAnchorType={toggleAnchorType}
          onToggleItemSelection={toggleItemSelection}
        />
      )}
      
      <ContentOptionsSection
        contentType={contentType}
        selectedSuccessStory={selectedSuccessStory}
        contentGoal={contentGoal}
        wordCount={wordCount}
        emailCount={emailCount}
        additionalContext={additionalContext}
        successStories={successStories}
        onSuccessStoryChange={onSuccessStoryChange}
        onContentGoalChange={onContentGoalChange}
        onWordCountChange={onWordCountChange}
        onEmailCountChange={onEmailCountChange}
        onAdditionalContextChange={onAdditionalContextChange}
      />
      
      <Button 
        className="w-full bg-story-blue hover:bg-story-light-blue"
        onClick={onGenerateContent}
        disabled={isGenerating || !isFormValid}
      >
        {isGenerating ? (
          <>
            <Loader className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          `Generate ${getContentTypeLabel()}`
        )}
      </Button>
    </CardContent>
  );
};

export default ShortFormMainContent;
