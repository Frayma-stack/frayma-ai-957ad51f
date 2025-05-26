
import { FC } from 'react';
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import { useSocialLinksState } from './social-links/useSocialLinksState';
import StepOneLinkedInSection from './social-links/StepOneLinkedInSection';
import StepTwoContentSection from './social-links/StepTwoContentSection';

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
      <StepOneLinkedInSection
        author={author}
        onSocialLinkChange={onSocialLinkChange}
        onAnalyze={handleStepOneAnalysis}
        isAnalyzing={isAnalyzing}
      />
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
