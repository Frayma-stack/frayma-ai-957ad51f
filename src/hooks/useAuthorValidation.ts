
import { Author } from '@/types/storytelling';
import { toast } from 'sonner';
import { validateAndCleanAuthor } from '@/utils/authorFormUtils';

export const useAuthorValidation = () => {
  const validateAndCleanCurrentAuthor = (author: Author) => {
    console.log('Validating author:', author);
    
    if (!author.name.trim()) {
      toast.error('Author name is required');
      return null;
    }

    const cleanedAuthor = validateAndCleanAuthor(author);
    if (!cleanedAuthor) {
      toast.error('Failed to validate author data');
      return null;
    }

    console.log('Author validation successful:', cleanedAuthor);
    return cleanedAuthor;
  };

  return {
    validateAndCleanAuthor: validateAndCleanCurrentAuthor
  };
};
