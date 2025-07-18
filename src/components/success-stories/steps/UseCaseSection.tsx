
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface UseCaseSectionProps {
  data: SuccessStoryFlowData;
  productContext: ProductContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const UseCaseSection: FC<UseCaseSectionProps> = ({ 
  data, 
  productContext, 
  onDataChange 
}) => {
  const handleVisualUpload = (field: keyof SuccessStoryFlowData) => {
    // File upload functionality will be implemented in future versions
    console.log('Upload visuals for:', field);
  };

  const getUseCaseVisuals = (useCaseId: string) => {
    const useCase = productContext?.useCases.find(uc => uc.id === useCaseId);
    return useCase?.media || [];
  };

  return (
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
            {data.useCase01 && getUseCaseVisuals(data.useCase01).length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {getUseCaseVisuals(data.useCase01).length} visual(s) available for this use case
              </p>
            )}
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
            {data.useCase02 && getUseCaseVisuals(data.useCase02).length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {getUseCaseVisuals(data.useCase02).length} visual(s) available for this use case
              </p>
            )}
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
  );
};

export default UseCaseSection;
