
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Download, Save, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AutoSaveIndicator from '@/components/auto-save/AutoSaveIndicator';
import DraftRestoreDialog from '@/components/auto-save/DraftRestoreDialog';
import { ContentEditorWithFrayma } from '@/components/content-editor/ContentEditorWithFrayma';

interface ContentGenerationDisplayProps {
  content: string;
  onContentChange: (content: string) => void;
  contentType: string;
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
  contentType,
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
  const [showEditor, setShowEditor] = useState(false);

  console.log('📺 ContentGenerationDisplay render:', {
    hasContent: !!content,
    contentLength: content?.length || 0,
    isGenerating,
    contentPreview: content ? content.substring(0, 50) + '...' : 'No content',
    shouldShow: !!(content || isGenerating)
  });

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

  const handleOpenInEditor = () => {
    setShowEditor(true);
  };

  const handleBackFromEditor = () => {
    setShowEditor(false);
  };

  // If showing the Frayma Editor, render it instead
  if (showEditor && content) {
    return (
      <ContentEditorWithFrayma
        initialContent={content}
        contentType={contentType}
        contentTypeLabel={contentTypeLabel}
        onBack={handleBackFromEditor}
        onContentChange={onContentChange}
      />
    );
  }

  // Always show the component if generating or if there's content
  if (!content && !isGenerating) {
    console.log('📺 ContentGenerationDisplay: No content and not generating, not rendering');
    return null;
  }

  return (
    <>
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-brand-primary">
              {isGenerating ? `Auto-crafting ${contentTypeLabel}...` : `Auto-crafted ${contentTypeLabel}`}
            </CardTitle>
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
                  disabled={isGenerating}
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
            placeholder={isGenerating ? "Auto-crafting your content, please wait..." : `Your ${contentTypeLabel.toLowerCase()} will appear here...`}
            disabled={isGenerating}
          />
          
          {content && !isGenerating && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="default"
                size="sm"
                onClick={handleOpenInEditor}
                className="flex items-center gap-2 bg-brand-primary hover:bg-brand-primary/90"
              >
                <Edit3 className="h-4 w-4" />
                Open in Collaborative Editor
              </Button>

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

          {isGenerating && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center gap-3 text-gray-600">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-primary"></div>
                <span>Auto-crafting your {contentTypeLabel.toLowerCase()}...</span>
              </div>
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
