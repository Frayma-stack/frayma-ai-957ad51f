
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Lightbulb, Loader2, Plus, Sparkles } from "lucide-react";
import { useTwoSidedIdeaGeneration } from '@/hooks/useTwoSidedIdeaGeneration';
import { GeneratedIdea } from '@/types/ideas';
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TwoSidedIdeaGeneratorProps {
  icpScripts: ICPStoryScript[];
  productContext: ProductContext | null;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
  selectedClientId?: string;
  ideas: GeneratedIdea[];
}

const TwoSidedIdeaGenerator: FC<TwoSidedIdeaGeneratorProps> = ({
  icpScripts,
  productContext,
  onIdeaAdded,
  onContentTypeSelect,
  selectedClientId,
  ideas
}) => {
  const [selectedFormat, setSelectedFormat] = useState<'structured' | 'open'>('structured');
  const [manualTitle, setManualTitle] = useState('');
  const [manualNarrative, setManualNarrative] = useState('');
  const [manualProductTieIn, setManualProductTieIn] = useState('');
  const [manualCTA, setManualCTA] = useState('');

  const {
    prompt,
    selectedICPScript,
    generatedIdeas,
    isGenerating,
    handleInputChange,
    handleICPScriptChange,
    generateIdeas
  } = useTwoSidedIdeaGeneration({
    icpScripts,
    productContext
  });

  const handleAddManualIdea = () => {
    if (!manualTitle.trim() || !manualNarrative.trim()) {
      return;
    }

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: manualTitle.trim(),
      narrative: manualNarrative.trim(),
      productTieIn: manualProductTieIn.trim() || undefined,
      cta: manualCTA.trim() || undefined,
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
      score: 0,
      source: 'manual',
      icpId: null,
      narrativeAnchor: null,
      triggers: [],
      searchQueries: []
    };

    onIdeaAdded(newIdea);

    // Reset form
    setManualTitle('');
    setManualNarrative('');
    setManualProductTieIn('');
    setManualCTA('');
  };

  const handleSaveIdea = (idea: string) => {
    // Parse the generated idea (assuming it's in a specific format)
    const lines = idea.split('\n').filter(line => line.trim());
    const title = lines[0]?.replace(/^\d+\.\s*/, '').trim() || 'Generated Idea';
    const narrative = lines.slice(1).join(' ').trim() || idea;

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title,
      narrative,
      productTieIn: undefined,
      cta: undefined,
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
      score: 0,
      source: 'ai_generated',
      icpId: selectedICPScript?.id || null,
      narrativeAnchor: null,
      triggers: [],
      searchQueries: []
    };

    onIdeaAdded(newIdea);
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-story-blue" />
            <span>Idea Generation Format</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <Button
              variant={selectedFormat === 'structured' ? 'default' : 'outline'}
              onClick={() => setSelectedFormat('structured')}
              className="flex-1"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Generated Ideas
            </Button>
            <Button
              variant={selectedFormat === 'open' ? 'default' : 'outline'}
              onClick={() => setSelectedFormat('open')}
              className="flex-1"
            >
              <Plus className="h-4 w-4 mr-2" />
              Manual Entry
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedFormat === 'structured' ? (
        <>
          {/* AI Generation Section */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Ideas with AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {icpScripts.length > 0 && (
                <div>
                  <Label>Select ICP Script (Optional)</Label>
                  <Select value={selectedICPScript?.id || ""} onValueChange={handleICPScriptChange}>
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
                  onChange={(e) => handleInputChange(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={generateIdeas}
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

          {/* Generated Ideas Display */}
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
                            onClick={() => handleSaveIdea(idea)}
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
      ) : (
        /* Manual Entry Section */
        <Card>
          <CardHeader>
            <CardTitle>Add Idea Manually</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Idea Title *</Label>
              <Input
                placeholder="Enter a compelling title for your idea"
                value={manualTitle}
                onChange={(e) => setManualTitle(e.target.value)}
              />
            </div>

            <div>
              <Label>Core Narrative *</Label>
              <Textarea
                placeholder="Describe the main narrative or insight"
                value={manualNarrative}
                onChange={(e) => setManualNarrative(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <Label>Product Tie-in (Optional)</Label>
              <Textarea
                placeholder="How does this idea connect to your product or service?"
                value={manualProductTieIn}
                onChange={(e) => setManualProductTieIn(e.target.value)}
                className="min-h-[80px]"
              />
            </div>

            <div>
              <Label>Call to Action (Optional)</Label>
              <Input
                placeholder="What action do you want readers to take?"
                value={manualCTA}
                onChange={(e) => setManualCTA(e.target.value)}
              />
            </div>

            <Button
              onClick={handleAddManualIdea}
              disabled={!manualTitle.trim() || !manualNarrative.trim()}
              className="w-full bg-story-blue hover:bg-story-light-blue"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Idea
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recent Ideas */}
      {ideas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Ideas ({ideas.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {ideas.slice(0, 5).map((idea) => (
                  <div key={idea.id} className="p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm">{idea.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{idea.narrative}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TwoSidedIdeaGenerator;
