
import { FC } from 'react';
import { TooltipProvider } from "@/components/ui/tooltip";
import { CustomerSuccessStory, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import OutlineStepHeader from './outline/OutlineStepHeader';
import ThreeRsFormulaCard from './outline/ThreeRsFormulaCard';
import HeadlineSelection from './outline/HeadlineSelection';
import OutlineSections from './outline/OutlineSections';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface OutlineSection {
  id: string;
  type: 'H2' | 'H3' | 'H4';
  title: string;
  context?: string;
  linkedAssetType?: 'success_story' | 'feature' | 'use_case' | 'differentiator';
  linkedAssetId?: string;
  phase: 'attract' | 'filter' | 'engage' | 'results';
}

interface EnhancedContentOutlineData {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  outlineSections: OutlineSection[];
}

interface EnhancedContentOutlineStepProps {
  data: EnhancedContentOutlineData;
  articleSubType: 'newsletter' | 'thought_leadership';
  successStories: CustomerSuccessStory[];
  productFeatures: ProductFeature[];
  productUseCases: ProductUseCase[];
  productDifferentiators: ProductDifferentiator[];
  isGeneratingHeadlines?: boolean;
  isGeneratingOutline?: boolean;
  onDataChange: (field: keyof EnhancedContentOutlineData, value: any) => void;
  onAddHeadline: () => void;
}

const EnhancedContentOutlineStep: FC<EnhancedContentOutlineStepProps> = ({
  data,
  articleSubType,
  successStories,
  productFeatures,
  productUseCases,
  productDifferentiators,
  isGeneratingHeadlines = false,
  isGeneratingOutline = false,
  onDataChange,
  onAddHeadline
}) => {
  const handleAddHeadline = (headline: HeadlineOption) => {
    onDataChange('headlineOptions', [...data.headlineOptions, headline]);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <OutlineStepHeader articleSubType={articleSubType} />
        
        <ThreeRsFormulaCard />

        <HeadlineSelection
          headlineOptions={data.headlineOptions}
          selectedHeadline={data.selectedHeadline}
          isGeneratingHeadlines={isGeneratingHeadlines}
          onHeadlineChange={(value) => onDataChange('selectedHeadline', value)}
          onAddHeadline={handleAddHeadline}
        />

        <OutlineSections
          sections={data.outlineSections}
          isGeneratingOutline={isGeneratingOutline}
          articleSubType={articleSubType}
          successStories={successStories}
          productFeatures={productFeatures}
          productUseCases={productUseCases}
          productDifferentiators={productDifferentiators}
          onSectionsChange={(sections) => onDataChange('outlineSections', sections)}
        />
      </div>
    </TooltipProvider>
  );
};

export default EnhancedContentOutlineStep;
