
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Pencil, Trash } from 'lucide-react';
import { ICPStoryScript } from '@/types/storytelling';
import ICPStoryScriptForm from './ICPStoryScriptForm';
import { useToast } from '@/components/ui/use-toast';

interface ICPStoryScriptManagerProps {
  scripts: ICPStoryScript[];
  onScriptAdded: (script: ICPStoryScript) => void;
  onScriptUpdated: (script: ICPStoryScript) => void;
  onScriptDeleted: (scriptId: string) => void;
}

const ICPStoryScriptManager: FC<ICPStoryScriptManagerProps> = ({ 
  scripts, 
  onScriptAdded, 
  onScriptUpdated, 
  onScriptDeleted 
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<ICPStoryScript | null>(null);

  const handleAddScript = (script: ICPStoryScript) => {
    onScriptAdded(script);
    setIsAddDialogOpen(false);
  };

  const handleEditScript = (script: ICPStoryScript) => {
    onScriptUpdated(script);
    setIsEditDialogOpen(false);
    setSelectedScript(null);
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

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-story-blue">Your ICP StoryScripts</CardTitle>
          <CardDescription>Define your target audience personas</CardDescription>
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
              </DialogDescription>
            </DialogHeader>
            <ICPStoryScriptForm onSave={handleAddScript} />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {scripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>No ICP StoryScripts yet</p>
            <p className="text-sm mt-1">Create your first ICP StoryScript to get started</p>
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
                    {script.internalPains && (
                      <div>
                        <span className="font-semibold">Internal Pains:</span>
                        <p className="text-gray-700 line-clamp-2">{script.internalPains}</p>
                      </div>
                    )}
                    {script.externalStruggles && (
                      <div>
                        <span className="font-semibold">External Struggles:</span>
                        <p className="text-gray-700 line-clamp-2">{script.externalStruggles}</p>
                      </div>
                    )}
                    {script.desiredTransformations && (
                      <div>
                        <span className="font-semibold">Desired Transformations:</span>
                        <p className="text-gray-700 line-clamp-2">{script.desiredTransformations}</p>
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
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default ICPStoryScriptManager;
