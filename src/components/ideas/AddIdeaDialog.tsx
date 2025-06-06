
import { FC } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GeneratedIdea, IdeaScore } from '@/types/ideas';
import { ICPStoryScript } from '@/types/storytelling';

interface AddIdeaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newIdea: Partial<GeneratedIdea>;
  scripts: ICPStoryScript[];
  scoreOptions: IdeaScore[];
  onIdeaChange: (idea: Partial<GeneratedIdea>) => void;
  onSave: () => void;
}

const AddIdeaDialog: FC<AddIdeaDialogProps> = ({
  isOpen,
  onOpenChange,
  newIdea,
  scripts,
  scoreOptions,
  onIdeaChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Idea</DialogTitle>
          <DialogDescription>
            Manually add a new idea to your ideas bank
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input 
              id="title" 
              value={newIdea.title || ''}
              onChange={(e) => onIdeaChange({...newIdea, title: e.target.value})}
              placeholder="Enter a compelling title for your idea"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="narrative" className="text-sm font-medium">
              Narrative
            </label>
            <Textarea 
              id="narrative"
              value={newIdea.narrative || ''}
              onChange={(e) => onIdeaChange({...newIdea, narrative: e.target.value})}
              placeholder="Describe your narrative"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="productTieIn" className="text-sm font-medium">
              Product Tie-In
            </label>
            <Textarea 
              id="productTieIn"
              value={newIdea.productTieIn || ''}
              onChange={(e) => onIdeaChange({...newIdea, productTieIn: e.target.value})}
              placeholder="How does this idea tie in with your product?"
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="cta" className="text-sm font-medium">
              Call to Action
            </label>
            <Input 
              id="cta" 
              value={newIdea.cta || ''}
              onChange={(e) => onIdeaChange({...newIdea, cta: e.target.value})}
              placeholder="What action should readers take?"
            />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="icp" className="text-sm font-medium">
              Target ICP (Optional)
            </label>
            <Select
              value={newIdea.icpId || "__none__"}
              onValueChange={(value) => onIdeaChange({...newIdea, icpId: value === "__none__" ? "" : value})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an ICP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">None</SelectItem>
                {scripts.map((script) => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            <label htmlFor="score" className="text-sm font-medium">
              Score
            </label>
            <Select
              value={newIdea.score?.value.toString() || "2"}
              onValueChange={(value) => {
                const score = scoreOptions.find(s => s.value === Number(value));
                onIdeaChange({...newIdea, score: score || null});
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Rate this idea" />
              </SelectTrigger>
              <SelectContent>
                {scoreOptions.map((score) => (
                  <SelectItem key={score.value} value={score.value.toString()}>
                    {score.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>
            Save Idea
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddIdeaDialog;
