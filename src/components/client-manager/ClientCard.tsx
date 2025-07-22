
import { FC } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client } from '@/types/storytelling';
import { Edit, Trash, User, Target, Trophy, Package, Linkedin, Globe, FileText, ExternalLink, Settings } from 'lucide-react';

interface ClientCardProps {
  client: Client;
  selectedClientId: string | null;
  onEdit: (client: Client) => void;
  onDelete: (clientId: string) => void;
  onSelect: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
}

const ClientCard: FC<ClientCardProps> = ({
  client,
  selectedClientId,
  onEdit,
  onDelete,
  onSelect,
  onViewClientAssets,
}) => {
  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return <Linkedin className="h-3.5 w-3.5" />;
      case 'website': return <Globe className="h-3.5 w-3.5" />;
      case 'about': return <FileText className="h-3.5 w-3.5" />;
      default: return <ExternalLink className="h-3.5 w-3.5" />;
    }
  };

  const isSelected = selectedClientId === client.id;

  return (
    <Card className={`bg-white shadow-sm transition-all ${isSelected ? 'ring-2 ring-brand-primary' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between text-base">
          <span>{client.name}</span>
          <div className="flex space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(client)} title="Edit Client">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(client.id)} title="Delete Client">
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        {isSelected && (
          <div className="flex items-center text-xs text-brand-primary">
            <Settings className="h-3 w-3 mr-1" />
            Currently Selected
          </div>
        )}
      </CardHeader>
      <CardContent className="text-sm pt-0">
        {client.description && (
          <p className="text-gray-600 text-sm mb-2">{client.description}</p>
        )}

        {client.companyLinks && client.companyLinks.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Company Links:</p>
            <div className="flex flex-wrap gap-1">
              {client.companyLinks.map((link, index) => (
                <a 
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded text-gray-700"
                >
                  {getLinkTypeIcon(link.type)}
                  <span className="ml-1 capitalize">{link.type}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-gray-500 mb-3">
          Created: {new Date(client.createdAt).toLocaleDateString()}
        </p>
        
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Client Assets:</p>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => onViewClientAssets(client.id, 'authors')}
            >
              <User className="h-3.5 w-3.5 mr-1" />
              Authors
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => onViewClientAssets(client.id, 'icp-scripts')}
            >
              <Target className="h-3.5 w-3.5 mr-1" />
              ICPs
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => onViewClientAssets(client.id, 'success-stories')}
            >
              <Trophy className="h-3.5 w-3.5 mr-1" />
              Success Stories
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => onViewClientAssets(client.id, 'product-context')}
            >
              <Package className="h-3.5 w-3.5 mr-1" />
              Business Context
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center"
              onClick={() => onViewClientAssets(client.id, 'drafts')}
            >
              <FileText className="h-3.5 w-3.5 mr-1" />
              Drafts
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex gap-2">
        <Button 
          variant={isSelected ? "default" : "outline"}
          size="sm" 
          className="flex-1"
          onClick={() => onSelect(client.id)}
          disabled={isSelected}
        >
          {isSelected ? "Selected" : "Select Client"}
        </Button>
        {isSelected && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(client)}
            title="Edit this client"
          >
            <Settings className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ClientCard;
