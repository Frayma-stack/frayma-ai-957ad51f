
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Copy, Download, Share2 } from 'lucide-react';

interface ExportOptionsProps {
  storyContent: string;
}

const ExportOptions: FC<ExportOptionsProps> = ({ storyContent }) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(storyContent);
      toast({
        title: "Copied to clipboard",
        description: "Your story has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([storyContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'my-story.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "Your story is being downloaded as a text file.",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Story',
          text: storyContent,
        });
        toast({
          title: "Sharing initiated",
          description: "Share dialog opened.",
        });
      } catch (error) {
        toast({
          title: "Share failed",
          description: "Unable to open share dialog.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support the Web Share API.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full flex flex-wrap gap-3">
      <Button variant="outline" className="flex-1" onClick={handleCopyToClipboard}>
        <Copy className="mr-2 h-4 w-4" />
        Copy to Clipboard
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download as Text
      </Button>
      <Button variant="outline" className="flex-1" onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </Button>
    </div>
  );
};

export default ExportOptions;
