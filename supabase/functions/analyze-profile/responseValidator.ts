
export class ResponseValidator {
  static validatePerplexityResponse(data: any): void {
    if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Invalid response structure from Perplexity API:', data);
      throw new Error('Invalid response from LinkedIn analysis service. The analysis service returned an unexpected format. Please try again.');
    }
  }

  static validateApiKey(apiKey: string | undefined): void {
    if (!apiKey) {
      console.error('PERPLEXITY_API_KEY not found in environment');
      throw new Error('API key not configured. Please contact support.');
    }
  }

  static validateRequestBody(body: any): { systemPrompt: string; userPrompt: string; urls?: string[] } {
    const { systemPrompt, userPrompt, urls } = body;
    
    if (!systemPrompt || !userPrompt) {
      throw new Error('Missing required parameters: systemPrompt and userPrompt');
    }
    
    return { systemPrompt, userPrompt, urls };
  }

  static extractUrls(userPrompt: string): string[] {
    return userPrompt.match(/https?:\/\/[^\s]+/g) || [];
  }
}
