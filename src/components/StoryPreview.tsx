
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StoryDetails } from './StoryForm';
import { useToast } from "@/components/ui/use-toast";
import ExportOptions from './ExportOptions';
import { Eye, EyeOff, Pencil, Save } from 'lucide-react';

interface StoryPreviewProps {
  storyDetails: StoryDetails | null;
}

const StoryPreview: FC<StoryPreviewProps> = ({ storyDetails }) => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const { toast } = useToast();

  const getPlaceholderText = () => {
    if (!storyDetails || !storyDetails.product) {
      return "Your story will appear here once you fill in your product details and click 'Update Story Framework'...";
    }

    return `As someone who ${storyDetails.targetAudience ? `works with ${storyDetails.targetAudience}` : 'has been in this field'}, I've always struggled with ${storyDetails.problem || 'common industry challenges'}.

I remember the frustration of trying different solutions that just didn't quite work. That's when I discovered ${storyDetails.product}.

${storyDetails.keyFeatures.length > 0 
  ? `What impressed me most was how it ${storyDetails.keyFeatures[0] || 'solved my main pain point'}${storyDetails.keyFeatures[1] ? `, ${storyDetails.keyFeatures[1]}` : ''}${storyDetails.keyFeatures[2] ? `, and even ${storyDetails.keyFeatures[2]}` : ''}.` 
  : ''}

${storyDetails.solution 
  ? `The way ${storyDetails.product} ${storyDetails.solution} completely changed my workflow.` 
  : ''}

${storyDetails.uniqueValue 
  ? `What makes ${storyDetails.product} truly special is that ${storyDetails.uniqueValue}.` 
  : ''}

If you've been facing similar challenges, I'd highly recommend giving ${storyDetails.product} a try. It made all the difference for me, and I'm confident it will for you too.`;
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
            <CardDescription>Edit or export your narrative</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleEditToggle}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportToggle}
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
            className="min-h-[300px] story-paper p-4 text-gray-700"
          />
        ) : (
          <div className="min-h-[300px] story-paper p-4 text-gray-700 whitespace-pre-wrap">
            {content || getPlaceholderText()}
          </div>
        )}
      </CardContent>
      {showExportOptions && (
        <CardFooter className="border-t pt-4 pb-2">
          <ExportOptions storyContent={content || getPlaceholderText()} />
        </CardFooter>
      )}
    </Card>
  );
};

export default StoryPreview;
