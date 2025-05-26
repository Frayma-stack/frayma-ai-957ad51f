
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { Plus, Trash, Info, Sparkles, Loader2 } from 'lucide-react';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';

interface AuthorSocialLinksSectionProps {
  author: Author;
  onSocialLinkChange: (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
  onAnalyzeProfile: () => void;
  onAnalysisComplete: (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: any[];
    tones?: any[];
    beliefs?: any[];
  }) => void;
}

const AuthorSocialLinksSection: FC<AuthorSocialLinksSectionProps> = ({
  author,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
  onAnalyzeProfile,
  onAnalysisComplete
}) => {
  const { isAnalyzing, analyzeProfile } = useProfileAnalysis();
  const hasValidUrls = (author.socialLinks || []).some(link => link.url.trim() !== '');
  const canAnalyze = author.name.trim() && hasValidUrls;

  console.log('AuthorSocialLinksSection state:', {
    authorName: author.name,
    socialLinks: author.socialLinks,
    hasValidUrls,
    canAnalyze
  });

  const handleGenerateProfile = () => {
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

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-story-blue">Add Links</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSocialLink}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      {!hasValidUrls && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Add LinkedIn, X (Twitter), website, blog, or other profile URLs to enable AI-powered profile generation and auto-filling of author information.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {(author.socialLinks || []).map((link, index) => (
          <div key={link.id} className="flex items-center gap-3">
            <select 
              className="border border-input bg-background px-3 py-2 rounded-md text-sm h-10 min-w-[120px]"
              value={link.type}
              onChange={(e) => onSocialLinkChange(link.id, 'type', e.target.value as 'linkedin' | 'x' | 'blog' | 'website' | 'other')}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="blog">Blog</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
            <Input 
              placeholder="Enter profile or content URL"
              value={link.url}
              onChange={(e) => onSocialLinkChange(link.id, 'url', e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveSocialLink(link.id)}
              disabled={(author.socialLinks || []).length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {canAnalyze && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-sm text-blue-700">
              Ready to generate! Click "Generate Profile" below to automatically create role, organization, backstory, experiences, tones, and beliefs based on the provided links and author name.
            </p>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleGenerateProfile}
              disabled={isAnalyzing}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> 
                  Generate Profile
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSocialLinksSection;
