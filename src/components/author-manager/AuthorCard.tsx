
import { FC } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Author } from '@/types/storytelling';
import { Edit, Trash } from 'lucide-react';

interface AuthorCardProps {
  author: Author;
  onEdit: (author: Author) => void;
  onDelete: (authorId: string) => void;
}

const AuthorCard: FC<AuthorCardProps> = ({ 
  author, 
  onEdit, 
  onDelete 
}) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{author.name}</span>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(author)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(author.id)}>
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>
          {author.role} at {author.organization}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm">
        <div className="space-y-2">
          <p className="line-clamp-3">{author.backstory}</p>
          {author.tones.length > 0 && (
            <div>
              <p className="font-medium">Writing Tones:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {author.tones.map(tone => (
                  <span key={tone.id} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                    {tone.tone}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorCard;
