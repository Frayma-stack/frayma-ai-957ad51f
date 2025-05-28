
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AutoSaveIndicator from '@/components/auto-save/AutoSaveIndicator';
import DraftRestoreDialog from '@/components/auto-save/DraftRestoreDialog';

interface ContentGenerationDisplayProps {
  content: string;
  onContentChange: (content: string) => void;
  contentTypeLabel: string;
  isGenerating: boolean;
  isSaving?: boolean;
  lastSaved?: Date | null;
  showRestoreDialog?: boolean;
  availableDrafts?: any[];
  onSetShowRestoreDialog?: (show: boolean) => void;
  onRestoreDraft?: (draft: any) => void;
  onDeleteDraft?: (draftId: string) => void;
  onClearDraft?: () => void;
}

const ContentGenerationDisplay: FC<ContentGenerationDisplayProps> = ({
  content,
  onContentChange,
  contentTypeLabel,
  isGenerating,
  isSaving = false,
  lastSaved = null,
  showRestoreDialog = false,
  availableDrafts = [],
  onSetShowRestoreDialog,
  onRestoreDraft,
  onDeleteDraft,
  onClearDraft
}) => {
  const { toast } = useToast();

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: `${contentTypeLabel} content has been copied to your clipboard.`,
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
    element.download = `${contentTypeLabel.replace(/\s+/g, '_').toLowerCase()}_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    toast({
      title: "Download started",
      description: `Your ${contentTypeLabel.toLowerCase()} is being downloaded as a text file.`,
    });
  };

  if (!content && !isGenerating) {
    return null;
  }

  return (
    <>
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-brand-primary">Generated {contentTypeLabel}</CardTitle>
            <div className="flex items-center gap-2">
              <AutoSaveIndicator 
                isSaving={isSaving} 
                lastSaved={lastSaved} 
              />
              {availableDrafts.length > 0 && onSetShowRestoreDialog && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onSetShowRestoreDialog(true)}
                >
                  Restore Draft
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            className="min-h-[300px] font-mono text-sm"
            placeholder={isGenerating ? "Generating content..." : `Your ${contentTypeLabel.toLowerCase()} will appear here...`}
            disabled={isGenerating}
          />
          
          {content && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                className="flex items-center gap-2"
              >
                <Copy className="h-4 w-4" />
                Copy to Clipboard
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownload}
                className="flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Download
              </Button>

              {onClearDraft && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearDraft}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Clear Draft
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {onSetShowRestoreDialog && onRestoreDraft && onDeleteDraft && (
        <DraftRestoreDialog
          isOpen={showRestoreDialog}
          onClose={() => onSetShowRestoreDialog(false)}
          drafts={availableDrafts}
          onRestore={onRestoreDraft}
          onDelete={onDeleteDraft}
        />
      )}
    </>
  );
};

export default ContentGenerationDisplay;
