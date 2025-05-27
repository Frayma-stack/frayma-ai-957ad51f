
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, FileText } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';

interface OnboardingStepICPProps {
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onNext: () => void;
}

const OnboardingStepICP: FC<OnboardingStepICPProps> = ({
  onICPScriptAdded,
  onNext,
}) => {
  const [transcript, setTranscript] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    if (!transcript.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockICPScript: ICPStoryScript = {
      id: crypto.randomUUID(),
      name: 'Target Customer (From Meeting)',
      demographics: 'Small business owners in tech, 25-45 years old, $1M-$10M revenue',
      coreBeliefs: [
        {
          id: crypto.randomUUID(),
          content: 'Technology should simplify, not complicate business operations'
        },
        {
          id: crypto.randomUUID(),
          content: 'Quality over quantity in customer relationships'
        },
        {
          id: crypto.randomUUID(),
          content: 'Authenticity builds trust and long-term success'
        }
      ],
      internalPains: [
        {
          id: crypto.randomUUID(),
          content: 'Feeling overwhelmed by too many tools and platforms'
        },
        {
          id: crypto.randomUUID(),
          content: 'Struggling to maintain consistent brand voice across channels'
        },
        {
          id: crypto.randomUUID(),
          content: 'Imposter syndrome when creating thought leadership content'
        }
      ],
      externalStruggles: [
        {
          id: crypto.randomUUID(),
          content: 'Limited time to create quality content consistently'
        },
        {
          id: crypto.randomUUID(),
          content: 'Difficulty standing out in crowded market'
        },
        {
          id: crypto.randomUUID(),
          content: 'Keeping up with rapidly changing digital marketing trends'
        }
      ],
      desiredTransformations: [
        {
          id: crypto.randomUUID(),
          content: 'Becoming a recognized thought leader in their industry'
        },
        {
          id: crypto.randomUUID(),
          content: 'Streamlined content creation process that saves time'
        },
        {
          id: crypto.randomUUID(),
          content: 'Authentic brand voice that resonates with ideal customers'
        }
      ]
    };

    onICPScriptAdded(mockICPScript);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleSkip = () => {
    onNext();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setTranscript(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Meeting Transcript</Label>
            <p className="text-sm text-gray-600 mb-3">
              Upload or paste a meeting transcript with your target customer to extract their mindset, 
              pain points, and desired outcomes. This creates a powerful ICP profile.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="file"
                    accept=".txt,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <Button variant="outline" size="sm" asChild>
                    <span>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload File
                    </span>
                  </Button>
                </label>
                <span className="text-sm text-gray-500">or paste text below</span>
              </div>
              
              <Textarea
                placeholder="Paste your meeting transcript here... Include customer quotes, pain points they mentioned, goals they discussed, and any insights about their mindset."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[200px]"
              />
            </div>
            
            {transcript && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4" />
                <span>{transcript.length} characters</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-green-800 font-medium">
              🎯 Perfect! We've extracted key insights about your target customer including their core beliefs, 
              internal struggles, and desired transformations. This ICP profile will help create content that truly resonates.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={handleAnalyze}
          disabled={!transcript.trim() || isAnalyzing || hasAnalyzed}
          className="flex-1 bg-story-blue hover:bg-story-light-blue"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Transcript...
            </>
          ) : hasAnalyzed ? (
            'Analysis Complete ✓'
          ) : (
            'Extract ICP Insights'
          )}
        </Button>
        
        {hasAnalyzed && (
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        )}
        
        <Button variant="outline" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStepICP;
