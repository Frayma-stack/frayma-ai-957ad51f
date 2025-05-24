
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, FileText, Edit } from 'lucide-react';

interface ContentEditorProps {
  initialContent: string;
  title: string;
  onBack?: () => void;
}

const ContentEditor: FC<ContentEditorProps> = ({ initialContent, title, onBack }) => {
  const [content, setContent] = useState(initialContent);
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Your content has been copied to your clipboard.",
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
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_').toLowerCase()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: "Your content is being downloaded as a text file.",
    });
  };

  return (
    <Card className="w-full bg-white shadow-md border border-gray-100">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <Edit className="h-5 w-5 text-brand-primary" />
          <CardTitle className="text-brand-primary font-sora">{title}</CardTitle>
        </div>
        {onBack && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[400px] text-sm font-mono"
          placeholder="Your generated content will appear here for editing..."
        />
        
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="flex-1" onClick={handleCopyToClipboard}>
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
          <Button variant="outline" className="flex-1" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download as Text
          </Button>
          <Button className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
            <FileText className="mr-2 h-4 w-4" />
            Save to Library
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentEditor;
