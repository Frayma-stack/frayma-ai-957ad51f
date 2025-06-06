
import { FC, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Sparkles } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummarization } from '@/hooks/useIdeaSummarization';
import { toast } from 'sonner';

interface TriggerInputFieldProps {
  triggerInput: string;
  onTriggerInputChange: (input: string) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const TriggerInputField: FC<TriggerInputFieldProps> = ({
  triggerInput,
  onTriggerInputChange,
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  const { summarizeIdeaForContent } = useIdeaSummarization();

  // Check for newly minted idea data on component mount
  useEffect(() => {
    const storedGeneratedIdea = localStorage.getItem('selectedGeneratedIdea');
    if (storedGeneratedIdea) {
      try {
        const ideaData = JSON.parse(storedGeneratedIdea);
        console.log('🎯 Found stored generated idea data:', ideaData);
        
        // Generate trigger content from the minted idea
        const triggerContent = `Title: ${ideaData.title}

Narrative: ${ideaData.narrative}

Product Tie-in: ${ideaData.productTieIn}

Call to Action: ${ideaData.cta}`;
        
        onTriggerInputChange(triggerContent);
        toast.success('Newly minted idea loaded as trigger');
        
        // Clean up the stored data
        localStorage.removeItem('selectedGeneratedIdea');
      } catch (error) {
        console.error('Error parsing stored generated idea:', error);
        localStorage.removeItem('selectedGeneratedIdea');
      }
    }
  }, [onTriggerInputChange]);

  // Filter ideas by selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

  // Debug logging
  console.log('TriggerInputField Debug:', {
    totalIdeas: ideas.length,
    selectedClientId,
    filteredIdeas: filteredIdeas.length,
    ideas: ideas.map(idea => ({ id: idea.id, title: idea.title, clientId: idea.clientId }))
  });

  const handleIdeaSelection = async (ideaId: string) => {
    if (!ideaId || ideaId === 'none') {
      onIdeaSelect?.(null);
      return;
    }

    const selectedIdea = filteredIdeas.find(idea => idea.id === ideaId);
    if (!selectedIdea) return;

    onIdeaSelect?.(ideaId);

    try {
      const summary = await summarizeIdeaForContent(selectedIdea);
      onTriggerInputChange(summary);
      toast.success('Idea summary generated and applied as trigger');
    } catch (error) {
      console.error('Error processing idea:', error);
      toast.error('Failed to process idea. Please try again.');
    }
  };

  const selectedIdea = selectedIdeaId 
    ? filteredIdeas.find(idea => idea.id === selectedIdeaId)
    : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <span>Content Trigger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Always show the dropdown section for debugging */}
        <div>
          <Label className="flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Use Saved Idea as Trigger</span>
          </Label>
          {filteredIdeas.length > 0 ? (
            <Select value={selectedIdeaId || "none"} onValueChange={handleIdeaSelection}>
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
          ) : (
            <div className="mt-2 p-3 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-sm text-gray-600">
                {ideas.length === 0 
                  ? "No saved ideas available. Create some ideas first to use them as triggers."
                  : `No ideas found for the selected client. Total ideas: ${ideas.length}, Selected client: ${selectedClientId || 'All'}`
                }
              </p>
            </div>
          )}
        </div>

        {selectedIdea && (
          <div className="bg-blue-50 rounded-md p-3 border border-blue-200">
            <h4 className="text-xs font-medium text-blue-700 mb-1">Selected Idea:</h4>
            <p className="text-sm text-blue-800 font-medium">{selectedIdea.title}</p>
            <p className="text-xs text-blue-600 mt-1">{selectedIdea.narrative}</p>
          </div>
        )}

        <div>
          <Label>Trigger/Thesis/Anti-thesis</Label>
          <Textarea
            placeholder={selectedIdeaId 
              ? "Your saved idea summary will appear here..." 
              : "What's your trigger, thesis, or anti-thesis for this content? What insight or perspective do you want to share?"
            }
            value={triggerInput}
            onChange={(e) => onTriggerInputChange(e.target.value)}
            className="min-h-[120px] mt-2"
          />
          {selectedIdeaId && (
            <p className="text-sm text-gray-500 mt-1">
              Trigger generated from saved idea. You can edit it above if needed.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerInputField;
