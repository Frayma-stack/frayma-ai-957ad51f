
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { PerplexityResponse } from '@/types/profileAnalyzer';
import { collectUrls } from '@/utils/urlCollector';
import { buildAnalysisPrompt } from '@/utils/promptBuilder';
import { parseAnalysisContent } from '@/utils/responseParser';
import { transformAnalysisResults } from '@/utils/dataTransformer';
import { getErrorMessage } from '@/utils/errorHandler';
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
    console.log('Starting LinkedIn profile analysis for author:', authorName);
    
    setIsAnalyzing(true);
    
    try {
      const urls = collectUrls(socialLinks, additionalUrls);
      
      console.log('LinkedIn URLs to analyze:', urls);
      
      if (urls.length === 0) {
        toast({
          title: "No URLs provided",
          description: "Please provide at least one LinkedIn profile URL for analysis.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      // Build the enhanced prompt for LinkedIn experience extraction
      const { systemPrompt, userPrompt } = buildAnalysisPrompt(urls);
      console.log('LinkedIn analysis system prompt:', systemPrompt);
      console.log('LinkedIn analysis user prompt:', userPrompt);
      
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { 
          systemPrompt: systemPrompt,
          userPrompt: userPrompt
        }
      });
      
      if (error) {
        console.error('LinkedIn analysis error:', error);
        throw new Error(error.message || 'Failed to analyze LinkedIn profile');
      }
      
      if (!data || !data.choices || !data.choices[0]) {
        throw new Error('Invalid response from LinkedIn analysis service');
      }
      
      const content = data.choices[0].message.content;
      console.log('LinkedIn analysis content:', content);
      
      const parsed = parseAnalysisContent(content);
      const results = transformAnalysisResults(parsed);
      console.log('Transformed LinkedIn results:', results);
      
      if (!results.currentRole && !results.backstory && 
          !results.experiences.length && !results.tones.length && !results.beliefs.length) {
        toast({
          title: "LinkedIn analysis yielded no results",
          description: "No professional information could be extracted from the provided LinkedIn URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete(results);
        
        const generatedItems = [];
        if (results.currentRole) generatedItems.push('current role');
        if (results.backstory) generatedItems.push('career backstory');
        if (results.experiences.length > 0) generatedItems.push(`${results.experiences.length} LinkedIn experiences`);
        if (results.tones.length > 0) generatedItems.push(`${results.tones.length} writing tones`);
        if (results.beliefs.length > 0) generatedItems.push(`${results.beliefs.length} product beliefs`);
        
        toast({
          title: "LinkedIn profile analysis complete",
          description: `Successfully extracted ${generatedItems.join(', ')} from LinkedIn.`,
        });
      }
    } catch (error) {
      console.error('Error in LinkedIn profile analysis:', error);
      
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "LinkedIn Analysis Failed",
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
