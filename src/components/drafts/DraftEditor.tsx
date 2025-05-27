
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DraftEditorHeader from './DraftEditorHeader';
import DraftMetaForm from './DraftMetaForm';
import DraftContentEditor from './DraftContentEditor';
import DraftInfoDisplay from './DraftInfoDisplay';

interface Draft {
  id: string;
  title: string;
  contentType: 'gtm-narrative' | 'sales-email' | 'linkedin-post' | 'custom';
  content: string;
  status: 'draft' | 'in-review' | 'completed';
  clientId: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy?: string;
}

interface DraftEditorProps {
  draft: Draft;
  onSave: (updatedDraft: Draft) => void;
  onBack: () => void;
}

const DraftEditor: FC<DraftEditorProps> = ({ draft, onSave, onBack }) => {
  const [title, setTitle] = useState(draft.title);
  const [content, setContent] = useState(draft.content);
  const [contentType, setContentType] = useState(draft.contentType);
  const [status, setStatus] = useState(draft.status);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  const handleContentTypeChange = (newType: string) => {
    setContentType(newType as Draft['contentType']);
    setHasChanges(true);
  };

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus as Draft['status']);
    setHasChanges(true);
  };

  const handleSave = () => {
    const updatedDraft: Draft = {
      ...draft,
      title,
      content,
      contentType,
      status,
      updatedAt: new Date().toISOString(),
      lastEditedBy: 'Current User'
    };

    onSave(updatedDraft);
    setHasChanges(false);
    
    toast({
      title: "Draft Saved",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Draft content has been copied to your clipboard.",
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
      description: "Your draft is being downloaded as a text file.",
    });
  };

  return (
    <div className="space-y-6">
      <DraftEditorHeader
        hasChanges={hasChanges}
        onBack={onBack}
        onSave={handleSave}
        onCopy={handleCopyToClipboard}
        onDownload={handleDownload}
      />

      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-brand-primary">Draft Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <DraftMetaForm
            title={title}
            contentType={contentType}
            status={status}
            onTitleChange={handleTitleChange}
            onContentTypeChange={handleContentTypeChange}
            onStatusChange={handleStatusChange}
          />

          <DraftContentEditor
            content={content}
            onContentChange={handleContentChange}
          />

          <DraftInfoDisplay draft={draft} />
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftEditor;
