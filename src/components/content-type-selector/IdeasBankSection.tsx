
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GeneratedIdea } from '@/types/ideas';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface IdeasBankSectionProps {
  selectedClientId?: string | null;
  ideas: GeneratedIdea[];
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
  onNavigateToIdeasBank: () => void;
}

const IdeasBankSection: React.FC<IdeasBankSectionProps> = ({
  selectedClientId,
  ideas,
  selectedIdeaId,
  onIdeaSelect,
  onNavigateToIdeasBank
}) => {
  // Filter ideas for the selected client
  const clientIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  if (!selectedClientId) {
    return (
      <Card className="bg-gray-50 border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="text-gray-600 text-sm mb-2">
                Start from a Saved Idea
              </div>
              <div className="text-gray-400 text-sm italic">
                Choose an Account to see saved ideas
              </div>
            </div>
            <Button 
              onClick={onNavigateToIdeasBank}
              variant="outline" 
              className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              View Ideas Bank
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-50 border border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            {clientIdeas.length > 0 ? (
              <Select 
                value={selectedIdeaId || undefined} 
                onValueChange={(value) => onIdeaSelect?.(value || null)}
              >
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Select a saved idea..." />
                </SelectTrigger>
                <SelectContent>
                  {clientIdeas.map((idea) => (
                    <SelectItem key={idea.id} value={idea.id}>
                      <div className="flex flex-col">
                        <div className="font-medium text-sm">{idea.title}</div>
                        <div className="text-xs text-gray-600 truncate max-w-[200px]">
                          {idea.narrative}
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="bg-white border border-gray-300 rounded-md px-3 py-2 text-gray-600 text-sm">
                No ideas saved yet. Create some ideas first!
              </div>
            )}
          </div>
          
          <Button 
            onClick={onNavigateToIdeasBank}
            variant="outline" 
            className="bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            View Ideas Bank
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasBankSection;
