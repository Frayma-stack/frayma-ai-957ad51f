
import { Author } from '@/types/storytelling';
import { useAuthorValidation } from './useAuthorValidation';

export const useAuthorFormValidation = (clearPersistedData: () => void) => {
  const { validateAndCleanAuthor } = useAuthorValidation();

  const validateAndCleanCurrentAuthor = (currentAuthor: Author) => {
    console.log('🔧 Starting author validation...', {
      authorId: currentAuthor.id,
      authorName: currentAuthor.name,
      hasRole: !!currentAuthor.role,
      hasOrganization: !!currentAuthor.organization,
      hasBackstory: !!currentAuthor.backstory,
      clientId: currentAuthor.clientId,
      hasClientAssignment: !!currentAuthor.clientId
    });
    
    try {
      const validatedAuthor = validateAndCleanAuthor(currentAuthor);
      
      console.log('🔧 Validation result:', {
        isValid: !!validatedAuthor,
        validatedName: validatedAuthor?.name,
        validatedId: validatedAuthor?.id,
        validatedClientId: validatedAuthor?.clientId
      });
      
      if (validatedAuthor) {
        console.log('🔧 Author validation successful, clearing persisted data');
        clearPersistedData();
        console.log('🔧 Persisted data cleared');
      } else {
        console.error('🔧 Author validation failed - returned null');
      }
      
      return validatedAuthor;
    } catch (error) {
      console.error('🔧 Error in validateAndCleanCurrentAuthor:', error);
      console.error('🔧 Error stack:', error instanceof Error ? error.stack : 'No stack available');
      return null;
    }
  };

  return {
    validateAndCleanCurrentAuthor
  };
};
