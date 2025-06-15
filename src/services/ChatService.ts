
export class ChatService {
  private static async makeOpenAIRequest(prompt: string, maxTokens = 1500, temperature = 0.7) {
    // Check if we have an API key configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('🔑 No OpenAI API key found');
      throw new Error('OpenAI API key not configured. Please configure your OpenAI API key to use AI content generation features.');
    }

    console.log('🤖 Making OpenAI API request with prompt length:', prompt?.length || 0);

    try {
      // Make request to OpenAI API directly
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: maxTokens,
          temperature: temperature
        }),
      });

      console.log('🤖 OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('🤖 OpenAI API error:', response.status, errorText);
        throw new Error(`API request failed: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 'No content generated';

      console.log('🤖 OpenAI API success, content length:', content.length);
      return content;

    } catch (error) {
      console.error('🤖 Chat Service error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while generating content.');
    }
  }

  static async generateContent(prompt: string, options?: { maxTokens?: number; temperature?: number }): Promise<string> {
    return this.makeOpenAIRequest(
      prompt, 
      options?.maxTokens || 1500, 
      options?.temperature || 0.7
    );
  }
}
