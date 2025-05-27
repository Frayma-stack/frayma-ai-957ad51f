
import { FC } from 'react';
import { FileText } from 'lucide-react';
import { Client } from '@/types/storytelling';

interface ICPScriptEmptyStateProps {
  clientInfo: Client | null;
}

const ICPScriptEmptyState: FC<ICPScriptEmptyStateProps> = ({ clientInfo }) => {
  return (
    <div className="text-center py-8 text-gray-500">
      <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
      <p>No ICP StoryScripts yet</p>
      <p className="text-sm mt-1">
        {clientInfo 
          ? `Create your first ICP StoryScript for ${clientInfo.name}` 
          : 'Create your first ICP StoryScript to get started'}
      </p>
    </div>
  );
};

export default ICPScriptEmptyState;
