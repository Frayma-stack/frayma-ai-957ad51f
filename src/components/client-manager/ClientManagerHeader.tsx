
import { FC } from 'react';
import { 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from 'lucide-react';

interface ClientManagerHeaderProps {
  onAddClient: () => void;
}

const ClientManagerHeader: FC<ClientManagerHeaderProps> = ({ onAddClient }) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="text-brand-primary">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2" />
            Account Manager
          </div>
        </CardTitle>
        <Button 
          className="bg-brand-primary hover:bg-brand-primary/90" 
          onClick={onAddClient}
        >
          <Plus className="h-4 w-4 mr-2" /> Add Account
        </Button>
      </div>
    </CardHeader>
  );
};

export default ClientManagerHeader;
