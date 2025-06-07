
import React, { useState, useEffect } from 'react';
import { FraymaEditor } from '@/components/frayma-editor/FraymaEditor';
import { FraymaDocument, UserRole } from '@/components/frayma-editor/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentEditorWithFraymaProps {
  initialContent: string;
  contentType: string;
  contentTypeLabel: string;
  onBack: () => void;
  onContentChange?: (content: string) => void;
}

export const ContentEditorWithFrayma: React.FC<ContentEditorWithFraymaProps> = ({
  initialContent,
  contentType,
  contentTypeLabel,
  onBack,
  onContentChange
}) => {
  const { toast } = useToast();
  const [document, setDocument] = useState<FraymaDocument>(() => {
    return {
      id: `${contentType}-${Date.now()}`,
      title: `${contentTypeLabel} - ${new Date().toLocaleDateString()}`,
      content: initialContent,
      outline: [
        {
          id: 'main-content',
          type: 'paragraph',
          title: 'Main Content',
          content: initialContent,
          order: 1
        }
      ],
      context: {
        storyBrief: `Auto-crafted ${contentTypeLabel.toLowerCase()}`,
        narrativeAnchors: [],
        targetAudience: 'Professional audience',
        authorVoice: {
          tone: 'Professional',
          experiences: [],
          beliefs: []
        },
        productContext: {
          features: [],
          useCases: [],
          differentiators: []
        }
      },
      metadata: {
        wordCount: initialContent.split(' ').length,
        readingTime: Math.ceil(initialContent.split(' ').length / 200),
        lastEditedBy: 'Current User',
        tags: [contentType, 'auto-crafted']
      },
      collaborators: [],
      comments: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  const handleSave = (updatedDocument: FraymaDocument) => {
    setDocument(updatedDocument);
    if (onContentChange) {
      onContentChange(updatedDocument.content);
    }
    
    toast({
      title: "Content Saved",
      description: "Your content has been saved successfully.",
    });
  };

  const handleExport = (format: 'markdown' | 'docx' | 'googledocs') => {
    toast({
      title: "Export Started",
      description: `Exporting content as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Generator</span>
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              <h1 className="text-xl font-semibold">{contentTypeLabel} Editor</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Frayma Editor */}
      <div className="flex-1">
        <FraymaEditor
          documentId={document.id}
          document={document}
          userRole="owner"
          onSave={handleSave}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};
