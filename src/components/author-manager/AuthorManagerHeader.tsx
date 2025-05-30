
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Users } from 'lucide-react';
import { Client } from '@/types/storytelling';

interface AuthorManagerHeaderProps {
  clientInfo: Client | null;
  showForm: boolean;
  onAddAuthor: () => void;
}

const AuthorManagerHeader: FC<AuthorManagerHeaderProps> = ({
  clientInfo,
  showForm,
  onAddAuthor
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-story-blue">Authors</h2>
        {clientInfo && (
          <p className="text-sm flex items-center text-gray-600">
            <Users className="h-3.5 w-3.5 mr-1" />
            For client: {clientInfo.name}
          </p>
        )}
      </div>
      {!showForm && (
        <Button 
          className="bg-story-blue hover:bg-story-light-blue"
          onClick={onAddAuthor}
        >
          <Plus className="h-4 w-4 mr-2" /> Add New Author
        </Button>
      )}
    </div>
  );
};

export default AuthorManagerHeader;
