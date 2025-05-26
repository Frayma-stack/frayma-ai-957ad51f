
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { Plus, Trash, Info, Sparkles, Loader2, CheckCircle } from 'lucide-react';

interface StepTwoContentSectionProps {
  author: Author;
  onSocialLinkChange: (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  stepOneCompleted: boolean;
  hasStepOneResults: boolean;
}

const StepTwoContentSection: FC<StepTwoContentSectionProps> = ({
  author,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
  onAnalyze,
  isAnalyzing,
  stepOneCompleted,
  hasStepOneResults
}) => {
  const otherLinks = (author.socialLinks || []).filter(link => link.type !== 'linkedin' && link.url.trim() !== '');
  const hasOtherUrls = otherLinks.length > 0;

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
              onClick={onAnalyze}
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

export default StepTwoContentSection;
