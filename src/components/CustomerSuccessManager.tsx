
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { CustomerSuccessStory } from '@/types/storytelling';
import { useToast } from "@/hooks/use-toast";
import AddSuccessStoryDialog from './success-stories/AddSuccessStoryDialog';
import EditSuccessStoryDialog from './success-stories/EditSuccessStoryDialog';
import SuccessStoryList from './success-stories/SuccessStoryList';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface CustomerSuccessManagerProps {
  successStories: CustomerSuccessStory[];
  onSuccessStoryAdded: (successStory: CustomerSuccessStory) => void;
  onSuccessStoryUpdated: (successStory: CustomerSuccessStory) => void;
  onSuccessStoryDeleted: (successStoryId: string) => void;
}

const CustomerSuccessManager: FC<CustomerSuccessManagerProps> = ({
  successStories,
  onSuccessStoryAdded,
  onSuccessStoryUpdated,
  onSuccessStoryDeleted
}) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CustomerSuccessStory | null>(null);

  // This function handles the edit dialog opening
  const handleOpenEditDialog = (story: CustomerSuccessStory) => {
    setSelectedStory(story);
    setIsEditDialogOpen(true);
  };

  const handleDeleteStory = (story: CustomerSuccessStory) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      onSuccessStoryDeleted(story.id);
      toast({
        title: "Success Story Deleted",
        description: `"${story.title}" has been deleted`,
      });
    }
  };

  // Get the client name if we're in a client-specific view
  const getClientInfo = () => {
    const selectedClientId = successStories[0]?.clientId;
    
    if (selectedClientId) {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        return clients.find((client: any) => client.id === selectedClientId);
      }
    }
    return null;
  };
  
  const clientInfo = getClientInfo();

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-brand-primary font-sora">Customer Success Stories</CardTitle>
          <CardDescription>
            Add powerful social proof to craft resonant GTM narrative pieces
            {clientInfo && (
              <span className="ml-2 bg-brand-primary/10 px-2 py-0.5 rounded-full text-xs text-brand-primary">
                For client: {clientInfo.name}
              </span>
            )}
          </CardDescription>
        </div>
        <Button 
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Story
        </Button>
      </CardHeader>
      
      <CardContent>
        <SuccessStoryList 
          successStories={successStories}
          onEdit={handleOpenEditDialog}
          onDelete={handleDeleteStory}
        />
        
        {/* Add Dialog */}
        <AddSuccessStoryDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onSuccessStoryAdded={onSuccessStoryAdded}
          selectedClientId={clientInfo?.id}
        />
        
        {/* Edit Dialog */}
        <EditSuccessStoryDialog
          open={isEditDialogOpen}
          setOpen={setIsEditDialogOpen}
          story={selectedStory || {
            id: '',
            title: '',
            beforeSummary: '',
            afterSummary: '',
            quotes: [],
            features: [],
            createdAt: '',
          }}
          onUpdate={onSuccessStoryUpdated}
          onDelete={onSuccessStoryDeleted}
        />
      </CardContent>
    </Card>
  );
};

export default CustomerSuccessManager;
