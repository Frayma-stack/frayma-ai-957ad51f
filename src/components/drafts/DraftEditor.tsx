
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Download, Copy } from 'lucide-react';

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

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'gtm-narrative': return 'GTM Narrative';
      case 'sales-email': return 'Sales Email';
      case 'linkedin-post': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drafts
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleCopyToClipboard}>
            <Copy className="h-4 w-4 mr-2" />
            Copy
          </Button>
          <Button variant="outline" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className="bg-brand-primary hover:bg-brand-primary/90"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Editor */}
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-brand-primary">Draft Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Title</label>
              <Input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Draft title..."
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Content Type</label>
              <Select value={contentType} onValueChange={handleContentTypeChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gtm-narrative">GTM Narrative</SelectItem>
                  <SelectItem value="sales-email">Sales Email</SelectItem>
                  <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
                  <SelectItem value="custom">Custom Content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Status</label>
              <Select value={status} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-review">In Review</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Editor */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Content</label>
            <Textarea
              value={content}
              onChange={(e) => handleContentChange(e.target.value)}
              className="min-h-[500px] font-mono text-sm"
              placeholder="Start writing your content here..."
            />
          </div>

          {/* Draft Info */}
          <div className="text-xs text-gray-500 border-t pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p>Created: {new Date(draft.createdAt).toLocaleString()}</p>
                <p>Created by: {draft.createdBy}</p>
              </div>
              <div>
                <p>Last updated: {new Date(draft.updatedAt).toLocaleString()}</p>
                {draft.lastEditedBy && (
                  <p>Last edited by: {draft.lastEditedBy}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DraftEditor;
