
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ExportOptions from './ExportOptions';
import { Eye, EyeOff, Pencil, Save } from 'lucide-react';
import { ICPStoryScript, StoryBrief } from '@/types/storytelling';

interface EnhancedStoryPreviewProps {
  selectedBrief: StoryBrief | null;
  scripts: ICPStoryScript[];
}

const EnhancedStoryPreview: FC<EnhancedStoryPreviewProps> = ({ selectedBrief, scripts }) => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const { toast } = useToast();

  // Get the full ICP script object based on the brief's targetAudience ID
  const getTargetScript = () => {
    if (!selectedBrief) return null;
    return scripts.find(script => script.id === selectedBrief.targetAudience) || null;
  };

  const targetScript = getTargetScript();

  useEffect(() => {
    // When a new brief is selected, generate placeholder content
    if (selectedBrief && targetScript) {
      setContent(''); // Reset current content
    }
  }, [selectedBrief]);

  const getPlaceholderText = () => {
    if (!selectedBrief || !targetScript) {
      return "Select a Story Brief to preview your narrative framework...";
    }

    // Get the anchoring element details from the selected elements
    const getAnchoringDetails = () => {
      if (!selectedBrief.anchoringElements || selectedBrief.anchoringElements.length === 0) {
        return "the unique challenges in my role";
      }

      // Get details from the first anchoring element for simplicity
      // In a more advanced implementation, you could combine multiple elements
      const element = selectedBrief.anchoringElements[0];
      
      let anchoringItem = null;
      switch(element.type) {
        case 'belief': 
          anchoringItem = targetScript.coreBeliefs.find(item => item.id === element.itemId);
          break;
        case 'pain': 
          anchoringItem = targetScript.internalPains.find(item => item.id === element.itemId);
          break;
        case 'struggle': 
          anchoringItem = targetScript.externalStruggles.find(item => item.id === element.itemId);
          break;
        case 'transformation': 
          anchoringItem = targetScript.desiredTransformations.find(item => item.id === element.itemId);
          break;
      }
      
      return anchoringItem ? anchoringItem.content : "the unique challenges in my role";
    };

    // Format the outline steps as a narrative
    const formatOutline = () => {
      const nonEmptySteps = selectedBrief.outlineSteps.filter(step => step.trim() !== '');
      if (nonEmptySteps.length === 0) return "";
      
      return nonEmptySteps.join('\n\n');
    };

    // Create a cohesive narrative based on the brief and ICP script
    return `[Title suggestion: Address ${selectedBrief.targetKeyword || 'Your Main Topic'} for ${targetScript.name}]

As ${targetScript.name}, ${getAnchoringDetails()}.

${selectedBrief.successStory || 'Here I would share a specific story about how this challenge affected me or my organization.'}

${formatOutline()}

${selectedBrief.callToAction ? `${selectedBrief.callToAction}` : 'I recommend taking action now to address these challenges.'}`;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      toast({
        title: "Story saved",
        description: "Your narrative has been saved.",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleExportToggle = () => {
    setShowExportOptions(!showExportOptions);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-story-blue">Your Story Preview</CardTitle>
            <CardDescription>
              {selectedBrief 
                ? `Story brief: ${selectedBrief.title}` 
                : "Select a brief to preview your story framework"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleEditToggle}
              disabled={!selectedBrief}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportToggle}
              disabled={!selectedBrief}
            >
              {showExportOptions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea 
            value={content || getPlaceholderText()}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[400px] story-paper p-4 text-gray-700"
          />
        ) : (
          <div className="min-h-[400px] story-paper p-4 text-gray-700 whitespace-pre-wrap">
            {content || getPlaceholderText()}
          </div>
        )}
      </CardContent>
      {showExportOptions && selectedBrief && (
        <CardFooter className="border-t pt-4 pb-2">
          <ExportOptions storyContent={content || getPlaceholderText()} />
        </CardFooter>
      )}
    </Card>
  );
};

export default EnhancedStoryPreview;
