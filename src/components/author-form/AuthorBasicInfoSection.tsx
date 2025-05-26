
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import { Link as LinkIcon } from 'lucide-react';

interface AuthorBasicInfoSectionProps {
  author: Author;
  onInputChange: (field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, value: string) => void;
  onAnalysisComplete: (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: any[];
    tones?: any[];
    beliefs?: any[];
  }) => void;
}

const AuthorBasicInfoSection: FC<AuthorBasicInfoSectionProps> = ({ 
  author, 
  onInputChange,
  onAnalysisComplete
}) => {
  const { isAnalyzing, analyzeProfile } = useProfileAnalysis();

  const handleAnalyzeProfile = () => {
    if (!author.name.trim()) {
      return;
    }
    
    analyzeProfile(
      author.socialLinks || [], 
      '', // additionalUrls - empty for now since it's handled in the social links section
      author.name,
      onAnalysisComplete
    );
  };

  const hasValidUrls = (author.socialLinks || []).some(link => link.url.trim() !== '');

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

      {author.name.trim() && hasValidUrls && (
        <Button 
          className="w-full"
          variant="secondary"
          onClick={handleAnalyzeProfile}
          disabled={isAnalyzing}
        >
          <LinkIcon className="h-4 w-4 mr-2" /> 
          {isAnalyzing ? 'Analyzing Profile...' : 'Analyze Profile & Auto-Fill'}
        </Button>
      )}
      
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
          placeholder="Describe the author's founding journey or background"
          value={author.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default AuthorBasicInfoSection;
