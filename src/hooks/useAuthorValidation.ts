
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';
import { validateAndCleanAuthor as utilsValidateAndCleanAuthor } from '@/utils/authorFormUtils';

export const useAuthorValidation = () => {
  const validateAndCleanCurrentAuthor = (author: Author) => {
    console.log('⚙️ useAuthorValidation - validating author:', {
      name: author?.name || 'undefined',
      id: author?.id || 'undefined',
      hasRole: !!author?.role,
      hasOrganization: !!author?.organization
    });
    
    if (!author) {
      console.error('⚙️ Validation failed: Author object is null or undefined');
      toast.error('Author data is invalid');
      return null;
    }
    
    if (!author.name?.trim()) {
      console.error('⚙️ Validation failed: Author name is required');
      toast.error('Author name is required');
      return null;
    }

    try {
      console.log('⚙️ Calling utils.validateAndCleanAuthor...');
      const cleanedAuthor = utilsValidateAndCleanAuthor(author);
      
      if (!cleanedAuthor) {
        console.error('⚙️ Validation failed: validateAndCleanAuthor returned null');
        toast.error('Failed to validate author data');
        return null;
      }

      console.log('⚙️ Author validation successful:', {
        id: cleanedAuthor.id,
        name: cleanedAuthor.name,
        role: cleanedAuthor.role,
        organization: cleanedAuthor.organization
      });
      
      return cleanedAuthor;
    } catch (error) {
      console.error('⚙️ Validation error:', error);
      console.error('⚙️ Error stack:', error instanceof Error ? error.stack : 'No stack available');
      toast.error('Failed to validate author data');
      return null;
    }
  };

  return {
    validateAndCleanAuthor: validateAndCleanCurrentAuthor
  };
};
