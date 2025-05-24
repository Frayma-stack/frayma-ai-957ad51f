
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useChatGPT } from "@/contexts/ChatGPTContext";
import { Trophy, Loader2 } from 'lucide-react';
import ContentEditor from './ContentEditor';

interface SuccessStoryCreatorProps {
  onBack: () => void;
}

const SuccessStoryCreator: FC<SuccessStoryCreatorProps> = ({ onBack }) => {
  const [customerName, setCustomerName] = useState('');
  const [industry, setIndustry] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [results, setResults] = useState('');
  const [quote, setQuote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');
  const [showEditor, setShowEditor] = useState(false);
  
  const { generateContent, isConfigured } = useChatGPT();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!customerName || !challenge || !solution || !results) {
      toast({
        title: "Missing Information",
        description: "Please fill in the customer name, challenge, solution, and results fields.",
        variant: "destructive",
      });
      return;
    }

    if (!isConfigured) {
      toast({
        title: "API Not Configured",
        description: "Content generation is temporarily unavailable.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const prompt = `Create a compelling customer success story with the following details:
      
Customer: ${customerName}
Industry: ${industry || 'Not specified'}
Challenge: ${challenge}
Solution: ${solution}
Results: ${results}
${quote ? `Customer Quote: "${quote}"` : ''}

Write this as a professional, engaging success story that follows this structure:
1. Brief introduction of the customer and their industry context
2. The challenge they faced (pain points, obstacles)
3. The solution implemented 
4. The measurable results and impact
5. ${quote ? 'Include the customer quote naturally within the narrative' : 'Conclude with key takeaways'}

Make it compelling, specific, and focus on the transformation achieved. Use a professional but engaging tone suitable for marketing materials.`;

      const content = await generateContent(prompt);
      setGeneratedContent(content);
      setShowEditor(true);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate the success story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (showEditor) {
    return (
      <ContentEditor
        initialContent={generatedContent}
        title={`Success Story: ${customerName}`}
        onBack={() => setShowEditor(false)}
      />
    );
  }

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Trophy className="h-6 w-6 text-brand-primary" />
          <CardTitle className="text-brand-primary font-sora">Create Success Story</CardTitle>
        </div>
        <CardDescription>
          Provide customer details to auto-craft a compelling success story
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="customerName">Customer Name *</Label>
            <Input
              id="customerName"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="e.g., Acme Corporation"
            />
          </div>
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="e.g., SaaS, Manufacturing, Healthcare"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="challenge">Challenge/Problem *</Label>
          <Textarea
            id="challenge"
            value={challenge}
            onChange={(e) => setChallenge(e.target.value)}
            placeholder="Describe the main challenge or problem the customer was facing..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="solution">Solution Implemented *</Label>
          <Textarea
            id="solution"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
            placeholder="Describe how your product/service solved their problem..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="results">Results Achieved *</Label>
          <Textarea
            id="results"
            value={results}
            onChange={(e) => setResults(e.target.value)}
            placeholder="Describe the measurable outcomes and benefits (metrics, ROI, improvements)..."
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label htmlFor="quote">Customer Quote (Optional)</Label>
          <Textarea
            id="quote"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            placeholder="Include a compelling quote from the customer..."
            className="min-h-[60px]"
          />
        </div>

        <div className="flex gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Content Types
          </Button>
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating || !isConfigured}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Trophy className="mr-2 h-4 w-4" />
                Generate Success Story
              </>
            )}
          </Button>
        </div>

        {!isConfigured && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800">
              Content generation is temporarily unavailable. The API integration is pending configuration.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SuccessStoryCreator;
