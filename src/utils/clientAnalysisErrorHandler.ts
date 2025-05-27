
export class ClientAnalysisErrorHandler {
  static getEnhancedErrorMessage(error: unknown): { message: string; duration: number } {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred while analyzing the client.';
    
    // Enhanced error messages
    let displayMessage = errorMessage;
    let duration = 8000;
    
    if (errorMessage.includes('Rate limit')) {
      displayMessage = 'Analysis service is temporarily overloaded. Please try again in a few minutes.';
      duration = 10000;
    } else if (errorMessage.includes('Authentication failed')) {
      displayMessage = 'There was an authentication issue with the analysis service. Please contact support.';
    } else if (errorMessage.includes('Network') || errorMessage.includes('connection')) {
      displayMessage = 'Network connection issue. Please check your internet connection and verify the URLs are accessible, then try again.';
      duration = 10000;
    } else if (errorMessage.includes('scrape') || errorMessage.includes('extract content')) {
      displayMessage = 'Could not access the website content. The URLs may be behind authentication, blocked by firewall, or temporarily unavailable. Please verify the URLs are publicly accessible.';
      duration = 12000;
    } else if (errorMessage.includes('timeout')) {
      displayMessage = 'The analysis request timed out. Please try again with fewer URLs or verify the URLs are responding quickly.';
      duration = 10000;
    }
    
    return { message: displayMessage, duration };
  }

  static getSuccessMessage(parsedData: any, features: any[], useCases: any[], differentiators: any[]): string {
    const extractedItems = [];
    if (parsedData.companySummary) extractedItems.push('company overview');
    if (features.length > 0) extractedItems.push(`${features.length} features`);
    if (useCases.length > 0) extractedItems.push(`${useCases.length} use cases`);
    if (differentiators.length > 0) extractedItems.push(`${differentiators.length} differentiators`);
    
    return extractedItems.length > 0 
      ? `Successfully extracted ${extractedItems.join(', ')} from the actual website content.`
      : "Analysis completed using real website content. Product context has been populated with available information.";
  }
}
