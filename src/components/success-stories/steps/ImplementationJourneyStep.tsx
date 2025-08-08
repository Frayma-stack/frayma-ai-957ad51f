
import { FC } from 'react';
import { Settings, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { BusinessContext } from '@/types/storytelling';
import BusinessContextItemSelector from '@/components/shared/BusinessContextItemSelector';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';
import BasicImplementationSection from './BasicImplementationSection';
import FeatureUsageSection from './FeatureUsageSection';
import UseCaseSection from './UseCaseSection';
import { ScrollArea } from "@/components/ui/scroll-area";

interface ImplementationJourneyStepProps {
  data: SuccessStoryFlowData;
  productContext: BusinessContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string | string[]) => void;
}

const ImplementationJourneyStep: FC<ImplementationJourneyStepProps> = ({ 
  data, 
  productContext, 
  onDataChange 
}) => {
  const handleDataChange = (field: keyof SuccessStoryFlowData, value: string) => {
    onDataChange(field, value);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 h-full">
        <div className="flex items-center mb-6">
          <Settings className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Implementation Journey + Assets</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs opacity-90">Describe what made your product work and upload assets</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <ScrollArea className="h-[400px]">
          <div className="space-y-6 pr-4">
            <BasicImplementationSection 
              data={data} 
              onDataChange={handleDataChange} 
            />
            
            <FeatureUsageSection 
              data={data} 
              productContext={productContext} 
              onDataChange={handleDataChange} 
            />
            
            <UseCaseSection 
              data={data} 
              productContext={productContext} 
              onDataChange={handleDataChange} 
            />
          </div>
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
};

export default ImplementationJourneyStep;
