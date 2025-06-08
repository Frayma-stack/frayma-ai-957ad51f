
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Pencil, Trash, Eye } from 'lucide-react';
import { ICPStoryScript, StoryBrief, ArticleSubType } from '@/types/storytelling';
import StoryBriefForm from './StoryBriefForm';
import { useToast } from '@/components/ui/use-toast';

interface StoryBriefManagerProps {
  briefs: StoryBrief[];
  scripts: ICPStoryScript[];
  onBriefAdded: (brief: StoryBrief) => void;
  onBriefUpdated: (brief: StoryBrief) => void;
  onBriefDeleted: (briefId: string) => void;
  onBriefSelected: (brief: StoryBrief) => void;
  articleSubType?: ArticleSubType | null;
}

const StoryBriefManager: FC<StoryBriefManagerProps> = ({ 
  briefs, 
  scripts,
  onBriefAdded, 
  onBriefUpdated, 
  onBriefDeleted,
  onBriefSelected,
  articleSubType
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedBrief, setSelectedBrief] = useState<StoryBrief | null>(null);

  // Map article subtypes to readable titles
  const getSubtypeTitle = () => {
    switch (articleSubType) {
      case 'newsletter': return 'First-Person Narrative Newsletter';
      case 'thought_leadership': return 'GTM Thought Leadership Article';
      default: return 'Story Brief & Outline';
    }
  };

  const handleAddBrief = (brief: StoryBrief) => {
    // Set the content type from articleSubType if provided
    const briefWithType = articleSubType 
      ? { ...brief, contentType: articleSubType } 
      : brief;
      
    onBriefAdded(briefWithType);
    setIsAddDialogOpen(false);
  };

  const handleEditBrief = (brief: StoryBrief) => {
    onBriefUpdated(brief);
    setIsEditDialogOpen(false);
    setSelectedBrief(null);
  };

  const handleDeleteBrief = (brief: StoryBrief) => {
    if (confirm(`Are you sure you want to delete the "${brief.title}" Story Brief?`)) {
      onBriefDeleted(brief.id);
      toast({
        title: "Story Brief deleted",
        description: `"${brief.title}" has been removed.`,
      });
    }
  };

  const openEditDialog = (brief: StoryBrief) => {
    setSelectedBrief(brief);
    setIsEditDialogOpen(true);
  };

  const getICPName = (scriptId: string) => {
    const script = scripts.find(s => s.id === scriptId);
    return script ? script.name : 'Unknown';
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-story-blue">Your {getSubtypeTitle()}</CardTitle>
          <CardDescription>Create and manage your content frameworks</CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              className="bg-story-blue hover:bg-story-light-blue"
              disabled={scripts.length === 0}
            >
              <Plus className="h-4 w-4 mr-2" /> Create New {articleSubType ? getSubtypeTitle() : 'Brief'}
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create a new {getSubtypeTitle()}</DialogTitle>
              <DialogDescription>
                Define the strategic framework for your content.
              </DialogDescription>
            </DialogHeader>
            <StoryBriefForm 
              onSave={handleAddBrief} 
              availableScripts={scripts}
              articleSubType={articleSubType}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {scripts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>You need to create ICP StoryScripts first</p>
            <p className="text-sm mt-1">Create at least one ICP StoryScript before creating a Story Brief</p>
          </div>
        ) : briefs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>No {getSubtypeTitle()} yet</p>
            <p className="text-sm mt-1">Create your first {articleSubType ? getSubtypeTitle() : 'Story Brief'} to start crafting your narratives</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {briefs.map((brief) => (
              <Card key={brief.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{brief.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => onBriefSelected(brief)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => openEditDialog(brief)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteBrief(brief)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">Target Audience:</span>
                      <p className="text-gray-700">{getICPName(brief.targetAudience)}</p>
                    </div>
                    {brief.goal && (
                      <div>
                        <span className="font-semibold">Goal:</span>
                        <p className="text-gray-700 line-clamp-2">{brief.goal}</p>
                      </div>
                    )}
                    {brief.targetKeyword && (
                      <div>
                        <span className="font-semibold">Target Keyword:</span>
                        <p className="text-gray-700 line-clamp-1">{brief.targetKeyword}</p>
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
              <DialogTitle>Edit {getSubtypeTitle()}</DialogTitle>
              <DialogDescription>
                Update the details for this content.
              </DialogDescription>
            </DialogHeader>
            {selectedBrief && (
              <StoryBriefForm 
                onSave={handleEditBrief} 
                initialBrief={selectedBrief} 
                availableScripts={scripts}
                articleSubType={articleSubType}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default StoryBriefManager;
