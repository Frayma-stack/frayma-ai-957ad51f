
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Users, Plus } from 'lucide-react';

interface ClientManagerEmptyStateProps {
  onAddClient: () => void;
}

const ClientManagerEmptyState: FC<ClientManagerEmptyStateProps> = ({ onAddClient }) => {
  return (
    <div className="text-center py-8 border border-dashed rounded-md">
      <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-500">No accounts added yet</p>
      <p className="text-gray-400 text-sm">Add your first account with automated company analysis</p>
    </div>
  );
};

export default ClientManagerEmptyState;
