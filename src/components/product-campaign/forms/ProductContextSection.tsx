
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ProductCampaignBrief } from '../types';

interface ProductContextSectionProps {
  formData: Partial<ProductCampaignBrief>;
  onInputChange: (field: string, value: any) => void;
}

export const ProductContextSection: React.FC<ProductContextSectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Product Context</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="feature">Feature</Label>
          <Input
            id="feature"
            placeholder="Core feature name"
            value={formData.productContext?.feature}
            onChange={(e) => onInputChange('productContext.feature', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="useCase">Use Case</Label>
          <Input
            id="useCase"
            placeholder="Primary use case"
            value={formData.productContext?.useCase}
            onChange={(e) => onInputChange('productContext.useCase', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="differentiator">Differentiator</Label>
          <Input
            id="differentiator"
            placeholder="Key differentiator"
            value={formData.productContext?.differentiator}
            onChange={(e) => onInputChange('productContext.differentiator', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
