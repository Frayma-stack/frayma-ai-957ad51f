
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, RefreshCw } from 'lucide-react';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';

interface GeneratedIdeasViewerProps {
  generatedIdeas: string[];
  onBackToGeneration: () => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  onGenerateNewIdeas: () => void;
  selectedClientId?: string;
  icpId: string;
}

interface ParsedIdea {
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  originalContent: string;
}

interface IdeaWithScore extends ParsedIdea {
  score: IdeaScore | null;
}

const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: "0 - Won't propel business" },
  { value: 1, label: "1 - Somewhat useful" },
  { value: 2, label: "2 - Very promising" },
  { value: 3, label: "3 - Can't auto-craft without it" }
];

const GeneratedIdeasViewer: FC<GeneratedIdeasViewerProps> = ({
  generatedIdeas,
  onBackToGeneration,
  onSaveIdea,
  onGenerateNewIdeas,
  selectedClientId,
  icpId
}) => {
  const { toast } = useToast();

  // Parse and filter ideas to exclude description/intro text
  const parseIdeas = (ideas: string[]): ParsedIdea[] => {
    return ideas
      .filter(idea => {
        const trimmed = idea.trim();
        // Filter out descriptions/intro text by checking for specific patterns
        return trimmed && 
               !trimmed.toLowerCase().includes('here are') &&
               !trimmed.toLowerCase().includes('below are') &&
               !trimmed.toLowerCase().includes('generate') &&
               !trimmed.toLowerCase().startsWith('about product-led') &&
               trimmed.toLowerCase().includes('title') &&
               trimmed.length > 50; // Ensure it's substantial content
      })
      .map(idea => {
        const lines = idea.split('\n').filter(line => line.trim());
        
        // Extract sections using regex patterns
        const titleMatch = lines.find(line => /^title[\s\-–:]+/i.test(line.trim()));
        const narrativeMatch = lines.find(line => /^narrative[\s\-–:]+/i.test(line.trim()));
        const tieInMatch = lines.find(line => /^product tie-in[\s\-–:]+/i.test(line.trim()));
        const ctaMatch = lines.find(line => /^cta[\s\-–:]+/i.test(line.trim()));

        return {
          title: titleMatch?.replace(/^title[\s\-–:]+/i, '').trim() || 'Untitled Idea',
          narrative: narrativeMatch?.replace(/^narrative[\s\-–:]+/i, '').trim() || '',
          productTieIn: tieInMatch?.replace(/^product tie-in[\s\-–:]+/i, '').trim() || '',
          cta: ctaMatch?.replace(/^cta[\s\-–:]+/i, '').trim() || '',
          originalContent: idea
        };
      });
  };

  const [ideasWithScores, setIdeasWithScores] = useState<IdeaWithScore[]>(
    parseIdeas(generatedIdeas).map(idea => ({ ...idea, score: null }))
  );

  const updateIdeaField = (index: number, field: keyof ParsedIdea, value: string) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === index ? { ...idea, [field]: value } : idea
    ));
  };

  const updateIdeaScore = (index: number, score: IdeaScore) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === index ? { ...idea, score } : idea
    ));
  };

  const handleSaveIdea = (index: number) => {
    const ideaData = ideasWithScores[index];
    
    if (!ideaData.score) {
      toast({
        title: "Score Required",
        description: "Please score the idea before saving.",
        variant: "destructive",
      });
      return;
    }

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: ideaData.title,
      narrative: ideaData.narrative,
      productTieIn: ideaData.productTieIn,
      cta: ideaData.cta,
      createdAt: new Date().toISOString(),
      score: ideaData.score,
      source: {
        type: 'manual',
        content: ideaData.originalContent,
      },
      icpId: icpId,
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: [],
      clientId: selectedClientId,
    };

    onSaveIdea(newIdea);
    
    toast({
      title: "Idea Saved",
      description: "The idea has been saved to your ideas bank.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold text-gray-800">Generated Product-Led Ideas</h3>
        <Button
          onClick={onBackToGeneration}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Generation</span>
        </Button>
      </div>

      {ideasWithScores.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500 mb-4">No valid ideas were found in the generated content.</p>
          <Button onClick={onGenerateNewIdeas} className="bg-blue-500 hover:bg-blue-600 text-white">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New Ideas
          </Button>
        </Card>
      ) : (
        <>
          <div className="max-h-[700px] overflow-y-auto space-y-6 pr-2">
            {ideasWithScores.map((ideaData, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg flex items-center justify-between">
                    <span>Idea {index + 1}</span>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2">
                        <Label className="text-sm">Score:</Label>
                        <Select 
                          value={ideaData.score?.value.toString() || ''} 
                          onValueChange={(value) => {
                            const score = SCORE_OPTIONS.find(s => s.value.toString() === value);
                            if (score) updateIdeaScore(index, score);
                          }}
                        >
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select score" />
                          </SelectTrigger>
                          <SelectContent>
                            {SCORE_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        onClick={() => handleSaveIdea(index)}
                        disabled={!ideaData.score}
                        className="bg-green-500 hover:bg-green-600 text-white"
                        size="sm"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-blue-600">Title</Label>
                      <Textarea
                        value={ideaData.title}
                        onChange={(e) => updateIdeaField(index, 'title', e.target.value)}
                        className="min-h-[60px] font-medium border-blue-200 focus:border-blue-400"
                        placeholder="Enter a compelling title..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-green-600">Narrative</Label>
                      <Textarea
                        value={ideaData.narrative}
                        onChange={(e) => updateIdeaField(index, 'narrative', e.target.value)}
                        className="min-h-[100px] border-green-200 focus:border-green-400"
                        placeholder="Describe the narrative tension or belief this idea challenges..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-purple-600">Product Tie-In</Label>
                      <Textarea
                        value={ideaData.productTieIn}
                        onChange={(e) => updateIdeaField(index, 'productTieIn', e.target.value)}
                        className="min-h-[100px] border-purple-200 focus:border-purple-400"
                        placeholder="How does this naturally surface your product's unique value..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold text-orange-600">Call to Action</Label>
                      <Textarea
                        value={ideaData.cta}
                        onChange={(e) => updateIdeaField(index, 'cta', e.target.value)}
                        className="min-h-[60px] border-orange-200 focus:border-orange-400"
                        placeholder="What specific action should readers take..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Generate New Ideas CTA at the bottom */}
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-dashed border-blue-300">
            <CardContent className="p-8 text-center">
              <h4 className="text-lg font-semibold text-gray-800 mb-2">Need More Ideas?</h4>
              <p className="text-gray-600 mb-4">Generate a fresh batch of Product-Led Storytelling ideas with different angles and perspectives.</p>
              <Button 
                onClick={onGenerateNewIdeas}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
              >
                <RefreshCw className="h-5 w-5 mr-2" />
                Generate New Ideas
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GeneratedIdeasViewer;
