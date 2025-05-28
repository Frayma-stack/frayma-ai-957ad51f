
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript } from '@/types/storytelling';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface TranscriptFile {
  id: string;
  name: string;
  content: string;
}

interface TranscriptBasedICPCreatorProps {
  onSave: (script: ICPStoryScript) => void;
  onCancel: () => void;
  selectedClientId?: string;
}

const TranscriptBasedICPCreator: FC<TranscriptBasedICPCreatorProps> = ({
  onSave,
  onCancel,
  selectedClientId
}) => {
  const { toast } = useToast();
  const { generateContent, isConfigured } = useChatGPT();
  const [transcripts, setTranscripts] = useState<TranscriptFile[]>([]);
  const [icpName, setIcpName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    if (transcripts.length + files.length > 3) {
      toast({
        title: "Too many files",
        description: "You can only upload up to 3 transcripts.",
        variant: "destructive"
      });
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        const newTranscript: TranscriptFile = {
          id: crypto.randomUUID(),
          name: file.name,
          content
        };
        setTranscripts(prev => [...prev, newTranscript]);
      };
      reader.readAsText(file);
    });

    // Reset the input
    event.target.value = '';
  };

  const removeTranscript = (id: string) => {
    setTranscripts(prev => prev.filter(t => t.id !== id));
  };

  const analyzeTranscripts = async () => {
    if (!isConfigured) {
      toast({
        title: "ChatGPT not configured",
        description: "Please configure your ChatGPT API key in the settings.",
        variant: "destructive"
      });
      return;
    }

    if (transcripts.length === 0) {
      toast({
        title: "No transcripts uploaded",
        description: "Please upload at least one meeting transcript.",
        variant: "destructive"
      });
      return;
    }

    if (!icpName.trim()) {
      toast({
        title: "Missing ICP name",
        description: "Please provide the name of the ICP you want to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const combinedTranscripts = transcripts.map(t => `--- ${t.name} ---\n${t.content}`).join('\n\n');
      
      const systemPrompt = `You are an expert ICP (Ideal Customer Profile) analyst specializing in extracting deep customer insights from meeting transcripts. Your task is to analyze meeting transcripts and extract specific insights about the target ICP mentioned.

INSTRUCTIONS:
1. Focus specifically on insights about "${icpName}" mentioned in the transcripts
2. Extract demographic information, beliefs, pains, struggles, and desired transformations
3. Be specific and actionable in your analysis
4. Use the exact format specified below
5. Each item should be exactly 2 sentences long (except demographics which should be 5 sentences)

REQUIRED OUTPUT FORMAT:
Return a JSON object with the following structure:
{
  "demographics": "Five sentence summary of the demographics...",
  "coreBeliefs": [
    "First core belief in two sentences.",
    "Second core belief in two sentences.",
    "Third core belief in two sentences.",
    "Fourth core belief in two sentences.",
    "Fifth core belief in two sentences.",
    "Sixth core belief in two sentences."
  ],
  "internalPains": [
    "First internal pain in two sentences.",
    "Second internal pain in two sentences.",
    "Third internal pain in two sentences.",
    "Fourth internal pain in two sentences.",
    "Fifth internal pain in two sentences.",
    "Sixth internal pain in two sentences."
  ],
  "externalStruggles": [
    "First external struggle in two sentences.",
    "Second external struggle in two sentences.",
    "Third external struggle in two sentences.",
    "Fourth external struggle in two sentences.",
    "Fifth external struggle in two sentences.",
    "Sixth external struggle in two sentences."
  ],
  "desiredTransformations": [
    "First desired transformation in two sentences.",
    "Second desired transformation in two sentences.",
    "Third desired transformation in two sentences.",
    "Fourth desired transformation in two sentences.",
    "Fifth desired transformation in two sentences.",
    "Sixth desired transformation in two sentences."
  ]
}

ANALYSIS FOCUS:
- Demographics: Company size, role, industry, experience level, team structure
- Core Beliefs: What they believe about their industry, customers, processes, success
- Internal Pains: Emotional frustrations, confidence issues, stress points, personal challenges
- External Struggles: Operational challenges, resource constraints, market pressures, competitive issues
- Desired Transformations: Goals they want to achieve, changes they seek, outcomes they desire

Analyze the following meeting transcripts for insights about "${icpName}":

${combinedTranscripts}`;

      const response = await generateContent(systemPrompt);
      
      // Extract JSON from the response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }

      const analysisResult = JSON.parse(jsonMatch[0]);

      // Convert to ICP StoryScript format
      const newScript: ICPStoryScript = {
        id: crypto.randomUUID(),
        name: icpName,
        demographics: analysisResult.demographics,
        coreBeliefs: analysisResult.coreBeliefs.map((belief: string) => ({
          id: crypto.randomUUID(),
          content: belief
        })),
        internalPains: analysisResult.internalPains.map((pain: string) => ({
          id: crypto.randomUUID(),
          content: pain
        })),
        externalStruggles: analysisResult.externalStruggles.map((struggle: string) => ({
          id: crypto.randomUUID(),
          content: struggle
        })),
        desiredTransformations: analysisResult.desiredTransformations.map((transformation: string) => ({
          id: crypto.randomUUID(),
          content: transformation
        })),
        clientId: selectedClientId
      };

      onSave(newScript);
      
      toast({
        title: "Analysis complete",
        description: `ICP StoryScript for "${icpName}" has been created successfully.`
      });

    } catch (error) {
      console.error('Error analyzing transcripts:', error);
      toast({
        title: "Analysis failed",
        description: "Failed to analyze the transcripts. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">AI-Powered ICP Analysis</CardTitle>
        <CardDescription>
          Upload meeting transcripts to automatically extract ICP insights. Best results come from sales discovery, customer success, or churning customer conversations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* File Upload Section */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload Meeting Transcripts (Max 3 files)</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Upload text files containing meeting transcripts
                </p>
                <p className="text-xs text-gray-500">
                  Best results: Sales discovery, customer success, or churning customer conversations
                </p>
                <input
                  type="file"
                  accept=".txt,.md"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="transcript-upload"
                />
                <label
                  htmlFor="transcript-upload"
                  className="inline-flex items-center px-4 py-2 bg-story-blue text-white rounded-md cursor-pointer hover:bg-story-light-blue"
                >
                  Choose Files
                </label>
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {transcripts.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Uploaded Transcripts</label>
              {transcripts.map(transcript => (
                <div key={transcript.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-sm text-gray-700">{transcript.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeTranscript(transcript.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ICP Name Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Target ICP Name *</label>
          <Input 
            placeholder="e.g., SaaS Founder, CTO, Marketing Director"
            value={icpName}
            onChange={(e) => setIcpName(e.target.value)}
          />
          <p className="text-xs text-gray-500">
            Enter the name/role of the person you want to create the ICP StoryScript for
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={analyzeTranscripts}
            disabled={isAnalyzing || transcripts.length === 0 || !icpName.trim()}
            className="flex-1 bg-story-blue hover:bg-story-light-blue"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Transcripts...
              </>
            ) : (
              'Analyze & Create ICP StoryScript'
            )}
          </Button>
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={isAnalyzing}
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TranscriptBasedICPCreator;
