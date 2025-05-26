
import { useToast } from "@/components/ui/use-toast";
import { Author } from '@/types/storytelling';
import { validateAndCleanAuthor } from '@/utils/authorFormUtils';

export const useAuthorValidation = () => {
  const { toast } = useToast();

  const validateAndCleanAuthorData = (author: Author) => {
    // Basic validation
    if (!author.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this author.",
        variant: "destructive"
      });
      return null;
    }
    
    return validateAndCleanAuthor(author);
  };

  return {
    validateAndCleanAuthor: validateAndCleanAuthorData
  };
};
