
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { CardFooter } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface ContentGenerationDisplayProps {
  contentType: 'email' | 'linkedin' | 'custom';
  generatedContent: string;
  onContentChange: (content: string) => void;
}

const ContentGenerationDisplay: FC<ContentGenerationDisplayProps> = ({
  contentType,
  generatedContent,
  onContentChange
}) => {
  const { toast } = useToast();

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(generatedContent);
    toast({
      title: "Copied to clipboard",
      description: `${getContentTypeLabel()} content has been copied to your clipboard.`
    });
  };

  if (!generatedContent) return null;

  return (
    <>
      <div className="mt-6 space-y-4">
        <h3 className="font-medium">Generated {getContentTypeLabel()}</h3>
        <Textarea 
          className="min-h-[300px] story-paper p-4"
          value={generatedContent}
          onChange={(e) => onContentChange(e.target.value)}
        />
      </div>
      
      <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2 w-full">
        <Button 
          className="flex-1 bg-story-blue hover:bg-story-light-blue"
          onClick={handleCopyContent}
        >
          Copy Content
        </Button>
        <Button variant="outline" className="flex-1">
          Export as Document
        </Button>
      </CardFooter>
    </>
  );
};

export default ContentGenerationDisplay;
