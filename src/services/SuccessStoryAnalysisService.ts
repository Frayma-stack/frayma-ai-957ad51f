
export interface SuccessStoryAnalysis {
  title: string;
  beforeSummary: string;
  afterSummary: string;
  quotes: Array<{
    quote: string;
    author: string;
    title: string;
  }>;
  features: Array<{
    name: string;
    description: string;
  }>;
}

export class SuccessStoryAnalysisService {
  private static readonly API_BASE_URL = 'https://rrltvtuuzljqkbdavzyw.supabase.co/functions/v1';

  static async analyzeSuccessStory(url: string): Promise<SuccessStoryAnalysis> {
    try {
      const response = await fetch(`${this.API_BASE_URL}/analyze-success-story`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJybHR2dHV1emxqcWtiZGF2enl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgxMDg4ODIsImV4cCI6MjA2MzY4NDg4Mn0.V04fIdJirow_P0GiI6pDiA8eYClkGwL7GHlQNNDsekY`
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error analyzing success story:', error);
      throw error;
    }
  }
}
