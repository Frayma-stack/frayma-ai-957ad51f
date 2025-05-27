
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Pencil, Trash, Users } from 'lucide-react';
import { ICPStoryScript, Client } from '@/types/storytelling';
import ICPStoryScriptForm from './ICPStoryScriptForm';
import { useToast } from '@/components/ui/use-toast';

interface ICPStoryScriptManagerProps {
  scripts: ICPStoryScript[];
  onScriptAdded: (script: ICPStoryScript) => void;
  onScriptUpdated: (script: ICPStoryScript) => void;
  onScriptDeleted: (scriptId: string) => void;
  selectedClientId?: string;
}

const ICPStoryScriptManager: FC<ICPStoryScriptManagerProps> = ({ 
  scripts, 
  onScriptAdded, 
  onScriptUpdated, 
  onScriptDeleted,
  selectedClientId
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ICPStoryScript | null>(null);

  // Get current client info if we're in a client-specific view
  const getClientInfo = () => {
    if (selectedClientId) {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients) as Client[];
        return clients.find(client => client.id === selectedClientId);
      }
    }
    return null;
  };
  
  const clientInfo = getClientInfo();

  const handleAddScript = (script: ICPStoryScript) => {
    // Ensure the script is associated with the selected client
    const scriptWithClient = {
      ...script,
      clientId: selectedClientId
    };
    onScriptAdded(scriptWithClient);
    setIsAddDialogOpen(false);
    toast({
      title: "ICP StoryScript created",
      description: `"${script.name}" has been added successfully${clientInfo ? ` for ${clientInfo.name}` : ''}.`
    });
  };

  const handleEditScript = (script: ICPStoryScript) => {
    // Ensure the script maintains its client association
    const scriptWithClient = {
      ...script,
      clientId: script.clientId || selectedClientId
    };
    onScriptUpdated(scriptWithClient);
    setIsEditDialogOpen(false);
    setSelectedScript(null);
    toast({
      title: "ICP StoryScript updated",
      description: `"${script.name}" has been updated successfully.`
    });
  };

  const handleDeleteScript = (script: ICPStoryScript) => {
    if (confirm(`Are you sure you want to delete the "${script.name}" ICP StoryScript?`)) {
      onScriptDeleted(script.id);
      toast({
        title: "ICP StoryScript deleted",
        description: `"${script.name}" has been removed.`,
      });
    }
  };

  const openEditDialog = (script: ICPStoryScript) => {
    setSelectedScript(script);
    setIsEditDialogOpen(true);
  };

  // Helper function to join array of items into a string
  const formatItemsList = (items: { id: string; content: string }[]): string => {
    return items
      .filter(item => item.content.trim() !== '')
      .map(item => item.content)
      .join(', ');
  };

  // Don't show the component if no client is selected
  if (!selectedClientId) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 opacity-30 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
          <p className="text-gray-500">
            Please select a client from the sidebar to view and manage their ICP StoryScripts.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-story-blue">ICP StoryScripts</CardTitle>
          <CardDescription>
            Define your target audience personas
            {clientInfo && (
              <span className="ml-2 bg-story-blue/10 px-2 py-0.5 rounded-full text-xs text-story-blue">
                <Users className="inline h-3 w-3 mr-1" />
                For: {clientInfo.name}
              </span>
            )}
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-story-blue hover:bg-story-light-blue">
              <Plus className="h-4 w-4 mr-2" /> Add New ICP
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new ICP StoryScript</DialogTitle>
              <DialogDescription>
                Define who you're writing for, their pains, struggles, and desired transformations.
                {clientInfo && (
                  <span className="block mt-1 text-story-blue font-medium">
                    Creating for: {clientInfo.name}
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>
            <ICPStoryScriptForm 
              onSave={handleAddScript} 
              selectedClientId={selectedClientId}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {scripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>No ICP StoryScripts yet</p>
            <p className="text-sm mt-1">
              {clientInfo 
                ? `Create your first ICP StoryScript for ${clientInfo.name}` 
                : 'Create your first ICP StoryScript to get started'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scripts.map((script) => (
              <Card key={script.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{script.name}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(script)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteScript(script)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    {script.internalPains && script.internalPains.length > 0 && (
                      <div>
                        <span className="font-semibold">Internal Pains:</span>
                        <p className="text-gray-700 line-clamp-2">{formatItemsList(script.internalPains)}</p>
                      </div>
                    )}
                    {script.externalStruggles && script.externalStruggles.length > 0 && (
                      <div>
                        <span className="font-semibold">External Struggles:</span>
                        <p className="text-gray-700 line-clamp-2">{formatItemsList(script.externalStruggles)}</p>
                      </div>
                    )}
                    {script.desiredTransformations && script.desiredTransformations.length > 0 && (
                      <div>
                        <span className="font-semibold">Desired Transformations:</span>
                        <p className="text-gray-700 line-clamp-2">{formatItemsList(script.desiredTransformations)}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit ICP StoryScript</DialogTitle>
              <DialogDescription>
                Update the details for this ICP StoryScript.
              </DialogDescription>
            </DialogHeader>
            {selectedScript && (
              <ICPStoryScriptForm 
                onSave={handleEditScript} 
                initialScript={selectedScript}
                selectedClientId={selectedClientId}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ICPStoryScriptManager;
