
interface PerplexityRequestBody {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
  top_p: number;
  return_images: boolean;
  return_related_questions: boolean;
  search_recency_filter: string;
  search_domain_filter: string[];
  return_citations: boolean;
  frequency_penalty: number;
  presence_penalty: number;
}

export class PerplexityClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  buildRequestBody(systemPrompt: string, userPrompt: string): PerplexityRequestBody {
    return {
      model: 'llama-3.1-sonar-small-128k-online',
      messages: [
        {
          role: 'system',
          content: systemPrompt + '\n\nIMPORTANT: The user will provide actual LinkedIn profile content below. Do NOT search online. Analyze ONLY the provided LinkedIn content and extract professional experiences in the EXACT format "Title @Company | Duration". Focus on work experience, education, and professional background. If information is not available in the provided content, leave those fields empty.'
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000,
      top_p: 0.9,
      return_images: false,
      return_related_questions: false,
      search_recency_filter: 'month',
      search_domain_filter: [],
      return_citations: false,
      frequency_penalty: 1,
      presence_penalty: 0
    };
  }

  async analyzeProfile(systemPrompt: string, userPrompt: string): Promise<any> {
    console.log('Making request to Perplexity API with LinkedIn content...');
    console.log('Enhanced LinkedIn prompt length:', userPrompt?.length || 0);
    
    const requestBody = this.buildRequestBody(systemPrompt, userPrompt);
    console.log('Request body prepared for LinkedIn analysis via Perplexity API');
    
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Frayma-LinkedIn-Analysis/1.0'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('Perplexity API response status for LinkedIn analysis:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('Perplexity API success response received for LinkedIn analysis');
    
    return data;
  }
}
