
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { usePerplexity } from '@/contexts/PerplexityContext';
import { PerplexityResponse } from '@/types/profileAnalyzer';
import { 
  collectUrls, 
  buildPrompt, 
  parseAnalysisContent, 
  transformAnalysisResults, 
  getErrorMessage,
  getApiErrorMessage 
} from '@/utils/profileAnalyzerUtils';
import { AuthorSocialLink, AuthorExperience, AuthorToneItem } from '@/types/storytelling';

export const useProfileAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { apiKey } = usePerplexity();

  const analyzeProfile = async (
    socialLinks: AuthorSocialLink[], 
    additionalUrls: string,
    onAnalysisComplete: (results: { experiences?: AuthorExperience[], tones?: AuthorToneItem[] }) => void
  ) => {
    console.log('Starting analysis...');
    console.log('API key available:', !!apiKey);
    console.log('API key length:', apiKey?.length);
    
    if (!apiKey) {
      console.log('No API key found');
      toast({
        title: "Service Unavailable",
        description: "The analysis service is currently unavailable. Please try again later.",
        variant: "destructive"
      });
      return;
    }

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
      console.log('Sending prompt to Perplexity:', prompt);
      
      console.log('Making fetch request to Perplexity API...');
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are an expert at analyzing professional profiles and content. Extract information in the format requested and return valid JSON only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000,
        }),
      });
      
      console.log('Fetch completed. Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('API error response:', errorText);
        
        const errorMessage = getApiErrorMessage(response.status);
        throw new Error(`${errorMessage} (Status: ${response.status})`);
      }
      
      const data: PerplexityResponse = await response.json();
      console.log('API response data:', data);
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from analysis service');
      }
      
      const content = data.choices[0].message.content;
      console.log('Raw content from API:', content);
      
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
