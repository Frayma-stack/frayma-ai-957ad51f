
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Author } from '@/types/storytelling';

interface AuthorAnalyzedInfoSectionProps {
  author: Author;
  onInputChange: (field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, value: string) => void;
}

const AuthorAnalyzedInfoSection: FC<AuthorAnalyzedInfoSectionProps> = ({ 
  author, 
  onInputChange
}) => {
  const hasAnalyzedInfo = author.role || author.organization || author.backstory;
  
  if (!hasAnalyzedInfo) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium text-story-blue">Profile Information</h3>
      <p className="text-sm text-gray-600">
        Information extracted from profile analysis. You can edit any of these fields.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Role/Title</label>
          <Input 
            placeholder="e.g., Founder & CEO"
            value={author.role}
            onChange={(e) => onInputChange('role', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Organization</label>
          <Input 
            placeholder="Company or organization name"
            value={author.organization}
            onChange={(e) => onInputChange('organization', e.target.value)}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Backstory</label>
        <Textarea 
          placeholder="Author's career background and founding journey"
          value={author.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default AuthorAnalyzedInfoSection;
