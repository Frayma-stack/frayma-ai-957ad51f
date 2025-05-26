
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save } from 'lucide-react';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';

interface GeneratedIdeasViewerProps {
  generatedIdeas: string[];
  onBackToGeneration: () => void;
  onSaveIdea: (idea: GeneratedIdea) => void;
  selectedClientId?: string;
  icpId: string;
}

interface IdeaWithScore {
  content: string;
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
  selectedClientId,
  icpId
}) => {
  const { toast } = useToast();
  const [ideasWithScores, setIdeasWithScores] = useState<IdeaWithScore[]>(
    generatedIdeas.map(idea => ({ content: idea, score: null }))
  );

  const updateIdeaContent = (index: number, content: string) => {
    setIdeasWithScores(prev => prev.map((idea, i) => 
      i === index ? { ...idea, content } : idea
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

    // Parse the idea content to extract title, narrative, etc.
    const lines = ideaData.content.split('\n').filter(line => line.trim());
    const titleLine = lines.find(line => line.toLowerCase().includes('title'));
    const narrativeLine = lines.find(line => line.toLowerCase().includes('narrative'));
    const tieInLine = lines.find(line => line.toLowerCase().includes('tie-in') || line.toLowerCase().includes('product'));
    const ctaLine = lines.find(line => line.toLowerCase().includes('cta'));

    const newIdea: GeneratedIdea = {
      id: crypto.randomUUID(),
      title: titleLine?.replace(/^.*title[\s\-–:]+/i, '').trim() || ideaData.content.substring(0, 100),
      narrative: narrativeLine?.replace(/^.*narrative[\s\-–:]+/i, '').trim() || '',
      productTieIn: tieInLine?.replace(/^.*tie-in[\s\-–:]+/i, '').trim() || '',
      cta: ctaLine?.replace(/^.*cta[\s\-–:]+/i, '').trim() || '',
      createdAt: new Date().toISOString(),
      score: ideaData.score,
      source: {
        type: 'manual',
        content: ideaData.content,
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

      <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
        {ideasWithScores.map((ideaData, index) => (
          <Card key={index} className="border-l-4 border-l-story-blue">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Idea {index + 1}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Content (editable)</Label>
                <Textarea
                  value={ideaData.content}
                  onChange={(e) => updateIdeaContent(index, e.target.value)}
                  className="min-h-[150px] mt-2 font-mono text-sm"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <Label>Score this idea</Label>
                  <Select 
                    value={ideaData.score?.value.toString() || ''} 
                    onValueChange={(value) => {
                      const score = SCORE_OPTIONS.find(s => s.value.toString() === value);
                      if (score) updateIdeaScore(index, score);
                    }}
                  >
                    <SelectTrigger className="mt-2">
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
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to Bank
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GeneratedIdeasViewer;
