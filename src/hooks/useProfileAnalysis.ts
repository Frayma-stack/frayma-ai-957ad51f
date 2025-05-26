
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PerplexityResponse } from '@/types/profileAnalyzer';
import { 
  collectUrls, 
  buildLinkedInExperiencesPrompt,
  buildSocialContentAnalysisPrompt,
  parseAnalysisContent, 
  transformAnalysisResults, 
  getErrorMessage 
} from '@/utils/profileAnalyzerUtils';
import { AuthorSocialLink, AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';
import { supabase } from '@/integrations/supabase/client';

export const useProfileAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProfile = async (
    socialLinks: AuthorSocialLink[], 
    additionalUrls: string,
    authorName: string,
    onAnalysisComplete: (results: { 
      currentRole?: string;
      organization?: string;
      backstory?: string;
      experiences?: AuthorExperience[];
      tones?: AuthorToneItem[];
      beliefs?: AuthorBelief[];
    }) => void
  ) => {
    console.log('Starting two-step profile analysis for author:', authorName);
    
    setIsAnalyzing(true);
    
    try {
      const { linkedinUrls, xUrls, otherUrls } = collectUrls(socialLinks, additionalUrls);
      
      console.log('LinkedIn URLs:', linkedinUrls);
      console.log('X URLs:', xUrls);
      console.log('Other URLs:', otherUrls);
      
      if (linkedinUrls.length === 0 && xUrls.length === 0 && otherUrls.length === 0) {
        toast({
          title: "No URLs provided",
          description: "Please provide at least one LinkedIn, X (Twitter), or other URL to generate profile information.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Step 1: Extract experiences from LinkedIn profile only
      let stepOneResults = { currentRole: '', organization: '', backstory: '', experiences: [] };
      
      if (linkedinUrls.length > 0) {
        console.log('Step 1: Extracting experiences from LinkedIn profile...');
        const linkedInPrompt = buildLinkedInExperiencesPrompt(linkedinUrls, authorName);
        console.log('LinkedIn experiences prompt:', linkedInPrompt);
        
        const { data: linkedInData, error: linkedInError } = await supabase.functions.invoke('analyze-profile', {
          body: { prompt: linkedInPrompt }
        });
        
        if (linkedInError) {
          console.error('LinkedIn analysis error:', linkedInError);
          throw new Error(linkedInError.message || 'Failed to analyze LinkedIn profile');
        }
        
        if (!linkedInData || !linkedInData.choices || !linkedInData.choices[0]) {
          throw new Error('Invalid response from LinkedIn analysis');
        }
        
        const linkedInContent = linkedInData.choices[0].message.content;
        console.log('LinkedIn analysis content:', linkedInContent);
        
        const linkedInParsed = parseAnalysisContent(linkedInContent);
        stepOneResults = transformAnalysisResults(linkedInParsed);
        console.log('Step 1 results:', stepOneResults);
      }
      
      // Step 2: Analyze social content for tones and beliefs
      let stepTwoResults = { tones: [], beliefs: [] };
      
      if (linkedinUrls.length > 0 || xUrls.length > 0 || otherUrls.length > 0) {
        console.log('Step 2: Analyzing social content for tones and beliefs...');
        const socialContentPrompt = buildSocialContentAnalysisPrompt(linkedinUrls, xUrls, otherUrls, authorName);
        console.log('Social content analysis prompt:', socialContentPrompt);
        
        const { data: socialData, error: socialError } = await supabase.functions.invoke('analyze-profile', {
          body: { prompt: socialContentPrompt }
        });
        
        if (socialError) {
          console.error('Social content analysis error:', socialError);
          // Don't fail the entire process if step 2 fails
          console.log('Continuing with step 1 results only');
        } else if (socialData && socialData.choices && socialData.choices[0]) {
          const socialContent = socialData.choices[0].message.content;
          console.log('Social content analysis:', socialContent);
          
          try {
            const socialParsed = parseAnalysisContent(socialContent);
            const socialTransformed = transformAnalysisResults(socialParsed);
            stepTwoResults = {
              tones: socialTransformed.tones || [],
              beliefs: socialTransformed.beliefs || []
            };
            console.log('Step 2 results:', stepTwoResults);
          } catch (parseError) {
            console.error('Error parsing social content results:', parseError);
            // Continue with empty tones and beliefs
          }
        }
      }
      
      // Combine results from both steps
      const finalResults = {
        currentRole: stepOneResults.currentRole || undefined,
        organization: stepOneResults.organization || undefined,
        backstory: stepOneResults.backstory || undefined,
        experiences: stepOneResults.experiences.length > 0 ? stepOneResults.experiences : undefined,
        tones: stepTwoResults.tones.length > 0 ? stepTwoResults.tones : undefined,
        beliefs: stepTwoResults.beliefs.length > 0 ? stepTwoResults.beliefs : undefined
      };
      
      console.log('Final combined results:', finalResults);
      
      if (!finalResults.currentRole && !finalResults.organization && !finalResults.backstory && 
          !finalResults.experiences && !finalResults.tones && !finalResults.beliefs) {
        toast({
          title: "Analysis yielded no results",
          description: "No information could be extracted from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete(finalResults);
        
        const generatedItems = [];
        if (finalResults.currentRole) generatedItems.push('role');
        if (finalResults.organization) generatedItems.push('organization');
        if (finalResults.backstory) generatedItems.push('backstory');
        if (finalResults.experiences) generatedItems.push(`${finalResults.experiences.length} experiences`);
        if (finalResults.tones) generatedItems.push(`${finalResults.tones.length} writing tones`);
        if (finalResults.beliefs) generatedItems.push(`${finalResults.beliefs.length} product beliefs`);
        
        toast({
          title: "Two-step profile analysis complete",
          description: `Successfully generated ${generatedItems.join(', ')}.`,
        });
      }
    } catch (error) {
      console.error('Error in two-step profile analysis:', error);
      
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Profile Analysis Failed",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeProfile
  };
};
