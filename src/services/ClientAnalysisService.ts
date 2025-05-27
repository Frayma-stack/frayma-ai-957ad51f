
import { supabase } from '@/integrations/supabase/client';
import { CompanyLink } from '@/types/storytelling';
import { buildClientAnalysisPrompt } from '@/utils/clientAnalysisUtils';
import { AnalysisServiceResponse } from '@/types/clientAnalysis';

export class ClientAnalysisService {
  static async analyzeCompany(companyLinks: CompanyLink[], companyName: string): Promise<AnalysisServiceResponse> {
    console.log('Starting client analysis with pre-fetching...', { companyLinks, companyName });
    
    // Validate URLs before sending
    const validLinks = companyLinks.filter(link => {
      const url = link.url.trim();
      return url && (url.startsWith('http://') || url.startsWith('https://'));
    });
    
    if (validLinks.length === 0) {
      throw new Error('Please provide valid HTTP/HTTPS URLs for analysis.');
    }
    
    const { systemPrompt, userPrompt } = buildClientAnalysisPrompt(validLinks, companyName);
    const urls = validLinks.map(link => link.url);
    
    console.log('Sending analysis request with pre-fetched content approach...');
    
    const { data, error } = await supabase.functions.invoke('analyze-profile', {
      body: { 
        systemPrompt, 
        userPrompt,
        urls // Pass URLs for content scraping
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
    return data;
  }
}
