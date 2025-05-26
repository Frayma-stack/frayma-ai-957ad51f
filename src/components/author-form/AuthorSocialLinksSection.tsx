
import { FC, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { Plus, Trash, Info, Sparkles, Loader2, CheckCircle } from 'lucide-react';
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
  const [stepOneCompleted, setStepOneCompleted] = useState(false);
  
  // Check if we have LinkedIn URL for step 1
  const linkedInLink = (author.socialLinks || []).find(link => link.type === 'linkedin');
  const hasLinkedInUrl = linkedInLink && linkedInLink.url.trim() !== '';
  
  // Check if we have other URLs for step 2
  const otherLinks = (author.socialLinks || []).filter(link => link.type !== 'linkedin' && link.url.trim() !== '');
  const hasOtherUrls = otherLinks.length > 0;
  
  // Check if step 1 analysis has been completed (has basic info from LinkedIn)
  const hasStepOneResults = author.role || author.organization || author.experiences.some(exp => exp.title || exp.description);
  
  console.log('AuthorSocialLinksSection state:', {
    authorName: author.name,
    hasLinkedInUrl,
    hasOtherUrls,
    stepOneCompleted,
    hasStepOneResults
  });

  const handleStepOneAnalysis = () => {
    if (!author.name.trim() || !hasLinkedInUrl) {
      return;
    }
    
    // Only pass LinkedIn URL for step 1
    const linkedInUrls = linkedInLink ? [linkedInLink] : [];
    
    analyzeProfile(
      linkedInUrls, 
      '', 
      author.name,
      (results) => {
        setStepOneCompleted(true);
        onAnalysisComplete(results);
      }
    );
  };

  const handleStepTwoAnalysis = () => {
    if (!author.name.trim()) {
      return;
    }
    
    // Pass all URLs for step 2 (including LinkedIn for content analysis)
    analyzeProfile(
      author.socialLinks || [], 
      '', 
      author.name,
      onAnalysisComplete
    );
  };

  // Show step 1: LinkedIn URL only
  if (!stepOneCompleted && !hasStepOneResults) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-story-blue">Step 1: Add LinkedIn Profile</h3>
        </div>

        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">First, let's extract your professional experience</p>
              <p>Add your LinkedIn profile URL to automatically extract your role, organization, and work experiences.</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {(author.socialLinks || []).filter(link => link.type === 'linkedin').map((link) => (
            <div key={link.id} className="flex items-center gap-3">
              <div className="bg-[#0077B5] text-white px-3 py-2 rounded-md text-sm font-medium min-w-[120px] text-center">
                LinkedIn
              </div>
              <Input 
                placeholder="Enter your LinkedIn profile URL"
                value={link.url}
                onChange={(e) => onSocialLinkChange(link.id, 'url', e.target.value)}
                className="flex-1"
              />
            </div>
          ))}
        </div>

        {hasLinkedInUrl && (
          <div className="flex justify-center">
            <Button 
              onClick={handleStepOneAnalysis}
              disabled={isAnalyzing}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Extracting LinkedIn data...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> 
                  Analyze LinkedIn Profile
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
  }

  // Show step 2: Add other links for content analysis
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-story-blue">
          {stepOneCompleted || hasStepOneResults ? 'Step 2: Add Content Links' : 'Add Links'}
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSocialLink}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      {(stepOneCompleted || hasStepOneResults) && (
        <div className="bg-green-50 border border-green-200 p-3 rounded-md">
          <div className="flex items-start">
            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
            <div className="text-sm text-green-700">
              <p className="font-medium mb-1">LinkedIn analysis completed!</p>
              <p>Now add your X (Twitter), blog, website, or other content URLs to analyze your writing tones and product beliefs.</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {(author.socialLinks || []).map((link) => (
          <div key={link.id} className="flex items-center gap-3">
            <select 
              className="border border-input bg-background px-3 py-2 rounded-md text-sm h-10 min-w-[120px]"
              value={link.type}
              onChange={(e) => onSocialLinkChange(link.id, 'type', e.target.value as 'linkedin' | 'x' | 'blog' | 'website' | 'other')}
              disabled={link.type === 'linkedin' && (stepOneCompleted || hasStepOneResults)}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="blog">Blog</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
            <Input 
              placeholder={link.type === 'linkedin' ? "LinkedIn profile URL (completed)" : "Enter profile or content URL"}
              value={link.url}
              onChange={(e) => onSocialLinkChange(link.id, 'url', e.target.value)}
              className="flex-1"
              disabled={link.type === 'linkedin' && (stepOneCompleted || hasStepOneResults)}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveSocialLink(link.id)}
              disabled={
                (author.socialLinks || []).length <= 1 || 
                (link.type === 'linkedin' && (stepOneCompleted || hasStepOneResults))
              }
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {hasOtherUrls && (stepOneCompleted || hasStepOneResults) && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-md">
            <p className="text-sm text-blue-700 font-medium mb-2">
              Ready for content analysis!
            </p>
            <div className="text-sm text-blue-600">
              <p>Analyze your social content and online presence to identify writing tones and product beliefs.</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={handleStepTwoAnalysis}
              disabled={isAnalyzing}
              className="bg-story-blue hover:bg-story-light-blue"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Analyzing content...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" /> 
                  Analyze Writing & Beliefs
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {!hasOtherUrls && (stepOneCompleted || hasStepOneResults) && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Add X (Twitter), blog, website, or other content URLs to analyze writing tones and product beliefs.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorSocialLinksSection;
