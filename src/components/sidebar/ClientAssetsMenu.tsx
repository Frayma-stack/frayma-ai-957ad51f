
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { User, Target, Trophy, Package, Lightbulb, FileText } from 'lucide-react';
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

  const handleAssetClick = (assetType: string) => {
    console.log('🎯 ClientAssetsMenu: Asset clicked:', { clientId: client.id, assetType });
    onAssetClick(client.id, assetType);
  };

  return (
    <div className="ml-6 space-y-1 border-l border-gray-200 pl-2">
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('authors')}
      >
        <User className="h-3 w-3 mr-2 text-brand-primary" />
        Authors
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('icp-scripts')}
      >
        <Target className="h-3 w-3 mr-2 text-brand-primary" />
        ICP Scripts
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('success-stories')}
      >
        <Trophy className="h-3 w-3 mr-2 text-brand-primary" />
        Success Stories
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('product-context')}
      >
        <Package className="h-3 w-3 mr-2 text-brand-primary" />
        Product Context
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('drafts')}
      >
        <FileText className="h-3 w-3 mr-2 text-brand-primary" />
        Drafts
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full justify-start text-xs font-normal py-1 h-auto"
        onClick={() => handleAssetClick('ideas')}
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
