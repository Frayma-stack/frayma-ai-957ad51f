
import { FC } from 'react';
import { Input } from "@/components/ui/input";
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
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Name*</label>
        <Input 
          placeholder="Author's full name"
          value={author.name}
          onChange={(e) => onInputChange('name', e.target.value)}
        />
      </div>
    </div>
  );
};

export default AuthorBasicInfoSection;
