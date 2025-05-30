
import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";
import { Author } from '@/types/storytelling';

interface AuthorSelectorProps {
  selectedAuthor: string;
  authors: Author[];
  onAuthorChange: (value: string) => void;
}

const AuthorSelector: FC<AuthorSelectorProps> = ({
  selectedAuthor,
  authors,
  onAuthorChange
}) => {
  console.log('👤 AuthorSelector - Props received:', {
    selectedAuthor,
    authorsCount: authors.length,
    authorsValidation: authors.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      organization: a.organization,
      clientId: a.clientId,
      isValid: !!(a.id && a.id.trim() !== '' && a.name && a.name.trim() !== '')
    }))
  });

  // Validate authors - ensure they have valid ID and name
  const validAuthors = authors.filter(author => {
    const hasValidId = author && author.id && typeof author.id === 'string' && author.id.trim() !== '';
    const hasValidName = author && author.name && typeof author.name === 'string' && author.name.trim() !== '';
    const isValid = hasValidId && hasValidName;
    
    console.log('👤 Author validation in AuthorSelector:', {
      authorId: author?.id,
      authorName: author?.name,
      authorRole: author?.role,
      authorClientId: author?.clientId,
      hasValidId,
      hasValidName,
      isValid
    });
    
    return isValid;
  });

  console.log('👤 Final valid authors in AuthorSelector:', {
    originalCount: authors.length,
    validCount: validAuthors.length,
    validAuthors: validAuthors.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      clientId: a.clientId
    }))
  });

  return (
    <div>
      <div className="flex items-center">
        <label className="text-sm font-medium">Author *</label>
        <User className="ml-2 h-4 w-4 text-gray-400" />
      </div>
      <Select value={selectedAuthor} onValueChange={onAuthorChange}>
        <SelectTrigger className="mt-2">
          <SelectValue placeholder="Select author" />
        </SelectTrigger>
        <SelectContent className="bg-white z-50">
          {validAuthors.length === 0 ? (
            <SelectItem value="no-authors" disabled>
              {authors.length === 0 
                ? "No authors found for this client - please create an author first"
                : `No valid authors found for this client (${authors.length} authors have validation issues)`
              }
            </SelectItem>
          ) : (
            validAuthors.map(author => (
              <SelectItem key={author.id} value={author.id}>
                {author.name} - {author.role}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuthorSelector;
