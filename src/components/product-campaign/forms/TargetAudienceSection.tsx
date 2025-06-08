
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCampaignBrief } from '../types';
import { ICPStoryScript } from '@/types/storytelling';

interface TargetAudienceSectionProps {
  formData: Partial<ProductCampaignBrief>;
  scripts: ICPStoryScript[];
  onInputChange: (field: string, value: any) => void;
}

export const TargetAudienceSection: React.FC<TargetAudienceSectionProps> = ({
  formData,
  scripts,
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Target Audiences</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="primaryICP">Primary ICP *</Label>
          <Select value={formData.primaryICP || "__none__"} onValueChange={(value) => onInputChange('primaryICP', value === "__none__" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select primary ICP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">Select an ICP</SelectItem>
              {scripts.map((script) => (
                <SelectItem key={script.id} value={script.id}>
                  {script.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondaryICP">Secondary ICP (Optional)</Label>
          <Select value={formData.secondaryICP || "__none__"} onValueChange={(value) => onInputChange('secondaryICP', value === "__none__" ? "" : value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select secondary ICP" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {scripts.map((script) => (
                <SelectItem key={script.id} value={script.id}>
                  {script.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
