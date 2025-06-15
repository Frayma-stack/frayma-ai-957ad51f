
export class ChatService {
  private static async makeOpenAIRequest(prompt: string, maxTokens = 1500, temperature = 0.7) {
    console.log('🤖 Making request to edge function with prompt length:', prompt?.length || 0);

    try {
      // Use the full Supabase project URL for the edge function
      const supabaseUrl = 'https://rrltvtuuzljqkbdavzyw.supabase.co';
      const response = await fetch(`${supabaseUrl}/functions/v1/openai-chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHR2dHV1emxqcWtiZGF2enl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDg4ODIsImV4cCI6MjA2MzY4NDg4Mn0.V04fIdJirow_P0GiI6pDiA8eYClkGwL7GHlQNNDsekY`
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
