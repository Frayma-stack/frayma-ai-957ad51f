
import { FC } from 'react';
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import { ICPStoryScript, Author, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import TriggerInputField from './TriggerInputField';
import ICPAuthorSelectors from './ICPAuthorSelectors';
import NarrativeAnchorSelector from './NarrativeAnchorSelector';
import ContentOptionsSection from './ContentOptionsSection';
import ProductContextSection from './ProductContextSection';
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
  currentProductContext: ProductContext | null;
  // State props
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedAuthorBelief?: string;
  narrativeSelections: any[];
  contentGoal: any;
  selectedSuccessStory: string;
  wordCount: number;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  selectedIdeaId: string | null;
  availableAnchors: {value: string, label: string}[];
  productInputs: any;
  isGenerating: boolean;
  isFormValid: boolean;
  getContentTypeLabel: () => string;
  // Action props
  onICPChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
  onAuthorBeliefChange?: (value: string) => void;
  onNarrativeSelectionsChange: (selections: any[]) => void;
  onContentGoalChange: (goal: any) => void;
  onSuccessStoryChange: (story: string) => void;
  onWordCountChange: (count: number) => void;
  onEmailCountChange: (count: number) => void;
  onAdditionalContextChange: (context: string) => void;
  onTriggerInputChange: (trigger: string) => void;
  onIdeaSelect: (ideaId: string | null) => void;
  onProductInputsChange: (inputs: any) => void;
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
  currentProductContext,
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedAuthorBelief,
  narrativeSelections,
  contentGoal,
  selectedSuccessStory,
  wordCount,
  emailCount,
  additionalContext,
  triggerInput,
  selectedIdeaId,
  availableAnchors,
  productInputs,
  isGenerating,
  isFormValid,
  getContentTypeLabel,
  onICPChange,
  onAuthorChange,
  onAuthorToneChange,
  onAuthorExperienceChange,
  onAuthorBeliefChange,
  onNarrativeSelectionsChange,
  onContentGoalChange,
  onSuccessStoryChange,
  onWordCountChange,
  onEmailCountChange,
  onAdditionalContextChange,
  onTriggerInputChange,
  onIdeaSelect,
  onProductInputsChange,
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
        selectedIdeaId={selectedIdeaId}
        onIdeaSelect={onIdeaSelect}
      />
      
      <ICPAuthorSelectors
        selectedICP={selectedICP}
        selectedAuthor={selectedAuthor}
        selectedAuthorTone={selectedAuthorTone}
        selectedAuthorExperience={selectedAuthorExperience}
        selectedAuthorBelief={selectedAuthorBelief}
        scripts={scripts}
        authors={authors}
        selectedIdea={selectedIdea}
        onICPChange={onICPChange}
        onAuthorChange={onAuthorChange}
        onAuthorToneChange={onAuthorToneChange}
        onAuthorExperienceChange={onAuthorExperienceChange}
        onAuthorBeliefChange={onAuthorBeliefChange}
      />
      
      <NarrativeAnchorSelector
        selectedICP={selectedICP}
        scripts={scripts}
        narrativeSelections={narrativeSelections}
        availableAnchors={availableAnchors}
        onToggleAnchorType={toggleAnchorType}
        onToggleItemSelection={toggleItemSelection}
      />

      {currentProductContext && (
        <ProductContextSection
          productContext={currentProductContext}
          productInputs={productInputs}
          onProductInputsChange={onProductInputsChange}
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
