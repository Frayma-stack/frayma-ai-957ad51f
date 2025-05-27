
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { CompanyLink, ProductContext } from '@/types/storytelling';
import { parseClientAnalysisContent } from '@/utils/clientAnalysisUtils';
import { ClientAnalysisService } from '@/services/ClientAnalysisService';
import { ClientAnalysisResponseProcessor } from '@/utils/clientAnalysisResponseProcessor';
import { ClientAnalysisErrorHandler } from '@/utils/clientAnalysisErrorHandler';

export const useClientAnalysis = () => {
  const { toast } = useToast();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeClient = async (
    companyLinks: CompanyLink[], 
    companyName: string,
    onAnalysisComplete: (productContext: ProductContext) => void
  ) => {
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
      
      // Call the service to analyze the company
      const data = await ClientAnalysisService.analyzeCompany(companyLinks, companyName);
      
      // Extract content from the response
      const content = ClientAnalysisResponseProcessor.extractContent(data);
      console.log('Raw content from analysis service (with pre-fetched data):', content);
      
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
      
      // Transform to ProductContext
      const validLinks = companyLinks.filter(link => {
        const url = link.url.trim();
        return url && (url.startsWith('http://') || url.startsWith('https://'));
      });
      
      const productContext = ClientAnalysisResponseProcessor.transformToProductContext(parsedData, validLinks);
      console.log('Generated product context from pre-fetched analysis:', productContext);
      
      // Call the callback with the generated product context
      onAnalysisComplete(productContext);
      
      // Show success message
      const successMessage = ClientAnalysisErrorHandler.getSuccessMessage(
        parsedData, 
        productContext.features, 
        productContext.useCases, 
        productContext.differentiators
      );
      
      toast({
        title: "Analysis Complete!",
        description: successMessage,
        duration: 5000
      });
      
    } catch (error) {
      console.error('Error analyzing client:', error);
      
      const { message: displayMessage, duration } = ClientAnalysisErrorHandler.getEnhancedErrorMessage(error);
      
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
