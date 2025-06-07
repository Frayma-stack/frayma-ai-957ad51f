
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2 } from 'lucide-react';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';
import { ICPStoryScript } from '@/types/storytelling';
import { toast } from 'sonner';
import IdeaContentActions from './IdeaContentActions';

interface SavedIdeaCardProps {
  idea: GeneratedIdea;
  scripts: ICPStoryScript[];
  scoreOptions: IdeaScore[];
  onScoreChange: (ideaId: string, scoreValue: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const SavedIdeaCard: FC<SavedIdeaCardProps> = ({
  idea,
  scripts,
  scoreOptions,
  onScoreChange,
  onEdit,
  onDelete,
  onContentTypeSelect
}) => {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{idea.title}</CardTitle>
          <Select
            value={idea.score?.value !== undefined ? idea.score.value.toString() : "__no_score__"}
            onValueChange={(value) => onScoreChange(idea.id, value)}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Rate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__no_score__">No Rating</SelectItem>
              {scoreOptions.map((score) => (
                <SelectItem key={score.value} value={score.value.toString()}>
                  {score.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <CardDescription>
          {new Date(idea.createdAt).toLocaleDateString()}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <h4 className="font-medium text-sm mb-1">Narrative:</h4>
        <p className="text-sm mb-3">{idea.narrative}</p>
        
        <h4 className="font-medium text-sm mb-1">Product Tie-In:</h4>
        <p className="text-sm mb-3">{idea.productTieIn}</p>
        
        <h4 className="font-medium text-sm mb-1">Call to Action:</h4>
        <p className="text-sm">{idea.cta}</p>
        
        {idea.icpId && (
          <div className="mt-3">
            <Badge variant="outline" className="mr-2">
              ICP: {scripts.find(s => s.id === idea.icpId)?.name || 'Unknown'}
            </Badge>
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t pt-3 flex justify-between">
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onEdit}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            variant="destructive" 
            size="sm"
            onClick={onDelete}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete
          </Button>
        </div>
        <IdeaContentActions
          idea={idea}
          onContentTypeSelect={onContentTypeSelect}
        />
      </CardFooter>
    </Card>
  );
};

export default SavedIdeaCard;
