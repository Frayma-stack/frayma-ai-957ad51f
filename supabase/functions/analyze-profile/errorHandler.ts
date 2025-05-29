
export class ProfileAnalysisError extends Error {
  public statusCode: number;
  public suggestion: string;

  constructor(message: string, statusCode: number = 500, suggestion: string = 'Please try again later.') {
    super(message);
    this.name = 'ProfileAnalysisError';
    this.statusCode = statusCode;
    this.suggestion = suggestion;
  }
}

export class ErrorHandler {
  static handlePerplexityError(status: number, errorText: string): ProfileAnalysisError {
    let errorMessage = 'LinkedIn analysis service error';
    let suggestion = 'Please try again or contact support if the issue persists.';
    
    if (status === 401) {
      errorMessage = 'Authentication failed with analysis service. Please check API key configuration.';
    } else if (status === 429) {
      errorMessage = 'Rate limit exceeded. The analysis service is currently overloaded. Please try again in a few minutes.';
    } else if (status === 403) {
      errorMessage = 'Access forbidden to analysis service. This may be due to network restrictions or API permissions.';
    } else if (status >= 500) {
      errorMessage = 'Analysis service temporarily unavailable. Please try again later.';
    } else if (status === 400) {
      errorMessage = 'Invalid request format or LinkedIn content too large for processing.';
    }
    
    return new ProfileAnalysisError(errorMessage, status, suggestion);
  }

  static handleScrapeError(error: Error): ProfileAnalysisError {
    return new ProfileAnalysisError(
      'Failed to scrape LinkedIn content',
      500,
      'Please verify the LinkedIn URLs are accessible and try again.'
    );
  }

  static handleGenericError(error: Error): ProfileAnalysisError {
    let errorMessage = 'Internal server error during LinkedIn analysis';
    let suggestion = 'Please try again later.';
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Network connection error during LinkedIn analysis';
      suggestion = 'Unable to connect to the analysis service. Please check your connection and try again.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'LinkedIn analysis request timeout';
      suggestion = 'The LinkedIn analysis request timed out. Please try again or contact support.';
    }
    
    return new ProfileAnalysisError(errorMessage, 500, suggestion);
  }

  static createErrorResponse(error: ProfileAnalysisError, corsHeaders: Record<string, string>): Response {
    return new Response(
      JSON.stringify({ 
        error: error.message,
        suggestion: error.suggestion,
        details: error.message
      }), 
      {
        status: error.statusCode,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
}
