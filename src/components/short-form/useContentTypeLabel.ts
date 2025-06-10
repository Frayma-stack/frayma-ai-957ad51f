
import { useCallback } from 'react';
import { ContentType } from './types';

export const useContentTypeLabel = (contentType: ContentType) => {
  const getContentTypeLabel = useCallback(() => {
    switch (contentType) {
      case 'linkedin':
        return 'LinkedIn Post';
      case 'email':
        return 'Email Sequence';
      case 'custom':
      default:
        return 'Custom Content';
    }
  }, [contentType]);

  return { getContentTypeLabel };
};
