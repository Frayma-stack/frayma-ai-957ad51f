
import { FC, useState } from 'react';
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import { useSocialLinksState } from './social-links/useSocialLinksState';
import StepOneLinkedInSection from './social-links/StepOneLinkedInSection';
import StepTwoContentSection from './social-links/StepTwoContentSection';
import { Button } from "@/components/ui/button";
import { UserPlus, Sparkles } from 'lucide-react';

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
  const [manualMode, setManualMode] = useState(false);
  const { 
    stepOneCompleted, 
    setStepOneCompleted, 
    hasLinkedInUrl, 
    hasStepOneResults, 
    linkedInLink 
  } = useSocialLinksState(author);
  
  console.log('AuthorSocialLinksSection state:', {
    authorName: author.name,
    hasLinkedInUrl,
    stepOneCompleted,
    hasStepOneResults,
    manualMode
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

  const handleManualMode = () => {
    setManualMode(true);
    // Trigger analysis complete to show the expanded form
    onAnalysisComplete({});
  };

  // If manual mode is selected, show expanded form immediately
  if (manualMode) {
    return (
      <StepTwoContentSection
        author={author}
        onSocialLinkChange={onSocialLinkChange}
        onAddSocialLink={onAddSocialLink}
        onRemoveSocialLink={onRemoveSocialLink}
        onAnalyze={handleStepTwoAnalysis}
        isAnalyzing={isAnalyzing}
        stepOneCompleted={true}
        hasStepOneResults={true}
      />
    );
  }

  // Show step 1: LinkedIn URL only
  if (!stepOneCompleted && !hasStepOneResults) {
    return (
      <div className="space-y-4">
        <StepOneLinkedInSection
          author={author}
          onSocialLinkChange={onSocialLinkChange}
          onAnalyze={handleStepOneAnalysis}
          isAnalyzing={isAnalyzing}
        />
        
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-4">
            <div className="h-px bg-gray-300 flex-1"></div>
            <span className="text-sm text-gray-500 px-3">OR</span>
            <div className="h-px bg-gray-300 flex-1"></div>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            variant="outline"
            onClick={handleManualMode}
            className="border-story-blue text-story-blue hover:bg-story-blue hover:text-white"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Author Manually
          </Button>
        </div>
      </div>
    );
  }

  // Show step 2: Add other links for content analysis
  return (
    <StepTwoContentSection
      author={author}
      onSocialLinkChange={onSocialLinkChange}
      onAddSocialLink={onAddSocialLink}
      onRemoveSocialLink={onRemoveSocialLink}
      onAnalyze={handleStepTwoAnalysis}
      isAnalyzing={isAnalyzing}
      stepOneCompleted={stepOneCompleted}
      hasStepOneResults={hasStepOneResults}
    />
  );
};

export default AuthorSocialLinksSection;
