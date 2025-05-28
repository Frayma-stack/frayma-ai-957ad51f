
export const getErrorMessage = (error: any): string => {
  console.error('Processing error:', error);
  
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  
  // Handle specific analysis errors
  if (errorMessage.includes('JSON')) {
    return 'The analysis service returned data in an unexpected format. This may happen with complex profiles. Please try again or add information manually.';
  }
  
  if (errorMessage.includes('access') || errorMessage.includes('fetch')) {
    return 'Unable to access the provided URLs. Please check that the URLs are publicly accessible and try again.';
  }
  
  if (errorMessage.includes('timeout')) {
    return 'The analysis request timed out. This may happen with very large profiles. Please try with fewer URLs or try again.';
  }
  
  if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
    return 'The analysis service is currently busy. Please wait a moment and try again.';
  }
  
  if (errorMessage.includes('authentication') || errorMessage.includes('401')) {
    return 'Authentication issue with the analysis service. Please contact support.';
  }
  
  if (errorMessage.includes('scraping') || errorMessage.includes('scrape')) {
    return 'Unable to extract content from the provided URLs. Please verify the URLs are accessible and contain the expected content.';
  }
  
  // Handle network errors
  if (errorMessage.includes('network') || errorMessage.includes('NETWORK_ERROR')) {
    return 'Network connection issue. Please check your internet connection and try again.';
  }
  
  // Handle service unavailable
  if (errorMessage.includes('service') || errorMessage.includes('unavailable')) {
    return 'The analysis service is temporarily unavailable. Please try again in a few minutes.';
  }
  
  // Generic fallback with more specific guidance
  return `Analysis failed: ${errorMessage}. Please verify your URLs are accessible and try again, or add author information manually.`;
};
