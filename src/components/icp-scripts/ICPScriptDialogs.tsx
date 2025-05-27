
import { FC } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ICPStoryScript, Client } from '@/types/storytelling';
import ICPStoryScriptForm from '../ICPStoryScriptForm';

interface ICPScriptDialogsProps {
  isAddDialogOpen: boolean;
  isEditDialogOpen: boolean;
  selectedScript: ICPStoryScript | null;
  clientInfo: Client | null;
  selectedClientId?: string;
  onAddDialogChange: (open: boolean) => void;
  onEditDialogChange: (open: boolean) => void;
  onAddScript: (script: ICPStoryScript) => void;
  onEditScript: (script: ICPStoryScript) => void;
}

const ICPScriptDialogs: FC<ICPScriptDialogsProps> = ({
  isAddDialogOpen,
  isEditDialogOpen,
  selectedScript,
  clientInfo,
  selectedClientId,
  onAddDialogChange,
  onEditDialogChange,
  onAddScript,
  onEditScript,
}) => {
  return (
    <>
      {/* Add Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={onAddDialogChange}>
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
            onSave={onAddScript} 
            selectedClientId={selectedClientId}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={onEditDialogChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit ICP StoryScript</DialogTitle>
            <DialogDescription>
              Update the details for this ICP StoryScript.
            </DialogDescription>
          </DialogHeader>
          {selectedScript && (
            <ICPStoryScriptForm 
              onSave={onEditScript} 
              initialScript={selectedScript}
              selectedClientId={selectedClientId}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ICPScriptDialogs;
