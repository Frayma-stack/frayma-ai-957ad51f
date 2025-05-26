
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import IdeaItem from './IdeaItem';
import { ContentIdea } from '@/types/ideas';

interface GeneratedIdeasListProps {
  generatedIdeas: string[];
  selectedClientId?: string;
  onIdeaAdded: (idea: ContentIdea) => void;
  onDeleteIdea: (ideaToDelete: string) => void;
  onEditIdea: (editedIdea: string) => void;
  onCopyToClipboard: (text: string) => void;
  onClearAllIdeas: () => void;
}

const GeneratedIdeasList: FC<GeneratedIdeasListProps> = ({
  generatedIdeas,
  selectedClientId,
  onIdeaAdded,
  onDeleteIdea,
  onEditIdea,
  onCopyToClipboard,
  onClearAllIdeas,
}) => {
  const { toast } = useToast();

  const handleAddIdea = (idea: string) => {
    const newIdea: ContentIdea = {
      id: crypto.randomUUID(),
      title: idea,
      description: '',
      contentType: 'thought_leadership',
      articleSubtype: 'blog_post',
      status: 'draft',
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
    };
    onIdeaAdded(newIdea);
    onDeleteIdea(idea);
    toast({
      title: "Idea Added",
      description: "Idea added to your list.",
    });
  };

  const handleAddAllIdeas = () => {
    generatedIdeas.forEach(idea => {
      const newIdea: ContentIdea = {
        id: crypto.randomUUID(),
        title: idea,
        description: '',
        contentType: 'thought_leadership',
        articleSubtype: 'blog_post',
        status: 'draft',
        clientId: selectedClientId,
        createdAt: new Date().toISOString(),
      };
      onIdeaAdded(newIdea);
    });
    onClearAllIdeas();
    toast({
      title: "Ideas Added",
      description: "All ideas added to your list.",
    });
  };

  if (generatedIdeas.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800">Generated Ideas</h3>
      <div className="space-y-2">
        {generatedIdeas.map((idea, index) => (
          <IdeaItem
            key={index}
            idea={idea}
            onDelete={onDeleteIdea}
            onEdit={onEditIdea}
            onCopyToClipboard={onCopyToClipboard}
          />
        ))}
      </div>
      <Button 
        className="bg-green-500 hover:bg-green-700 text-white" 
        onClick={handleAddAllIdeas}
      >
        Add All Ideas
      </Button>
    </div>
  );
};

export default GeneratedIdeasList;
