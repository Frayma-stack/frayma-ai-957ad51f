
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader, ArrowRight, RotateCcw } from 'lucide-react';

interface RegenerationDirectionDialogProps {
  isOpen: boolean;
  isGenerating: boolean;
  regenerationDirection: string;
  onRegenerationDirectionChange: (value: string) => void;
  onRegenerate: () => void;
  onClose: () => void;
}

const RegenerationDirectionDialog: FC<RegenerationDirectionDialogProps> = ({
  isOpen,
  isGenerating,
  regenerationDirection,
  onRegenerationDirectionChange,
  onRegenerate,
  onClose
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegenerate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-story-blue" />
            Generate New Ideas with Fresh Direction
          </DialogTitle>
          <DialogDescription>
            Provide a new narrative direction, angle, or point of view to regenerate your content ideas. 
            This will completely reframe your ideas using the Product-Led Storytelling approach.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="regeneration-direction">
              New Direction/Angle/POV
            </Label>
            <Textarea
              id="regeneration-direction"
              placeholder="Example: Focus on the emotional cost of manual processes instead of just efficiency gains... or... Frame this from a founder's perspective who's been burned by oversold promises... or... Challenge the assumption that bigger teams solve scaling problems..."
              value={regenerationDirection}
              onChange={(e) => onRegenerationDirectionChange(e.target.value)}
              rows={4}
              className="resize-none"
              disabled={isGenerating}
            />
            <p className="text-sm text-gray-500">
              Be specific about the narrative angle, emotional frame, or contrarian perspective you want to explore.
            </p>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-story-blue hover:bg-story-light-blue"
              disabled={isGenerating || !regenerationDirection.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Regenerating Ideas...
                </>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Regenerate Ideas
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RegenerationDirectionDialog;
