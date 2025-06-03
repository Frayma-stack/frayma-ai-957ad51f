
import { FC } from 'react';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ArticleSubType } from '../ContentTypeSelector';
import { FormData } from './useGTMNarrativeData';
import StrategicAlignmentStep from './StrategicAlignmentStep';
import TargetReaderResonanceStep from './TargetReaderResonanceStep';
import ContentDiscoveryTriggersStep from './ContentDiscoveryTriggersStep';
import EnhancedContentOutlineStep from './EnhancedContentOutlineStep';
import ContentGenerationEditor from './ContentGenerationEditor';

interface GTMStepRendererProps {
  currentStep: number;
  contentPhase: 'outline' | 'intro' | 'body' | 'conclusion';
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  ideas: GeneratedIdea[];
  selectedIdea?: GeneratedIdea | null;
  articleSubType: ArticleSubType;
  isGenerating: boolean;
  onDataChange: (field: keyof FormData, value: any) => void;
  onContentPhaseNext: () => Promise<void>;
  onBackToOutline: () => void;
  onRegenerate: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
}

const GTMStepRenderer: FC<GTMStepRendererProps> = ({
  currentStep,
  contentPhase,
  formData,
  scripts,
  successStories,
  ideas,
  selectedIdea,
  articleSubType,
  isGenerating,
  onDataChange,
  onContentPhaseNext,
  onBackToOutline,
  onRegenerate
}) => {
  if (contentPhase !== 'outline') {
    const getContentTypeLabel = () => {
      return articleSubType === 'newsletter' 
        ? 'First-Person Narrative Newsletter'
        : 'Thought Leadership & How-to Guide';
    };

    const phaseConfig = {
      intro: {
        title: `${getContentTypeLabel()} - Introduction & Hook`,
        description: 'AI-generated opening following Product-Led Storytelling principles to capture attention and establish credibility',
        content: formData.generatedIntro,
        contentKey: 'generatedIntro' as keyof FormData
      },
      body: {
        title: `${getContentTypeLabel()} - Main Content Body`,
        description: 'Core content following the PLS framework and 3Rs Formula, addressing your content discovery triggers',
        content: formData.generatedBody,
        contentKey: 'generatedBody' as keyof FormData
      },
      conclusion: {
        title: `${getContentTypeLabel()} - Results & Call to Action`,
        description: 'Compelling conclusion with social proof integration and clear next steps for your audience',
        content: formData.generatedConclusion,
        contentKey: 'generatedConclusion' as keyof FormData
      }
    };

    const config = phaseConfig[contentPhase];
    
    return (
      <ContentGenerationEditor
        currentPhase={contentPhase}
        phaseTitle={config.title}
        phaseDescription={config.description}
        generatedContent={config.content}
        onContentChange={(content) => onDataChange(config.contentKey, content)}
        onRegenerate={() => onRegenerate(contentPhase)}
        onContinue={onContentPhaseNext}
        onBack={onBackToOutline}
        isGenerating={isGenerating}
        canContinue={Boolean(config.content)}
      />
    );
  }

  switch (currentStep) {
    case 1:
      return (
        <StrategicAlignmentStep
          data={{
            ideaTrigger: selectedIdea ? `${selectedIdea.title}: ${selectedIdea.narrative}` : formData.ideaTrigger,
            selectedIdeaId: formData.selectedIdeaId,
            mutualGoal: formData.mutualGoal,
            targetKeyword: formData.targetKeyword,
            contentCluster: formData.contentCluster,
            publishReason: formData.publishReason,
            callToAction: selectedIdea?.cta || formData.callToAction,
            strategicSuccessStory: formData.strategicSuccessStory
          }}
          successStories={successStories}
          ideas={ideas}
          onDataChange={onDataChange}
        />
      );
    case 2:
      return (
        <TargetReaderResonanceStep
          data={{
            mainTargetICP: formData.mainTargetICP,
            journeyStage: formData.journeyStage,
            broaderAudience: formData.broaderAudience,
            readingPrompt: formData.readingPrompt,
            narrativeAnchors: formData.narrativeAnchors,
            successStory: formData.successStory
          }}
          scripts={scripts}
          successStories={successStories}
          onDataChange={onDataChange}
        />
      );
    case 3:
      return (
        <ContentDiscoveryTriggersStep
          data={{
            relatedKeywords: formData.relatedKeywords,
            searchQueries: formData.searchQueries,
            problemStatements: formData.problemStatements
          }}
          isGenerating={isGenerating}
          onDataChange={onDataChange}
        />
      );
    case 4:
      return (
        <EnhancedContentOutlineStep
          data={{
            headlineOptions: formData.headlineOptions,
            selectedHeadline: formData.selectedHeadline,
            outlineSections: formData.outlineSections
          }}
          articleSubType={articleSubType}
          successStories={successStories}
          productFeatures={[]}
          productUseCases={[]}
          productDifferentiators={[]}
          isGeneratingHeadlines={isGenerating}
          isGeneratingOutline={isGenerating}
          onDataChange={onDataChange}
          onAddHeadline={() => {}}
        />
      );
    default:
      return null;
  }
};

export default GTMStepRenderer;
