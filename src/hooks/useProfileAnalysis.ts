
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
    console.log('Starting OpenAI profile generation for author:', authorName);
    
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
      
      const prompt = buildPrompt(linkedinUrls, xUrls, otherUrls, authorName);
      console.log('Sending prompt to OpenAI generation service:', prompt);
      
      console.log('Making request to OpenAI Edge Function...');
      
      const { data, error } = await supabase.functions.invoke('analyze-profile-openai', {
        body: { prompt }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to generate profile with OpenAI');
      }
      
      if (!data) {
        throw new Error('No data received from OpenAI generation service');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('OpenAI generation service response:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from OpenAI generation service');
      }
      
      const content = data.choices[0].message.content;
      console.log('Raw content from OpenAI generation service:', content);
      
      const parsedData = parseAnalysisContent(content);
      console.log('Parsed data:', parsedData);
      
      const { currentRole, organization, backstory, experiences, tones, beliefs } = transformAnalysisResults(parsedData);
      
      console.log('Transformed data:', { currentRole, organization, backstory, experiences, tones, beliefs });
      
      if (!currentRole && !organization && !backstory && experiences.length === 0 && tones.length === 0 && beliefs.length === 0) {
        toast({
          title: "Generation yielded no results",
          description: "No information could be generated from the provided URLs.",
          variant: "destructive"
        });
      } else {
        onAnalysisComplete({
          currentRole: currentRole || undefined,
          organization: organization || undefined,
          backstory: backstory || undefined,
          experiences: experiences.length > 0 ? experiences : undefined,
          tones: tones.length > 0 ? tones : undefined,
          beliefs: beliefs.length > 0 ? beliefs : undefined
        });
        
        const generatedItems = [];
        if (currentRole) generatedItems.push('role');
        if (organization) generatedItems.push('organization');
        if (backstory) generatedItems.push('backstory');
        if (experiences.length > 0) generatedItems.push(`${experiences.length} experiences`);
        if (tones.length > 0) generatedItems.push(`${tones.length} writing tones`);
        if (beliefs.length > 0) generatedItems.push(`${beliefs.length} product beliefs`);
        
        toast({
          title: "Profile generation complete",
          description: `Successfully generated ${generatedItems.join(', ')}.`,
        });
      }
    } catch (error) {
      console.error('Error generating profile with OpenAI:', error);
      
      const errorMessage = getErrorMessage(error);
      
      toast({
        title: "Profile Generation Failed",
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
