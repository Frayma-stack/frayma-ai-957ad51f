
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCampaignBrief } from '../types';

interface CampaignStrategySectionProps {
  formData: Partial<ProductCampaignBrief>;
  onInputChange: (field: string, value: any) => void;
}

export const CampaignStrategySection: React.FC<CampaignStrategySectionProps> = ({
  formData,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Campaign Strategy</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="positioningAngle">Positioning Angle *</Label>
          <Textarea
            id="positioningAngle"
            placeholder="How this update strengthens your brand narrative..."
            value={formData.positioningAngle}
            onChange={(e) => onInputChange('positioningAngle', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="desiredCTA">Desired CTA *</Label>
          <Textarea
            id="desiredCTA"
            placeholder="e.g., Try it now, Book a demo, Upgrade your plan..."
            value={formData.desiredCTA}
            onChange={(e) => onInputChange('desiredCTA', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="styleDepth">Style & Depth</Label>
        <Select value={formData.styleDepth} onValueChange={(value: any) => onInputChange('styleDepth', value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="punchy">Punchy - Quick, impactful messaging</SelectItem>
            <SelectItem value="educational">Educational - Detailed, informative</SelectItem>
            <SelectItem value="technical">Technical - In-depth, specification-focused</SelectItem>
            <SelectItem value="visual-heavy">Visual-Heavy - Story-driven with visuals</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
