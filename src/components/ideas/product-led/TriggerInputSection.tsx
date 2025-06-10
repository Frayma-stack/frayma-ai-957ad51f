
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Upload, FileText, Image, Sparkles } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummarization } from '@/hooks/useIdeaSummarization';
import { toast } from 'sonner';

interface TriggerInput {
  type: 'text' | 'image' | 'file';
  content: string;
}

interface TriggerInputSectionProps {
  triggerInput: TriggerInput;
  onTriggerInputChange: (input: TriggerInput) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string;
}

const TriggerInputSection: FC<TriggerInputSectionProps> = ({
  triggerInput,
  onTriggerInputChange,
  ideas = [],
  selectedClientId
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('none');
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);
  const { summarizeIdeaForContent } = useIdeaSummarization();

  // Filter ideas by selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

  const handleIdeaSelection = async (ideaId: string) => {
    if (!ideaId || ideaId === 'none') {
      setSelectedIdeaId('none');
      return;
    }

    const selectedIdea = filteredIdeas.find(idea => idea.id === ideaId);
    if (!selectedIdea) return;

    setSelectedIdeaId(ideaId);
    setIsProcessingIdea(true);

    try {
      const summary = await summarizeIdeaForContent(selectedIdea);
      onTriggerInputChange({
        ...triggerInput,
        content: summary
      });
      toast.success('Idea summary generated and applied as trigger');
    } catch (error) {
      console.error('Error processing idea:', error);
      toast.error('Failed to process idea. Please try again.');
    } finally {
      setIsProcessingIdea(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <span>Idea Trigger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saved Ideas Dropdown */}
        {filteredIdeas.length > 0 && (
          <div>
            <Label className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Use Saved Idea as Trigger</span>
            </Label>
            <Select value={selectedIdeaId} onValueChange={handleIdeaSelection} disabled={isProcessingIdea}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a saved idea to use as trigger..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - Create custom trigger</SelectItem>
                {filteredIdeas.map((idea) => (
                  <SelectItem key={idea.id} value={idea.id}>
                    {idea.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isProcessingIdea && (
              <p className="text-sm text-gray-500 mt-1">
                Processing idea and generating summary...
              </p>
            )}
          </div>
        )}

        <div>
          <Label>Input Type</Label>
          <div className="flex space-x-2 mt-2">
            <Button
              variant={triggerInput.type === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'text' })}
            >
              <FileText className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              variant={triggerInput.type === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'image' })}
            >
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
            <Button
              variant={triggerInput.type === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'file' })}
            >
              <Upload className="h-4 w-4 mr-1" />
              File
            </Button>
          </div>
        </div>

        <div>
          <Label>Trigger/Thesis/Anti-thesis</Label>
          <Textarea
            placeholder={selectedIdeaId !== 'none'
              ? "Your saved idea summary will appear here..." 
              : "What triggered you to mint new ideas? Paste text, describe an image, or explain file content..."
            }
            value={triggerInput.content}
            onChange={(e) => onTriggerInputChange({ ...triggerInput, content: e.target.value })}
            className="min-h-[200px] mt-2"
            disabled={isProcessingIdea}
          />
          {selectedIdeaId !== 'none' && (
            <p className="text-sm text-gray-500 mt-1">
              Trigger generated from saved idea. You can edit it above if needed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerInputSection;
