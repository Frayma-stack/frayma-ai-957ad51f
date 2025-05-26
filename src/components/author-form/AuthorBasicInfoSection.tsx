
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import { Link as LinkIcon, Loader2 } from 'lucide-react';

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
  const canAnalyze = author.name.trim() && hasValidUrls;

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

      {canAnalyze && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-medium text-blue-900 mb-1">
                Auto-fill from social profiles
              </h4>
              <p className="text-xs text-blue-700">
                Analyze LinkedIn and other profiles to automatically populate role, organization, backstory, experiences, tones, and beliefs.
              </p>
            </div>
            <Button 
              size="sm"
              onClick={handleAnalyzeProfile}
              disabled={isAnalyzing}
              className="ml-4"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Analyzing...
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4 mr-2" /> 
                  Analyze & Auto-Fill
                </>
              )}
            </Button>
          </div>
        </div>
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
          placeholder="Describe the author's founding journey or background (will be auto-filled from profile analysis)"
          value={author.backstory}
          onChange={(e) => onInputChange('backstory', e.target.value)}
          rows={5}
        />
      </div>
    </div>
  );
};

export default AuthorBasicInfoSection;
