
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ICPStoryScript } from '@/types/storytelling';

interface AIGenerationSectionProps {
  icpScripts: ICPStoryScript[];
  prompt: string;
  selectedICPScript: ICPStoryScript | null;
  generatedIdeas: string[];
  isGenerating: boolean;
  onInputChange: (value: string) => void;
  onICPScriptChange: (scriptId: string) => void;
  onGenerateIdeas: () => void;
  onSaveIdea: (idea: string) => void;
}

const AIGenerationSection: FC<AIGenerationSectionProps> = ({
  icpScripts,
  prompt,
  selectedICPScript,
  generatedIdeas,
  isGenerating,
  onInputChange,
  onICPScriptChange,
  onGenerateIdeas,
  onSaveIdea
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Generate Ideas with AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {icpScripts.length > 0 && (
            <div>
              <Label>Select ICP Script (Optional)</Label>
              <Select value={selectedICPScript?.id || ""} onValueChange={onICPScriptChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an ICP script to target..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No specific ICP</SelectItem>
                  {icpScripts.map((script) => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div>
            <Label>Idea Generation Prompt</Label>
            <Textarea
              placeholder="Describe the type of ideas you want to generate (e.g., 'content ideas about AI automation for small businesses')"
              value={prompt}
              onChange={(e) => onInputChange(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button 
            onClick={onGenerateIdeas}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedIdeas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {generatedIdeas.map((idea, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <p className="text-sm text-gray-700 mb-3">{idea}</p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => onSaveIdea(idea)}
                        className="bg-story-blue hover:bg-story-light-blue"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Save Idea
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default AIGenerationSection;
