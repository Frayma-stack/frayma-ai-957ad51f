
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return "Network error: Unable to connect to the analysis service. Please check your internet connection and try again.";
  } else if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred while analyzing the profile.";
};

export const getApiErrorMessage = (status: number): string => {
  if (status === 401) {
    return "Authentication failed. Please check your API configuration.";
  } else if (status === 429) {
    return "Rate limit exceeded. Please try again in a few minutes.";
  } else if (status === 403) {
    return "Access forbidden. Please check your API permissions.";
  } else if (status >= 500) {
    return "Server error. Please try again later.";
  }
  return "An error occurred while analyzing the profile.";
};
