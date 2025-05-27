
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from 'lucide-react';
import { ICPStoryScript, Client } from '@/types/storytelling';
import { useToast } from '@/components/ui/use-toast';
import ICPScriptCard from './icp-scripts/ICPScriptCard';
import ICPScriptEmptyState from './icp-scripts/ICPScriptEmptyState';
import ICPScriptDialogs from './icp-scripts/ICPScriptDialogs';

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
        <ICPScriptDialogs
          isAddDialogOpen={isAddDialogOpen}
          isEditDialogOpen={isEditDialogOpen}
          selectedScript={selectedScript}
          clientInfo={clientInfo}
          selectedClientId={selectedClientId}
          onAddDialogChange={setIsAddDialogOpen}
          onEditDialogChange={setIsEditDialogOpen}
          onAddScript={handleAddScript}
          onEditScript={handleEditScript}
        />
      </CardHeader>
      <CardContent>
        {scripts.length === 0 ? (
          <ICPScriptEmptyState clientInfo={clientInfo} />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {scripts.map((script) => (
              <ICPScriptCard
                key={script.id}
                script={script}
                onEdit={openEditDialog}
                onDelete={handleDeleteScript}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ICPStoryScriptManager;
