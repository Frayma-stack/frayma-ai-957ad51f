
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
      console.log('Sending analysis request to Perplexity API...');
      
      const { data, error } = await supabase.functions.invoke('analyze-profile', {
        body: { 
          systemPrompt, 
          userPrompt
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
      
      // Extract content from Perplexity API response
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
      
      // Parse the analysis content
      let parsedData;
      try {
        parsedData = parseClientAnalysisContent(content);
        console.log('Successfully parsed analysis data:', parsedData);
      } catch (parseError) {
        console.error('Analysis parsing error:', parseError);
        toast({
          title: "Analysis Failed",
          description: parseError.message,
          variant: "destructive",
          duration: 8000
        });
        return;
      }
      
      // Transform parsed data into ProductContext
      const features: ProductFeature[] = (parsedData.features || []).map((feature: any) => ({
        id: crypto.randomUUID(),
        name: feature.name || '',
        benefits: Array.isArray(feature.benefits) ? feature.benefits : [feature.benefits || ''].filter(Boolean),
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
      
      // Show success message
      const extractedItems = [];
      if (parsedData.companySummary) extractedItems.push('company overview');
      if (features.length > 0) extractedItems.push(`${features.length} features`);
      if (useCases.length > 0) extractedItems.push(`${useCases.length} use cases`);
      if (differentiators.length > 0) extractedItems.push(`${differentiators.length} differentiators`);
      
      toast({
        title: "Analysis Complete!",
        description: extractedItems.length > 0 
          ? `Successfully extracted ${extractedItems.join(', ')} from the company websites.`
          : "Analysis completed. Product context has been populated with available information.",
      });
      
    } catch (error) {
      console.error('Error analyzing client:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the client.';
      
      // Provide more helpful error messages
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
