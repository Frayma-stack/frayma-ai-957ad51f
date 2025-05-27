
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { CompanyLink, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { buildClientAnalysisPrompt, parseClientAnalysisContent } from '@/utils/clientAnalysisUtils';
import { supabase } from '@/integrations/supabase/client';

export const useClientAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeClient = async (
    companyLinks: CompanyLink[], 
    companyName: string,
    onAnalysisComplete: (productContext: ProductContext) => void
  ) => {
    console.log('Starting client analysis...', { companyLinks, companyName });
    
    setIsAnalyzing(true);
    
    try {
      if (companyLinks.length === 0) {
        toast({
          title: "No URLs to analyze",
          description: "Please provide at least one company URL.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      const { systemPrompt, userPrompt } = buildClientAnalysisPrompt(companyLinks, companyName);
      console.log('Sending prompts to analysis service:', { systemPrompt, userPrompt });
      
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { 
          systemPrompt, 
          userPrompt,
          model: 'llama-3.1-sonar-large-128k-online'
        }
      });
      
      if (error) {
        console.error('Supabase function error:', error);
        throw new Error(error.message || 'Failed to analyze client');
      }
      
      if (!data) {
        throw new Error('No data received from analysis service');
      }
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      console.log('Analysis service response:', data);
      
      // Handle both direct content and Perplexity API response format
      let content = '';
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        content = data.choices[0].message.content;
      } else if (typeof data === 'string') {
        content = data;
      } else if (data.content) {
        content = data.content;
      } else {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from analysis service');
      }
      
      console.log('Raw content from analysis service:', content);
      
      let parsedData;
      try {
        parsedData = parseClientAnalysisContent(content);
        console.log('Parsed data:', parsedData);
      } catch (parseError) {
        console.error('Analysis parsing error:', parseError);
        
        // Enhanced error handling with more specific guidance
        const errorMessage = parseError.message;
        
        if (errorMessage.includes('Website analysis failed') || 
            errorMessage.includes('cannot access external websites') ||
            errorMessage.includes('authentication') ||
            errorMessage.includes('not publicly available')) {
          
          // Show a more helpful toast with suggestions
          toast({
            title: "Website Access Restricted",
            description: "The AI couldn't access some URLs due to access restrictions. Try public URLs or enter information manually.",
            variant: "destructive",
            duration: 8000
          });
          
          // Log the detailed error for the user's reference
          console.warn('Detailed access error:', errorMessage);
          
        } else {
          toast({
            title: "Analysis Response Error", 
            description: "The analysis service returned invalid data. Please try again or enter the information manually.",
            variant: "destructive"
          });
        }
        return;
      }
      
      // Validate that we have meaningful data
      if (!parsedData.companySummary && !parsedData.features?.length && !parsedData.useCases?.length) {
        toast({
          title: "Analysis Incomplete",
          description: "The analysis service couldn't extract meaningful information from the provided URLs. Please verify the URLs are accessible and try again, or enter the information manually.",
          variant: "destructive"
        });
        return;
      }
      
      // Transform parsed data into ProductContext with proper structure
      const features: ProductFeature[] = (parsedData.features || []).map((feature: any) => ({
        id: crypto.randomUUID(),
        name: feature.name || '',
        benefits: Array.isArray(feature.benefits) ? feature.benefits : [],
        media: []
      }));
      
      const useCases: ProductUseCase[] = (parsedData.useCases || []).map((useCase: any) => ({
        id: crypto.randomUUID(),
        useCase: useCase.useCase || '',
        userRole: useCase.userRole || '',
        description: useCase.description || '',
        media: []
      }));
      
      const differentiators: ProductDifferentiator[] = (parsedData.differentiators || []).map((diff: any) => ({
        id: crypto.randomUUID(),
        name: diff.name || '',
        description: diff.description || '',
        competitorComparison: diff.competitorComparison || ''
      }));
      
      const productContext: ProductContext = {
        id: crypto.randomUUID(),
        features,
        useCases,
        differentiators,
        categoryPOV: parsedData.categoryPOV || '',
        companyMission: parsedData.companyMission || '',
        uniqueInsight: parsedData.uniqueInsight || '',
        companyLinks: companyLinks
      };
      
      console.log('Generated product context from analysis:', productContext);
      
      // Call the callback with the generated product context
      onAnalysisComplete(productContext);
      
      const extractedItems = [];
      if (features.length > 0) extractedItems.push(`${features.length} features`);
      if (useCases.length > 0) extractedItems.push(`${useCases.length} use cases`);
      if (differentiators.length > 0) extractedItems.push(`${differentiators.length} differentiators`);
      
      toast({
        title: "Client analysis complete",
        description: extractedItems.length > 0 
          ? `Successfully extracted ${extractedItems.join(', ')}.`
          : "Analysis completed. Please review and add more details as needed.",
      });
      
    } catch (error) {
      console.error('Error analyzing client:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the client.';
      
      // Provide more helpful error messages based on the type of error
      let displayMessage = errorMessage;
      if (errorMessage.includes('Rate limit')) {
        displayMessage = 'Analysis service is temporarily overloaded. Please try again in a few minutes.';
      } else if (errorMessage.includes('Authentication failed')) {
        displayMessage = 'There was an authentication issue with the analysis service. Please try again.';
      } else if (errorMessage.includes('Network')) {
        displayMessage = 'Network connection issue. Please check your connection and try again.';
      }
      
      toast({
        title: "Analysis Failed",
        description: displayMessage,
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return {
    isAnalyzing,
    analyzeClient
  };
};
