
import { FC } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, X } from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummary } from '@/hooks/useIdeaSummary';

interface IdeaSelectorProps {
  ideas: GeneratedIdea[];
  selectedIdeaId: string | null;
  onIdeaSelect: (ideaId: string | null) => void;
  selectedClientId?: string | null;
}

const IdeaSelector: FC<IdeaSelectorProps> = ({
  ideas,
  selectedIdeaId,
  onIdeaSelect,
  selectedClientId
}) => {
  const { generateIdeaSummary } = useIdeaSummary();
  
  // Filter ideas for the selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

  const selectedIdea = selectedIdeaId 
    ? filteredIdeas.find(idea => idea.id === selectedIdeaId)
    : null;

  if (filteredIdeas.length === 0) {
    return null;
  }

  return (
    <Card className="w-full bg-gradient-to-r from-brand-primary/5 to-brand-primary/10 border-brand-primary/20 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb className="h-4 w-4 text-brand-primary" />
          <h3 className="text-sm font-medium text-brand-primary">Start with a Saved Idea</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Select value={selectedIdeaId || ""} onValueChange={(value) => onIdeaSelect(value || null)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Choose from your saved ideas (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {filteredIdeas.map(idea => (
                    <SelectItem key={idea.id} value={idea.id}>
                      {idea.title || 'Untitled Idea'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedIdeaId && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onIdeaSelect(null)}
                className="px-2"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {selectedIdea && (
            <div className="bg-white/60 rounded-md p-3 border border-brand-primary/10">
              <h4 className="text-xs font-medium text-gray-600 mb-1">Content Foundation:</h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {generateIdeaSummary(selectedIdea)}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaSelector;
