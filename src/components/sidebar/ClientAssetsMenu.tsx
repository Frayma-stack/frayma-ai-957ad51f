
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { User, Target, Trophy, Package, Lightbulb } from 'lucide-react';
import { Client } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface ClientAssetsMenuProps {
  client: Client;
  ideas: GeneratedIdea[];
  onAssetClick: (clientId: string, assetType: string) => void;
}

const ClientAssetsMenu: FC<ClientAssetsMenuProps> = ({ 
  client, 
  ideas, 
  onAssetClick 
}) => {
  const clientIdeas = ideas.filter(idea => idea.clientId === client.id);

  return (
    <div className="ml-6 space-y-1 border-l border-gray-200 pl-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => onAssetClick(client.id, 'authors')}
      >
        <User className="h-3 w-3 mr-2 text-brand-primary" />
        Authors
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => onAssetClick(client.id, 'icps')}
      >
        <Target className="h-3 w-3 mr-2 text-brand-primary" />
        ICPs
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => onAssetClick(client.id, 'successStories')}
      >
        <Trophy className="h-3 w-3 mr-2 text-brand-primary" />
        Success Stories
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => onAssetClick(client.id, 'productContext')}
      >
        <Package className="h-3 w-3 mr-2 text-brand-primary" />
        Product Context
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => onAssetClick(client.id, 'ideas')}
      >
        <Lightbulb className="h-3 w-3 mr-2 text-brand-primary" />
        Ideas Bank
        {clientIdeas.length > 0 && (
          <span className="ml-auto bg-gray-100 text-xs rounded-full px-1.5 py-0.5">
            {clientIdeas.length}
          </span>
        )}
      </Button>
    </div>
  );
};

export default ClientAssetsMenu;
