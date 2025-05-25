
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PerplexityResponse } from '@/types/profileAnalyzer';
import { 
  collectUrls, 
  buildPrompt, 
  parseAnalysisContent, 
  transformAnalysisResults, 
  getErrorMessage 
} from '@/utils/profileAnalyzerUtils';
import { AuthorSocialLink, AuthorExperience, AuthorToneItem } from '@/types/storytelling';
import { supabase } from '@/integrations/supabase/client';

export const useProfileAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeProfile = async (
    socialLinks: AuthorSocialLink[], 
    additionalUrls: string,
    onAnalysisComplete: (results: { experiences?: AuthorExperience[], tones?: AuthorToneItem[] }) => void
  ) => {
    console.log('Starting analysis...');
    
    setIsAnalyzing(true);
    
    try {
      const { linkedinUrls, otherUrls } = collectUrls(socialLinks, additionalUrls);
      
      console.log('LinkedIn URLs:', linkedinUrls);
      console.log('Other URLs:', otherUrls);
      
      if (linkedinUrls.length === 0 && otherUrls.length === 0) {
        toast({
          title: "No URLs to analyze",
          description: "Please provide at least one LinkedIn profile or other URL.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      const prompt = buildPrompt(linkedinUrls, otherUrls);
      console.log('Sending prompt to analysis service:', prompt);
      
      console.log('Making request to Supabase Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { prompt }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to analyze profile');
      }
      
      if (!data) {
        throw new Error('No data received from analysis service');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('Analysis service response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from analysis service');
      }
      
      const content = data.choices[0].message.content;
      console.log('Raw content from analysis service:', content);
      
      const parsedData = parseAnalysisContent(content);
      console.log('Parsed data:', parsedData);
      
      const { experiences, tones } = transformAnalysisResults(parsedData);
      
      console.log('Transformed experiences:', experiences);
      console.log('Transformed tones:', tones);
      
      if (experiences.length === 0 && tones.length === 0) {
        toast({
          title: "Analysis yielded no results",
          description: "No experiences or tones could be extracted from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete({
          experiences: experiences.length > 0 ? experiences : undefined,
          tones: tones.length > 0 ? tones : undefined
        });
        toast({
          title: "Analysis complete",
          description: `Successfully extracted ${experiences.length} experiences and ${tones.length} tones.`,
        });
      }
    } catch (error) {
      console.error('Error analyzing profile:', error);
      
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Analysis Failed",
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
