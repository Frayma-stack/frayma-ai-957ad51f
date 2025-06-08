
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ProductCampaignBrief } from '../types';
import { Author } from '@/types/storytelling';

interface AuthorSelectionSectionProps {
  formData: Partial<ProductCampaignBrief>;
  authors: Author[];
  onAuthorToggle: (authorId: string, checked: boolean) => void;
}

export const AuthorSelectionSection: React.FC<AuthorSelectionSectionProps> = ({
  formData,
  authors,
  onAuthorToggle
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-900">Author Profiles *</h3>
      <p className="text-sm text-gray-600">Select 1-3 author profiles to use for content generation</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {authors.map((author) => (
          <div key={author.id} className="flex items-start space-x-3 p-3 border rounded-lg">
            <Checkbox
              id={`author-${author.id}`}
              checked={formData.authorProfiles?.includes(author.id) || false}
              onCheckedChange={(checked) => onAuthorToggle(author.id, checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor={`author-${author.id}`} className="font-medium">
                {author.name}
              </Label>
              <p className="text-sm text-gray-600">{author.role}</p>
              <p className="text-xs text-gray-500">{author.organization}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
