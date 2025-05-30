
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Users, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Client } from '@/types/storytelling';

interface AuthorManagerHeaderProps {
  clientInfo: Client | null;
  showForm: boolean;
  selectedClientId?: string | null;
  onAddAuthor: () => void;
}

const AuthorManagerHeader: FC<AuthorManagerHeaderProps> = ({
  clientInfo,
  showForm,
  selectedClientId,
  onAddAuthor
}) => {
  const canAddAuthor = !!selectedClientId;

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-story-blue" />
          <CardTitle className="text-xl font-bold text-story-blue">
            Authors
            {clientInfo && (
              <span className="text-sm font-normal text-gray-600 ml-2">
                for {clientInfo.name}
              </span>
            )}
          </CardTitle>
        </div>
        
        {!showForm && (
          <Button
            onClick={onAddAuthor}
            disabled={!canAddAuthor}
            className="bg-story-blue hover:bg-story-light-blue"
            title={!canAddAuthor ? "Please select a client first to add authors" : "Add new author"}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Author
          </Button>
        )}
      </CardHeader>

      {!selectedClientId && (
        <div className="px-6 pb-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Client Selection Required:</strong> Please select a client from the sidebar to view and manage client-specific authors. Authors are now exclusively tied to clients.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
};

export default AuthorManagerHeader;
