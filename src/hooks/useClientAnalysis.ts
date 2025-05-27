
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
      
      // Validate URLs before sending
      const validLinks = companyLinks.filter(link => {
        const url = link.url.trim();
        return url && (url.startsWith('http://') || url.startsWith('https://'));
      });
      
      if (validLinks.length === 0) {
        toast({
          title: "Invalid URLs",
          description: "Please provide valid HTTP/HTTPS URLs for analysis.",
          variant: "destructive"
        });
        setIsAnalyzing(false);
        return;
      }
      
      const { systemPrompt, userPrompt } = buildClientAnalysisPrompt(validLinks, companyName);
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
        console.error('Analysis service error:', data.error, data.details);
        throw new Error(data.error + (data.suggestion ? ` ${data.suggestion}` : ''));
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
          duration: 10000
        });
        return;
      }
      
      // Transform parsed data into ProductContext with enhanced mapping
      const features: ProductFeature[] = (parsedData.features || []).map((feature: any) => ({
        id: crypto.randomUUID(),
        name: feature.name || '',
        benefits: Array.isArray(feature.benefits) ? feature.benefits.filter(Boolean) : [],
        media: []
      }));
      
      const useCases: ProductUseCase[] = (parsedData.useCases || []).map((useCase: any) => ({
        id: crypto.randomUUID(),
        useCase: useCase.useCase || useCase.userRole || '',
        userRole: useCase.userRole || useCase.useCase || '',
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
        companyLinks: validLinks
      };
      
      console.log('Generated product context from analysis:', productContext);
      
      // Call the callback with the generated product context
      onAnalysisComplete(productContext);
      
      // Show enhanced success message
      const extractedItems = [];
      if (parsedData.companySummary) extractedItems.push('company overview');
      if (features.length > 0) extractedItems.push(`${features.length} features`);
      if (useCases.length > 0) extractedItems.push(`${useCases.length} use cases`);
      if (differentiators.length > 0) extractedItems.push(`${differentiators.length} differentiators`);
      if (parsedData.sources && parsedData.sources.length > 0) extractedItems.push(`analysis from ${parsedData.sources.length} sources`);
      
      toast({
        title: "Analysis Complete!",
        description: extractedItems.length > 0 
          ? `Successfully extracted ${extractedItems.join(', ')} from the company websites.`
          : "Analysis completed. Product context has been populated with available information.",
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error analyzing client:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the client.';
      
      // Enhanced error messages based on Perplexity's suggestions
      let displayMessage = errorMessage;
      let duration = 8000;
      
      if (errorMessage.includes('Rate limit')) {
        displayMessage = 'Analysis service is temporarily overloaded. Please try again in a few minutes.';
        duration = 10000;
      } else if (errorMessage.includes('Authentication failed')) {
        displayMessage = 'There was an authentication issue with the analysis service. Please contact support.';
      } else if (errorMessage.includes('Network') || errorMessage.includes('connection')) {
        displayMessage = 'Network connection issue. Please check your internet connection and verify the URLs are accessible, then try again.';
        duration = 10000;
      } else if (errorMessage.includes('cannot access') || errorMessage.includes('firewall') || errorMessage.includes('restricted')) {
        displayMessage = 'The analysis service cannot access the provided URLs. This may be due to network restrictions, authentication requirements, or the URLs being behind a firewall. Please verify the URLs are publicly accessible.';
        duration = 12000;
      } else if (errorMessage.includes('timeout')) {
        displayMessage = 'The analysis request timed out. Please try again with fewer URLs or verify the URLs are responding quickly.';
        duration = 10000;
      }
      
      toast({
        title: "Analysis Failed",
        description: displayMessage,
        variant: "destructive",
        duration: duration
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
