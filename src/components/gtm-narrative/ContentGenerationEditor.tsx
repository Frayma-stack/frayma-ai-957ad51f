
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ArrowRight, Edit3, CheckCircle } from 'lucide-react';
import { FormData } from './useGTMNarrativeData';

interface ContentGenerationEditorProps {
  contentPhase: 'intro' | 'body' | 'conclusion';
  formData: FormData;
  isGenerating: boolean;
  onContentPhaseNext: () => void;
  onBackToOutline: () => void;
  onRegenerate: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
  onDataChange: (field: keyof FormData, value: any) => void;
}

const ContentGenerationEditor: FC<ContentGenerationEditorProps> = ({
  contentPhase,
  formData,
  isGenerating,
  onContentPhaseNext,
  onBackToOutline,
  onRegenerate,
  onDataChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const getPhaseColor = () => {
    switch (contentPhase) {
      case 'intro': return 'bg-blue-100 text-blue-800';
      case 'body': return 'bg-purple-100 text-purple-800';
      case 'conclusion': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseTitle = () => {
    switch (contentPhase) {
      case 'intro': return 'Introduction';
      case 'body': return 'Body Content';
      case 'conclusion': return 'Conclusion';
      default: return 'Content';
    }
  };

  const getPhaseDescription = () => {
    switch (contentPhase) {
      case 'intro': return 'Craft an engaging introduction that sets up your narrative';
      case 'body': return 'Develop the main content following your outline structure';
      case 'conclusion': return 'Create a compelling conclusion with clear call-to-action';
      default: return 'Generate content for this phase';
    }
  };

  const getCurrentContent = () => {
    switch (contentPhase) {
      case 'intro': return formData.introContent || '';
      case 'body': return formData.bodyContent || '';
      case 'conclusion': return formData.conclusionContent || '';
      default: return '';
    }
  };

  const handleContentChange = (content: string) => {
    const fieldMap = {
      intro: 'introContent',
      body: 'bodyContent',
      conclusion: 'conclusionContent'
    };
    onDataChange(fieldMap[contentPhase] as keyof FormData, content);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Content saved",
      description: "Your edits have been saved successfully."
    });
  };

  const handleRegenerate = () => {
    onRegenerate(contentPhase);
  };

  const canContinue = getCurrentContent().trim().length > 0;

  return (
    <div className="space-y-6">
      {/* Phase Header */}
      <div className="text-center space-y-2">
        <Badge className={`px-3 py-1 ${getPhaseColor()}`}>
          {getPhaseTitle()}
        </Badge>
        <h2 className="text-xl font-semibold text-story-blue">AI Content Generation</h2>
        <p className="text-sm text-gray-600 max-w-2xl mx-auto">{getPhaseDescription()}</p>
      </div>

      {/* Content Editor */}
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Generated Content</CardTitle>
            <div className="flex gap-2">
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  disabled={isGenerating || !getCurrentContent()}
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSave}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={handleRegenerate}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isGenerating ? 'animate-spin' : ''}`} />
                Regenerate
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isGenerating ? (
            <div className="flex items-center justify-center py-12 text-story-blue">
              <Loader2 className="h-6 w-6 animate-spin mr-3" />
              <span>AI is crafting your content...</span>
            </div>
          ) : (
            <Textarea
              value={getCurrentContent()}
              onChange={(e) => handleContentChange(e.target.value)}
              readOnly={!isEditing}
              className={`min-h-[300px] ${!isEditing ? 'bg-gray-50' : ''}`}
              placeholder="Generated content will appear here..."
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBackToOutline}>
          Back to Outline
        </Button>
        
        <Button 
          onClick={onContentPhaseNext}
          disabled={!canContinue || isGenerating}
          className="bg-story-blue hover:bg-story-light-blue"
        >
          {contentPhase === 'conclusion' ? 'Complete Draft' : 'Continue to Next Phase'}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ContentGenerationEditor;
