
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PerplexityResponse } from '@/types/profileAnalyzer';
import { 
  collectUrls, 
  buildAnalysisPrompt,
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
    console.log('Starting profile analysis for author:', authorName);
    
    setIsAnalyzing(true);
    
    try {
      const urls = collectUrls(socialLinks, additionalUrls);
      
      console.log('URLs to analyze:', urls);
      
      if (urls.length === 0) {
        toast({
          title: "No URLs provided",
          description: "Please provide at least one URL to analyze the profile.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Build the new analysis prompt
      const systemPrompt = buildAnalysisPrompt(urls);
      console.log('Analysis prompt:', systemPrompt);
      
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { 
          prompt: `${systemPrompt.content}\n\nPlease analyze the profile from the provided URLs and return the structured JSON data as specified.`
        }
      });
      
      if (error) {
        console.error('Analysis error:', error);
        throw new Error(error.message || 'Failed to analyze profile');
      }
      
      if (!data || !data.choices || !data.choices[0]) {
        throw new Error('Invalid response from analysis service');
      }
      
      const content = data.choices[0].message.content;
      console.log('Analysis content:', content);
      
      const parsed = parseAnalysisContent(content);
      const results = transformAnalysisResults(parsed);
      console.log('Transformed results:', results);
      
      if (!results.currentRole && !results.backstory && 
          !results.experiences.length && !results.tones.length && !results.beliefs.length) {
        toast({
          title: "Analysis yielded no results",
          description: "No information could be extracted from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete(results);
        
        const generatedItems = [];
        if (results.currentRole) generatedItems.push('role');
        if (results.backstory) generatedItems.push('backstory');
        if (results.experiences.length > 0) generatedItems.push(`${results.experiences.length} experiences`);
        if (results.tones.length > 0) generatedItems.push(`${results.tones.length} writing tones`);
        if (results.beliefs.length > 0) generatedItems.push(`${results.beliefs.length} product beliefs`);
        
        toast({
          title: "Profile analysis complete",
          description: `Successfully generated ${generatedItems.join(', ')}.`,
        });
      }
    } catch (error) {
      console.error('Error in profile analysis:', error);
      
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
