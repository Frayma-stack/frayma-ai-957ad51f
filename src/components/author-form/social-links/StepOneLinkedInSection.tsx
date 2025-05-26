
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { Info, Sparkles, Loader2 } from 'lucide-react';

interface StepOneLinkedInSectionProps {
  author: Author;
  onSocialLinkChange: (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const StepOneLinkedInSection: FC<StepOneLinkedInSectionProps> = ({
  author,
  onSocialLinkChange,
  onAnalyze,
  isAnalyzing
}) => {
  const linkedInLink = (author.socialLinks || []).find(link => link.type === 'linkedin');
  const hasLinkedInUrl = linkedInLink && linkedInLink.url.trim() !== '';

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
            onClick={onAnalyze}
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
};

export default StepOneLinkedInSection;
