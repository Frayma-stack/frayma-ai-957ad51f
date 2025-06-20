
import { FC } from 'react';
import { ICPStoryScript, CustomerSuccessStory, ArticleSubType, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { FormData } from './useGTMNarrativeData';
import { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';
import StrategicAlignmentStep from './StrategicAlignmentStep';
import TargetReaderResonanceStep from './TargetReaderResonanceStep';
import EnhancedContentOutlineStep from './EnhancedContentOutlineStep';
import ContentGenerationEditor from './ContentGenerationEditor';

interface GTMStepRendererProps {
  currentStep: number;
  contentPhase: 'outline' | 'intro' | 'body' | 'conclusion';
  formData: FormData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts?: ProductContext[];
  ideas: GeneratedIdea[];
  selectedIdea: GeneratedIdea | null;
  articleSubType: ArticleSubType;
  authors: Author[];
  isGenerating: boolean;
  onDataChange: (field: keyof FormData, value: any) => void;
  onContentPhaseNext: () => void;
  onBackToOutline: () => void;
  onRegenerate: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
  onProceedToAutoCrafting: (config: AutoCraftingConfig) => void;
}

const GTMStepRenderer: FC<GTMStepRendererProps> = ({
  currentStep,
  contentPhase,
  formData,
  scripts,
  successStories,
  productContexts = [],
  ideas,
  selectedIdea,
  articleSubType,
  authors,
  isGenerating,
  onDataChange,
  onContentPhaseNext,
  onBackToOutline,
  onRegenerate,
  onProceedToAutoCrafting
}) => {
  // Aggregate all product features, use cases, and differentiators from product contexts
  const getAllProductFeatures = () => {
    const features: any[] = [];
    productContexts.forEach(context => {
      if (context.features) {
        features.push(...context.features);
      }
    });
    return features;
  };

  const getAllProductUseCases = () => {
    const useCases: any[] = [];
    productContexts.forEach(context => {
      if (context.useCases) {
        useCases.push(...context.useCases);
      }
    });
    return useCases;
  };

  const getAllProductDifferentiators = () => {
    const differentiators: any[] = [];
    productContexts.forEach(context => {
      if (context.differentiators) {
        differentiators.push(...context.differentiators);
      }
    });
    return differentiators;
  };

  if (contentPhase !== 'outline') {
    return (
      <ContentGenerationEditor
        contentPhase={contentPhase}
        formData={formData}
        isGenerating={isGenerating}
        onContentPhaseNext={onContentPhaseNext}
        onBackToOutline={onBackToOutline}
        onRegenerate={onRegenerate}
        onDataChange={onDataChange}
      />
    );
  }

  switch (currentStep) {
    case 1:
      return (
        <StrategicAlignmentStep
          data={{
            ideaTrigger: formData.ideaTrigger,
            publishReason: formData.publishReason,
            targetKeyword: formData.targetKeyword,
            contentCluster: formData.contentCluster,
            callToAction: formData.callToAction
          }}
          selectedIdea={selectedIdea}
          onDataChange={onDataChange}
        />
      );

    case 2:
      return (
        <TargetReaderResonanceStep
          data={{
            mainTargetICP: formData.mainTargetICP,
            journeyStage: formData.journeyStage,
            mutualGoal: formData.mutualGoal,
            readingPrompt: formData.readingPrompt,
            narrativeAnchors: formData.narrativeAnchors,
            successStory: formData.successStory,
            relatedKeywords: formData.relatedKeywords,
            searchQueries: formData.searchQueries,
            problemStatements: formData.problemStatements
          }}
          scripts={scripts}
          successStories={successStories}
          onDataChange={onDataChange}
        />
      );

    case 3:
      return (
        <EnhancedContentOutlineStep
          data={{
            headlineOptions: formData.headlineOptions,
            selectedHeadline: formData.selectedHeadline,
            introPOV: formData.introPOV,
            outlineSections: formData.outlineSections
          }}
          articleSubType={articleSubType}
          successStories={successStories}
          productFeatures={getAllProductFeatures()}
          productUseCases={getAllProductUseCases()}
          productDifferentiators={getAllProductDifferentiators()}
          authors={authors}
          isGeneratingHeadlines={isGenerating}
          isGeneratingOutline={isGenerating}
          onDataChange={onDataChange}
          onAddHeadline={() => {}} // This is handled within the component
          onProceedToAutoCrafting={onProceedToAutoCrafting}
        />
      );

    default:
      return <div>Invalid step</div>;
  }
};

export default GTMStepRenderer;
