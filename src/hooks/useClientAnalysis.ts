
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
        body: { systemPrompt, userPrompt }
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
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from analysis service');
      }
      
      const content = data.choices[0].message.content;
      console.log('Raw content from analysis service:', content);
      
      const parsedData = parseClientAnalysisContent(content);
      console.log('Parsed data:', parsedData);
      
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
        description: `Successfully extracted ${extractedItems.join(', ')}.`,
      });
      
    } catch (error) {
      console.error('Error analyzing client:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the client.';
      
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
    analyzeClient
  };
};
