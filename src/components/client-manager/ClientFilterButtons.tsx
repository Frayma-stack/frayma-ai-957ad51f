
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Client } from '@/types/storytelling';

interface ClientFilterButtonsProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientSelected: (clientId: string | null) => void;
}

const ClientFilterButtons: FC<ClientFilterButtonsProps> = ({
  clients,
  selectedClientId,
  onClientSelected,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <Button 
        variant={selectedClientId === null ? "default" : "outline"} 
        onClick={() => onClientSelected(null)}
        className={selectedClientId === null ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
      >
        All Clients
      </Button>
      {clients.map(client => (
        <Button 
          key={client.id} 
          variant={selectedClientId === client.id ? "default" : "outline"}
          onClick={() => onClientSelected(client.id)}
          className={selectedClientId === client.id ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
        >
          {client.name}
        </Button>
      ))}
    </div>
  );
};

export default ClientFilterButtons;
