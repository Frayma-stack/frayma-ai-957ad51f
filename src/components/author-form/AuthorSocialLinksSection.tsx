
import { FC, useState } from 'react';
import { AuthorSocialLink } from '@/types/storytelling';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Sparkles, Loader2, UserPlus } from 'lucide-react';

interface AuthorSocialLinksSectionProps {
  socialLinks: AuthorSocialLink[];
  onSocialLinkChange: (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
}

const AuthorSocialLinksSection: FC<AuthorSocialLinksSectionProps> = ({
  socialLinks,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink
}) => {
  const { isAnalyzing, analyzeProfile } = useProfileAnalysis();
  const [manualMode, setManualMode] = useState(false);
  
  const hasAnyUrls = socialLinks.some(link => link.url.trim() !== '');
  
  console.log('AuthorSocialLinksSection state:', {
    hasAnyUrls,
    manualMode
  });

  const handleAnalysis = () => {
    if (!hasAnyUrls) {
      return;
    }
    
    analyzeProfile(
      socialLinks, 
      '', 
      '',
      () => {}
    );
  };

  const handleManualMode = () => {
    setManualMode(true);
  };

  // If manual mode is selected, show message and continue to expanded form
  if (manualMode) {
    return (
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <p className="text-sm text-blue-700 font-medium">
            Manual author mode enabled. You can now fill in all author details manually in the sections below.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-story-blue">Social Links & Profile Analysis</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSocialLink}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      <p className="text-sm text-gray-600">
        Add your LinkedIn profile, X (Twitter), blog, or website URLs to auto-fill author information, or add author details manually.
      </p>

      <div className="space-y-4">
        {socialLinks.map((link) => (
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
              disabled={socialLinks.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center space-x-4">
        <Button 
          onClick={handleAnalysis}
          disabled={isAnalyzing || !hasAnyUrls}
          className="bg-story-blue hover:bg-story-light-blue"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
              Analyzing profile...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" /> 
              Analyze & Auto-fill
            </>
          )}
        </Button>
        
        <div className="flex items-center space-x-4">
          <div className="h-px bg-gray-300 w-8"></div>
          <span className="text-sm text-gray-500">OR</span>
          <div className="h-px bg-gray-300 w-8"></div>
        </div>
        
        <Button 
          variant="outline"
          onClick={handleManualMode}
          className="border-story-blue text-story-blue hover:bg-story-blue hover:text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Add Manually
        </Button>
      </div>

      {!hasAnyUrls && (
        <p className="text-sm text-amber-600 text-center">
          Please add at least one social link or URL to analyze the profile.
        </p>
      )}
    </div>
  );
};

export default AuthorSocialLinksSection;
