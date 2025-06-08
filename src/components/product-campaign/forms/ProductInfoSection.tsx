
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ProductCampaignBrief } from '../types';

interface ProductInfoSectionProps {
  formData: Partial<ProductCampaignBrief>;
  onInputChange: (field: string, value: any) => void;
}

export const ProductInfoSection: React.FC<ProductInfoSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Product Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="productName">Product/Feature Name *</Label>
          <Input
            id="productName"
            placeholder="e.g., Advanced Analytics Dashboard"
            value={formData.productName}
            onChange={(e) => onInputChange('productName', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="coreTransformation">Core Transformation *</Label>
          <Input
            id="coreTransformation"
            placeholder="e.g., 10x faster insights discovery"
            value={formData.coreTransformation}
            onChange={(e) => onInputChange('coreTransformation', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="featureDescription">Feature Description *</Label>
        <Textarea
          id="featureDescription"
          placeholder="Describe what was shipped and its key capabilities..."
          value={formData.featureDescription}
          onChange={(e) => onInputChange('featureDescription', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="whyBuilt">Why This Was Built *</Label>
        <Textarea
          id="whyBuilt"
          placeholder="What customer problem or trigger led to building this?"
          value={formData.whyBuilt}
          onChange={(e) => onInputChange('whyBuilt', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};
