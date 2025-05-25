
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface FeatureUsageSectionProps {
  data: SuccessStoryFlowData;
  productContext: ProductContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const FeatureUsageSection: FC<FeatureUsageSectionProps> = ({ 
  data, 
  productContext, 
  onDataChange 
}) => {
  const handleVisualUpload = (field: keyof SuccessStoryFlowData) => {
    // TODO: Implement file upload functionality
    console.log('Upload visuals for:', field);
  };

  const getFeatureVisuals = (featureId: string) => {
    const feature = productContext?.features.find(f => f.id === featureId);
    return feature?.media || [];
  };

  return (
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
            {data.feature01 && getFeatureVisuals(data.feature01).length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {getFeatureVisuals(data.feature01).length} visual(s) available for this feature
              </p>
            )}
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
            {data.feature02 && getFeatureVisuals(data.feature02).length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {getFeatureVisuals(data.feature02).length} visual(s) available for this feature
              </p>
            )}
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
            {data.feature03 && getFeatureVisuals(data.feature03).length > 0 && (
              <p className="text-xs text-green-600 mt-1">
                {getFeatureVisuals(data.feature03).length} visual(s) available for this feature
              </p>
            )}
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
  );
};

export default FeatureUsageSection;
