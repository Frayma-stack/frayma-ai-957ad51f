
import { Author } from '@/types/storytelling';
import { useAuthorValidation } from './useAuthorValidation';

export const useAuthorFormValidation = (currentAuthor: Author) => {
  const { validateAndCleanAuthor: validateAndCleanAuthorData } = useAuthorValidation();

  const validateAndCleanAuthor = () => {
    return validateAndCleanAuthorData(currentAuthor);
  };

  return { validateAndCleanAuthor };
};
