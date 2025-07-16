interface CompanyAnalysisRequestBody {
  model: string;
  messages: Array<{
    role: string;
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
}

export class CompanyAnalysisClient {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  buildRequestBody(systemPrompt: string, userPrompt: string): CompanyAnalysisRequestBody {
    return {
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    };
  }

  async analyzeCompany(systemPrompt: string, userPrompt: string): Promise<any> {
    console.log('Making request to OpenAI API for company analysis...');
    console.log('Company analysis prompt length:', userPrompt?.length || 0);
    
    const requestBody = this.buildRequestBody(systemPrompt, userPrompt);
    console.log('Request body prepared for company analysis via OpenAI API');
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Frayma-Company-Analysis/1.0'
      },
      body: JSON.stringify(requestBody),
    });

    console.log('OpenAI API response status for company analysis:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error response:', errorText);
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('OpenAI API success response received for company analysis');
    
    return data;
  }
}