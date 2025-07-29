
import { FC } from 'react';
import { ICPStoryScript, CustomerSuccessStory, ArticleSubType, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { FormData } from './useGTMNarrativeData';
import { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';
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
  onRegenerateContentTriggers?: () => Promise<void>;
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
  onProceedToAutoCrafting,
  onRegenerateContentTriggers
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

  // Add a handler for adding headlines
  const handleAddHeadline = () => {
    // This is a placeholder function that could trigger headline generation
    // For now, it's just an empty function to satisfy the prop requirement
    console.log('Add headline triggered');
  };

  switch (currentStep) {
    case 1:
      return (
        <StrategicAlignmentStep
          data={{
            ideaTrigger: formData.ideaTrigger,
            selectedIdeaId: formData.selectedIdeaId || '',
            mutualGoal: formData.mutualGoal || '',
            publishReason: formData.publishReason,
            targetKeyword: formData.targetKeyword,
            contentCluster: formData.contentCluster,
            callToAction: formData.callToAction
          }}
          ideas={ideas}
          onDataChange={onDataChange}
        />
      );

    case 2:
      return (
        <TargetReaderResonanceStep
          data={{
            mainTargetICP: formData.mainTargetICP,
            journeyStage: formData.journeyStage as 'TOFU' | 'MOFU' | 'BOFU' | '',
            broaderAudience: formData.broaderAudience || '',
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
            problemStatements: formData.problemStatements,
            headlineOptions: formData.headlineOptions,
            selectedHeadline: formData.selectedHeadline
          }}
          isGenerating={isGenerating}
          onDataChange={onDataChange}
          onRegenerateContent={onRegenerateContentTriggers}
        />
      );

    case 4:
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
          onAddHeadline={handleAddHeadline}
          onProceedToAutoCrafting={onProceedToAutoCrafting}
        />
      );

    default:
      return <div>Invalid step</div>;
  }
};

export default GTMStepRenderer;
