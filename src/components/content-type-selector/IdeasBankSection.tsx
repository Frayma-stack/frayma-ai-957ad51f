
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';
import { ScrollArea } from "@/components/ui/scroll-area";

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
          
          {clientIdeas.length > 0 ? (
            <div className="space-y-3">
              <ScrollArea className="h-32">
                <div className="space-y-2">
                  {clientIdeas.slice(0, 5).map((idea) => (
                    <div 
                      key={idea.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedIdeaId === idea.id 
                          ? 'bg-yellow-200 border-2 border-yellow-400' 
                          : 'bg-white hover:bg-yellow-100 border border-yellow-200'
                      }`}
                      onClick={() => onIdeaSelect?.(selectedIdeaId === idea.id ? null : idea.id)}
                    >
                      <div className="font-medium text-sm text-gray-900">{idea.title}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{idea.narrative}</div>
                      {idea.score && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Score: {idea.score.value}/3
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="text-sm text-gray-500">
                Select an idea… 
              </div>
            </div>
          ) : (
            <p className="text-yellow-600 text-sm">
              No ideas saved yet. Create some ideas first!
            </p>
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
      </CardContent>
    </Card>
  );
};

export default IdeasBankSection;
