
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';
import { validateAndCleanAuthor } from '@/utils/authorFormUtils';

export const useAuthorValidation = () => {
  const validateAndCleanCurrentAuthor = (author: Author) => {
    console.log('useAuthorValidation - validating author:', {
      name: author.name,
      hasRole: !!author.role,
      hasOrganization: !!author.organization
    });
    
    if (!author.name.trim()) {
      console.error('Validation failed: Author name is required');
      toast.error('Author name is required');
      return null;
    }

    try {
      const cleanedAuthor = validateAndCleanAuthor(author);
      if (!cleanedAuthor) {
        console.error('Validation failed: validateAndCleanAuthor returned null');
        toast.error('Failed to validate author data');
        return null;
      }

      console.log('Author validation successful:', cleanedAuthor.name);
      return cleanedAuthor;
    } catch (error) {
      console.error('Validation error:', error);
      toast.error('Failed to validate author data');
      return null;
    }
  };

  return {
    validateAndCleanAuthor: validateAndCleanCurrentAuthor
  };
};
