
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Author } from '@/types/storytelling';

interface AuthorBasicInfoSectionProps {
  author: Author;
  onInputChange: (field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, value: string) => void;
}

const AuthorBasicInfoSection: FC<AuthorBasicInfoSectionProps> = ({ 
  author, 
  onInputChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-story-blue">Basic Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Name*</label>
          <Input 
            placeholder="Author's full name"
            value={author.name}
            onChange={(e) => onInputChange('name', e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Role</label>
          <Input 
            placeholder="e.g., CEO, Marketing Director"
            value={author.role}
            onChange={(e) => onInputChange('role', e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Organization</label>
        <Input 
          placeholder="Company or organization name"
          value={author.organization}
          onChange={(e) => onInputChange('organization', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Professional Background</label>
        <Textarea 
          placeholder="Brief description of professional background and expertise"
          value={author.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
};

export default AuthorBasicInfoSection;
