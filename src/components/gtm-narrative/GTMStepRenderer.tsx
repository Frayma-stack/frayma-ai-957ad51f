
import { FC } from 'react';
import { ICPStoryScript, CustomerSuccessStory, ArticleSubType, Author, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { FormData } from './useGTMNarrativeData';
import { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';
import StrategicAlignmentStep from './StrategicAlignmentStep';
import TargetReaderResonanceStep from './TargetReaderResonanceStep';
import ContentDiscoveryTriggersStep from './ContentDiscoveryTriggersStep';
import EnhancedContentOutlineStep from './EnhancedContentOutlineStep';
import NewPLSEditor from '../pls-editor/NewPLSEditor';

interface GTMStepRendererProps {
  currentStep: number;
  contentPhase: 'outline' | 'editor';
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
  onGenerateFullArticle: () => Promise<void>;
  onProceedToAutoCrafting: (config: AutoCraftingConfig) => void;
  onRegenerateContentTriggers?: () => Promise<void>;
  onSaveAsDraft?: () => Promise<void>;
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
  onGenerateFullArticle,
  onProceedToAutoCrafting,
  onRegenerateContentTriggers,
  onSaveAsDraft
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

  if (contentPhase === 'editor') {
    // Use the new PLS Editor for auto-crafted content
    return (
      <NewPLSEditor
        formData={formData}
        autoCraftingConfig={formData.autoCraftingConfig!}
        isGenerating={isGenerating}
        onDataChange={onDataChange}
        onGeneratePhase={onGenerateFullArticle}
        onBackToOutline={onBackToOutline}
        onSaveAsDraft={onSaveAsDraft!}
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
            businessContextItem: formData.businessContextItem,
            businessContextItemType: formData.businessContextItemType,
            businessContextAssetId: formData.businessContextAssetId,
            callToAction: formData.callToAction
          }}
          ideas={ideas}
          productContexts={productContexts}
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
            successStory: formData.successStory,
            articleAuthor: formData.articleAuthor
          }}
          scripts={scripts}
          successStories={successStories}
          authors={authors}
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
          selectedAuthor={formData.articleAuthor}
          isGeneratingHeadlines={isGenerating}
          isGeneratingOutline={isGenerating}
          onDataChange={onDataChange}
          onAuthorChange={(authorId) => onDataChange('articleAuthor', authorId)}
          onAddHeadline={handleAddHeadline}
          onProceedToAutoCrafting={onProceedToAutoCrafting}
        />
      );

    default:
      return <div>Invalid step</div>;
  }
};

export default GTMStepRenderer;
