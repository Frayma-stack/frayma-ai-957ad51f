import { FC, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Client, ProductContext } from '@/types/storytelling';
import { Plus, Edit, Trash, Users, User, Target, Package, Trophy, Globe, Linkedin, FileText, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import EnhancedClientDialog from './EnhancedClientDialog';

interface ClientManagerProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onClientUpdated: (client: Client, productContext?: ProductContext) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
  onProductContextAdded?: (productContext: ProductContext) => void;
}

const ClientManager: FC<ClientManagerProps> = ({
  clients,
  selectedClientId,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onClientSelected,
  onViewClientAssets,
  onProductContextAdded
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  
  const { toast } = useToast();

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
    } else {
      setEditingClient(null);
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(false);
  };

  const handleClientCreated = (client: Client, productContext?: ProductContext) => {
    console.log('ClientManager: handleClientCreated called', { client, productContext });
    
    if (editingClient) {
      onClientUpdated(client, productContext);
    } else {
      onClientAdded(client, productContext);
    }
    
    // Add the product context if it was created during analysis
    if (productContext && onProductContextAdded) {
      console.log('ClientManager: Adding product context to app state', productContext);
      onProductContextAdded(productContext);
      
      toast({
        title: "Success",
        description: "Client and product context created successfully from analysis",
      });
    } else {
      toast({
        title: "Success",
        description: editingClient ? "Client updated successfully" : "Client created successfully"
      });
    }
    
    handleCloseDialog();
  };

  const handleDelete = (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This will NOT delete associated assets.')) {
      onClientDeleted(clientId);
      // If the deleted client was selected, reset to null or default
      if (selectedClientId === clientId) {
        onClientSelected(null);
      }
      toast({
        title: "Success",
        description: "Client deleted successfully"
      });
    }
  };

  const handleSelectClient = (clientId: string | null) => {
    onClientSelected(clientId);
    toast({
      description: clientId 
        ? `Now viewing assets for ${clients.find(c => c.id === clientId)?.name}` 
        : "Now viewing all assets"
    });
  };

  const handleViewClientAssets = (clientId: string, assetType: string) => {
    onViewClientAssets(clientId, assetType);
  };

  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return <Linkedin className="h-3.5 w-3.5" />;
      case 'website': return <Globe className="h-3.5 w-3.5" />;
      case 'about': return <FileText className="h-3.5 w-3.5" />;
      default: return <ExternalLink className="h-3.5 w-3.5" />;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-brand-primary">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Client Manager
              </div>
            </CardTitle>
            <Button 
              className="bg-brand-primary hover:bg-brand-primary/90" 
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4 mr-2" /> Add Client
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={selectedClientId === null ? "default" : "outline"} 
              onClick={() => handleSelectClient(null)}
              className={selectedClientId === null ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
            >
              All Clients
            </Button>
            {clients.map(client => (
              <Button 
                key={client.id} 
                variant={selectedClientId === client.id ? "default" : "outline"}
                onClick={() => handleSelectClient(client.id)}
                className={selectedClientId === client.id ? "bg-brand-primary hover:bg-brand-primary/90" : ""}
              >
                {client.name}
              </Button>
            ))}
          </div>

          {clients.length > 0 ? (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {clients.map(client => (
                <Card key={client.id} className="bg-white shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between text-base">
                      <span>{client.name}</span>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(client)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
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
                          onClick={() => handleViewClientAssets(client.id, 'authors')}
                        >
                          <User className="h-3.5 w-3.5 mr-1" />
                          Authors
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handleViewClientAssets(client.id, 'icps')}
                        >
                          <Target className="h-3.5 w-3.5 mr-1" />
                          ICPs
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handleViewClientAssets(client.id, 'successStories')}
                        >
                          <Trophy className="h-3.5 w-3.5 mr-1" />
                          Success Stories
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handleViewClientAssets(client.id, 'productContext')}
                        >
                          <Package className="h-3.5 w-3.5 mr-1" />
                          Product Context
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex items-center"
                          onClick={() => handleViewClientAssets(client.id, 'drafts')}
                        >
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          Drafts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSelectClient(client.id)}
                    >
                      Select Client
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No clients added yet</p>
              <p className="text-gray-400 text-sm">Add your first client with automated company analysis</p>
            </div>
          )}
        </CardContent>
      </Card>

      <EnhancedClientDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        onClientCreated={handleClientCreated}
        editingClient={editingClient}
      />
    </div>
  );
};

export default ClientManager;
