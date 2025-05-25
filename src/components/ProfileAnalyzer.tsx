
import { FC, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ProfileAnalyzerProps } from '@/types/profileAnalyzer';
import { useProfileAnalysis } from '@/hooks/useProfileAnalysis';
import ProfileAnalyzerHeader from '@/components/profile-analyzer/ProfileAnalyzerHeader';
import HowItWorksSection from '@/components/profile-analyzer/HowItWorksSection';
import SocialLinksDisplay from '@/components/profile-analyzer/SocialLinksDisplay';
import AdditionalUrlsInput from '@/components/profile-analyzer/AdditionalUrlsInput';
import ProfileAnalyzerFooter from '@/components/profile-analyzer/ProfileAnalyzerFooter';

const ProfileAnalyzer: FC<ProfileAnalyzerProps> = ({ 
  socialLinks, 
  onClose,
  onAnalysisComplete
}) => {
  const [additionalUrls, setAdditionalUrls] = useState('');
  const { isAnalyzing, analyzeProfile } = useProfileAnalysis();
  
  const handleAnalyze = () => {
    analyzeProfile(socialLinks, additionalUrls, onAnalysisComplete);
  };

  return (
    <Card className="bg-white shadow-md">
      <ProfileAnalyzerHeader />
      
      <CardContent className="space-y-6">
        <HowItWorksSection />
        <SocialLinksDisplay socialLinks={socialLinks} />
        <AdditionalUrlsInput 
          additionalUrls={additionalUrls}
          onAdditionalUrlsChange={setAdditionalUrls}
        />
      </CardContent>
      
      <ProfileAnalyzerFooter 
        isAnalyzing={isAnalyzing}
        onClose={onClose}
        onAnalyze={handleAnalyze}
      />
    </Card>
  );
};

export default ProfileAnalyzer;
