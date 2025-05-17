
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent,
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent,
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Client } from '@/types/storytelling';
import { Plus, Edit, Trash, Users } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface ClientManagerProps {
  clients: Client[];
  selectedClientId: string | null;
  onClientAdded: (client: Client) => void;
  onClientUpdated: (client: Client) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
}

const ClientManager: FC<ClientManagerProps> = ({
  clients,
  selectedClientId,
  onClientAdded,
  onClientUpdated,
  onClientDeleted,
  onClientSelected
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditingClient(null);
  };

  const handleOpenDialog = (client?: Client) => {
    if (client) {
      setEditingClient(client);
      setName(client.name);
      setDescription(client.description || '');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    resetForm();
    setIsDialogOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    if (editingClient) {
      onClientUpdated(clientData);
      toast({
        title: "Success",
        description: "Client updated successfully"
      });
    } else {
      onClientAdded(clientData);
      toast({
        title: "Success",
        description: "Client added successfully"
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

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-story-blue">
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Client Manager
              </div>
            </CardTitle>
            <DialogTrigger asChild onClick={() => handleOpenDialog()}>
              <Button className="bg-story-blue hover:bg-story-light-blue">
                <Plus className="h-4 w-4 mr-2" /> Add Client
              </Button>
            </DialogTrigger>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button 
              variant={selectedClientId === null ? "default" : "outline"} 
              onClick={() => handleSelectClient(null)}
              className={selectedClientId === null ? "bg-story-blue hover:bg-story-light-blue" : ""}
            >
              All Clients
            </Button>
            {clients.map(client => (
              <Button 
                key={client.id} 
                variant={selectedClientId === client.id ? "default" : "outline"}
                onClick={() => handleSelectClient(client.id)}
                className={selectedClientId === client.id ? "bg-story-blue hover:bg-story-light-blue" : ""}
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
                      <p className="text-gray-600 text-sm">{client.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(client.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSelectClient(client.id)}
                    >
                      View Assets
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed rounded-md">
              <Users className="h-10 w-10 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No clients added yet</p>
              <p className="text-gray-400 text-sm">Add your first client to organize your assets</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Client Name*</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter client name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the client"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit" className="bg-story-blue hover:bg-story-light-blue">
                {editingClient ? 'Update' : 'Add'} Client
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientManager;
