
export class ChatService {
  private static async makeOpenAIRequest(prompt: string, maxTokens = 1500, temperature = 0.7) {
    console.log('🤖 Making request to edge function with prompt length:', prompt?.length || 0);

    try {
      // Make request to our Supabase edge function
      const response = await fetch('/functions/v1/openai-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          maxTokens,
          temperature
        }),
      });

      console.log('🤖 Edge function response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `Request failed with status ${response.status}`;
        console.error('🤖 Edge function error:', errorMessage);
        throw new Error(errorMessage);
      }

      const data = await response.json();
      const content = data.content || 'No content generated';

      console.log('🤖 Edge function success, content length:', content.length);
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
