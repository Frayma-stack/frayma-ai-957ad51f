
import { FC } from 'react';
import { ICPStoryScript, Author, ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from './useSuccessStoryFlowData';
import StoryBriefStep from './steps/StoryBriefStep';
import NarrativeAnchorsStep from './steps/NarrativeAnchorsStep';
import ImplementationJourneyStep from './steps/ImplementationJourneyStep';
import OutcomeMetricsStep from './steps/OutcomeMetricsStep';
import AutoCraftingEnhancementsStep from './steps/AutoCraftingEnhancementsStep';

interface SuccessStoryStepRendererProps {
  currentStep: number;
  formData: SuccessStoryFlowData;
  scripts: ICPStoryScript[];
  authors: Author[];
  productContext: ProductContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string | string[]) => void;
}

const SuccessStoryStepRenderer: FC<SuccessStoryStepRendererProps> = ({
  currentStep,
  formData,
  scripts,
  authors,
  productContext,
  onDataChange
}) => {
  switch (currentStep) {
    case 1:
      return (
        <StoryBriefStep
          data={formData}
          scripts={scripts}
          onDataChange={onDataChange}
        />
      );
    case 2:
      return (
        <NarrativeAnchorsStep
          data={formData}
          onDataChange={onDataChange}
        />
      );
    case 3:
      return (
        <ImplementationJourneyStep
          data={formData}
          productContext={productContext}
          onDataChange={onDataChange}
        />
      );
    case 4:
      return (
        <OutcomeMetricsStep
          data={formData}
          onDataChange={onDataChange}
        />
      );
    case 5:
      return (
        <AutoCraftingEnhancementsStep
          data={formData}
          authors={authors}
          productContext={productContext}
          onDataChange={onDataChange}
        />
      );
    default:
      return <div>Invalid step</div>;
  }
};

export default SuccessStoryStepRenderer;
