
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface BasicImplementationSectionProps {
  data: SuccessStoryFlowData;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const BasicImplementationSection: FC<BasicImplementationSectionProps> = ({ 
  data, 
  onDataChange 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <label className="text-sm font-medium">Prior Tools/Methods Used *</label>
        <p className="text-xs text-gray-500 mb-2">Describe what they were doing before</p>
        <Textarea 
          placeholder="What tools or methods were they using previously?"
          value={data.priorTools}
          onChange={(e) => onDataChange('priorTools', e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Trigger for Change *</label>
        <p className="text-xs text-gray-500 mb-2">What sparked the need for a switch to your service/product?</p>
        <Textarea 
          placeholder="What event or realization triggered the change?"
          value={data.triggerForChange}
          onChange={(e) => onDataChange('triggerForChange', e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Key Decision Factors</label>
        <p className="text-xs text-gray-500 mb-2">Why did they choose this product/company over others?</p>
        <Textarea 
          placeholder="What factors led to choosing your solution?"
          value={data.keyDecisionFactors}
          onChange={(e) => onDataChange('keyDecisionFactors', e.target.value)}
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Implementation Timeline</label>
        <p className="text-xs text-gray-500 mb-2">General rollout period</p>
        <Input 
          placeholder="e.g., Fully deployed in 30 days"
          value={data.implementationTimeline}
          onChange={(e) => onDataChange('implementationTimeline', e.target.value)}
        />
      </div>
    </div>
  );
};

export default BasicImplementationSection;
