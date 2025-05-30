
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
  console.log('👤 AuthorSelector - Detailed analysis:', {
    selectedAuthor,
    authorsReceived: authors.length,
    authorsDetailed: authors.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      organization: a.organization,
      clientId: a.clientId,
      hasValidId: Boolean(a.id && a.id.trim()),
      hasValidName: Boolean(a.name && a.name.trim())
    }))
  });

  // Simplified validation - just check for basic required fields
  const validAuthors = authors.filter(author => {
    const isValid = Boolean(
      author && 
      author.id && 
      author.id.trim() !== '' && 
      author.name && 
      author.name.trim() !== ''
    );
    
    if (!isValid) {
      console.log('👤 AuthorSelector - Invalid author filtered out:', {
        authorId: author?.id,
        authorName: author?.name,
        reason: !author ? 'null_author' : 
                !author.id ? 'missing_id' : 
                author.id.trim() === '' ? 'empty_id' : 
                !author.name ? 'missing_name' : 
                author.name.trim() === '' ? 'empty_name' : 'unknown'
      });
    }
    
    return isValid;
  });

  console.log('👤 AuthorSelector - Final valid authors:', {
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
                : `No valid authors found (${authors.length} authors have validation issues)`
              }
            </SelectItem>
          ) : (
            validAuthors.map(author => (
              <SelectItem key={author.id} value={author.id}>
                {author.name} {author.role ? `- ${author.role}` : ''}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AuthorSelector;
