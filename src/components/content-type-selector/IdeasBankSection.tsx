
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
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
    return null;
  }

  return (
    <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Lightbulb className="h-5 w-5" />
          Use a Saved Idea
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-yellow-700">
            Select an idea to get started
          </p>
          
          <div className="space-y-3">
            {clientIdeas.length > 0 ? (
              <Select value={selectedIdeaId || ""} onValueChange={(value) => onIdeaSelect?.(value || null)}>
                <SelectTrigger className="bg-white border-yellow-300">
                  <SelectValue placeholder="Select an idea…" />
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
              <div className="bg-white border border-yellow-300 rounded-md px-3 py-2 text-yellow-600 text-sm">
                No ideas saved yet. Create some ideas first!
              </div>
            )}
            
            <Button 
              onClick={onNavigateToIdeasBank}
              variant="outline" 
              className="w-full bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-50"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              View Ideas Bank
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasBankSection;
