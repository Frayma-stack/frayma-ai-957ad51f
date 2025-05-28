
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Wand2 } from 'lucide-react';
import { SuccessStoryAnalysisService } from '@/services/SuccessStoryAnalysisService';
import { useToast } from "@/components/ui/use-toast";

interface Quote {
  id: string;
  quote: string;
  author: string;
  title: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface AutoAnalysisFormProps {
  url: string;
  onUrlChange: (url: string) => void;
  onAnalysisComplete: (data: {
    title: string;
    beforeSummary: string;
    afterSummary: string;
    quotes: Quote[];
    features: Feature[];
  }) => void;
}

const AutoAnalysisForm: FC<AutoAnalysisFormProps> = ({
  url,
  onUrlChange,
  onAnalysisComplete,
}) => {
  const [isAutoAnalyzing, setIsAutoAnalyzing] = useState(false);
  const { toast } = useToast();

  const handleAutoAnalyze = async () => {
    if (!url) {
      toast({
        title: "URL Required",
        description: "Please enter a URL to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAutoAnalyzing(true);
    
    try {
      const analysisResult = await SuccessStoryAnalysisService.analyzeSuccessStory(url);
      
      const quotes = analysisResult.quotes && analysisResult.quotes.length > 0
        ? analysisResult.quotes.map((quote) => ({
            id: crypto.randomUUID(),
            quote: quote.quote,
            author: quote.author,
            title: quote.title
          }))
        : [];

      const features = analysisResult.features && analysisResult.features.length > 0
        ? analysisResult.features.map((feature) => ({
            id: crypto.randomUUID(),
            name: feature.name,
            description: feature.description
          }))
        : [];

      onAnalysisComplete({
        title: analysisResult.title || 'Customer Success Story',
        beforeSummary: analysisResult.beforeSummary || '',
        afterSummary: analysisResult.afterSummary || '',
        quotes,
        features
      });

      toast({
        title: "Analysis Complete",
        description: "Success story has been analyzed and fields populated.",
      });

    } catch (error) {
      console.error('Error analyzing success story:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze the success story. Please try again or fill manually.",
        variant: "destructive"
      });
    } finally {
      setIsAutoAnalyzing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wand2 className="h-5 w-5 mr-2" />
          Auto-Analyze Success Story
        </CardTitle>
        <CardDescription>
          Paste a URL to automatically extract success story information using AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-4">
          <div className="flex-1">
            <Label htmlFor="auto-url">Success Story URL</Label>
            <Input 
              id="auto-url"
              type="url" 
              value={url} 
              onChange={(e) => onUrlChange(e.target.value)} 
              placeholder="https://example.com/success-story"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleAutoAnalyze}
              disabled={!url || isAutoAnalyzing}
            >
              {isAutoAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Auto-Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AutoAnalysisForm;
