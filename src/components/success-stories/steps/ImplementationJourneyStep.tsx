
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, HelpCircle, Upload } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface ImplementationJourneyStepProps {
  data: SuccessStoryFlowData;
  productContext: ProductContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string | string[]) => void;
}

const ImplementationJourneyStep: FC<ImplementationJourneyStepProps> = ({ 
  data, 
  productContext, 
  onDataChange 
}) => {
  const handleVisualUpload = (field: keyof SuccessStoryFlowData) => {
    // TODO: Implement file upload functionality
    console.log('Upload visuals for:', field);
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Settings className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Implementation Journey + Assets</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Describe what made your product work and upload assets</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-6">
          {/* Basic Implementation Info */}
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

          {/* Features Section */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium mb-4">Features Used</h4>
            
            {/* Feature 01 */}
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h5 className="font-medium">Feature 01 *</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Feature</label>
                  <Select value={data.feature01} onValueChange={(value) => onDataChange('feature01', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feature..." />
                    </SelectTrigger>
                    <SelectContent>
                      {productContext?.features.map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>
                          {feature.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Feature Usage Visuals</label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVisualUpload('feature01Visuals')}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Usage Description</label>
                <Textarea 
                  placeholder="Describe how the customer used this feature..."
                  value={data.feature01Description}
                  onChange={(e) => onDataChange('feature01Description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Feature 02 */}
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h5 className="font-medium">Feature 02</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Feature</label>
                  <Select value={data.feature02} onValueChange={(value) => onDataChange('feature02', value === 'none' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feature..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {productContext?.features.map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>
                          {feature.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Feature Usage Visuals</label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVisualUpload('feature02Visuals')}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Usage Description</label>
                <Textarea 
                  placeholder="Describe how the customer used this feature..."
                  value={data.feature02Description}
                  onChange={(e) => onDataChange('feature02Description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Feature 03 */}
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h5 className="font-medium">Feature 03</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Feature</label>
                  <Select value={data.feature03} onValueChange={(value) => onDataChange('feature03', value === 'none' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select feature..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {productContext?.features.map((feature) => (
                        <SelectItem key={feature.id} value={feature.id}>
                          {feature.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Feature Usage Visuals</label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVisualUpload('feature03Visuals')}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Usage Description</label>
                <Textarea 
                  placeholder="Describe how the customer used this feature..."
                  value={data.feature03Description}
                  onChange={(e) => onDataChange('feature03Description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>

          {/* Use Cases Section */}
          <div className="border-t pt-6">
            <h4 className="text-md font-medium mb-4">Use Cases Unlocked</h4>
            
            {/* Use Case 01 */}
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h5 className="font-medium">Use Case 01 *</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Use Case</label>
                  <Select value={data.useCase01} onValueChange={(value) => onDataChange('useCase01', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select use case..." />
                    </SelectTrigger>
                    <SelectContent>
                      {productContext?.useCases.map((useCase) => (
                        <SelectItem key={useCase.id} value={useCase.id}>
                          {useCase.useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Use Case Visuals</label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVisualUpload('useCase01Visuals')}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Use Case Description</label>
                <Textarea 
                  placeholder="What business workflows or teams used the product and how"
                  value={data.useCase01Description}
                  onChange={(e) => onDataChange('useCase01Description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Use Case 02 */}
            <div className="space-y-4 mb-6 p-4 border rounded-lg">
              <h5 className="font-medium">Use Case 02</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Use Case</label>
                  <Select value={data.useCase02} onValueChange={(value) => onDataChange('useCase02', value === 'none' ? '' : value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select use case..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {productContext?.useCases.map((useCase) => (
                        <SelectItem key={useCase.id} value={useCase.id}>
                          {useCase.useCase}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Use Case Visuals</label>
                  <Button 
                    variant="outline" 
                    onClick={() => handleVisualUpload('useCase02Visuals')}
                    className="w-full flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Screenshots
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Use Case Description</label>
                <Textarea 
                  placeholder="What business workflows or teams used the product and how"
                  value={data.useCase02Description}
                  onChange={(e) => onDataChange('useCase02Description', e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ImplementationJourneyStep;
