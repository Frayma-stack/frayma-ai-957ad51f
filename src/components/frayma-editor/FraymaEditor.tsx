
import React, { useState, useEffect, useCallback } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { EditorHeader } from './components/EditorHeader';
import { EditorTabs } from './components/EditorTabs';
import { OutlineSidebar } from './components/OutlineSidebar';
import { AISuggestionsSidebar } from './components/AISuggestionsSidebar';
import { EditorToolbar } from './components/EditorToolbar';
import { CollaborationProvider } from './components/CollaborationProvider';
import { CommentsSidebar } from './components/CommentsSidebar';
import { OnboardingModal } from './components/OnboardingModal';
import { useEditorExtensions } from './hooks/useEditorExtensions';
import { useAutoSave } from './hooks/useEditorAutoSave';
import { useCollaboration } from './hooks/useCollaboration';
import { FraymaDocument, EditorTab, UserRole } from './types';

interface FraymaEditorProps {
  documentId: string;
  document: FraymaDocument;
  userRole: UserRole;
  onSave?: (document: FraymaDocument) => void;
  onExport?: (format: 'markdown' | 'docx' | 'googledocs') => void;
}

export const FraymaEditor: React.FC<FraymaEditorProps> = ({
  documentId,
  document,
  userRole,
  onSave,
  onExport
}) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<EditorTab>('editor');
  const [showOutline, setShowOutline] = useState(true);
  const [showAISuggestions, setShowAISuggestions] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  // Initialize editor extensions
  const extensions = useEditorExtensions({
    documentId,
    userRole,
    onBlockSelect: setSelectedBlock
  });

  // Initialize TipTap editor
  const editor = useEditor({
    extensions,
    content: document.content,
    onUpdate: ({ editor }) => {
      // Auto-save trigger will handle this
    },
    editable: userRole !== 'viewer'
  });

  // Auto-save functionality
  const { isSaving, lastSaved } = useAutoSave({
    editor,
    documentId,
    document,
    onSave,
    interval: 10000 // 10 seconds
  });

  // Real-time collaboration
  const { 
    users, 
    comments, 
    addComment, 
    resolveComment, 
    replyToComment 
  } = useCollaboration({
    documentId,
    editor
  });

  // Handle AI suggestions
  const handleAISuggestion = useCallback(async (type: string, content: string) => {
    if (!editor) return;

    try {
      // This will integrate with your existing ChatGPT context
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          content,
          context: document.context
        })
      });

      const suggestion = await response.json();
      // Apply suggestion to editor
      editor.chain().focus().insertContent(suggestion.content).run();
      
      toast({
        title: "AI Suggestion Applied",
        description: "Content has been updated with AI suggestions."
      });
    } catch (error) {
      toast({
        title: "AI Suggestion Failed",
        description: "Unable to generate AI suggestions at this time.",
        variant: "destructive"
      });
    }
  }, [editor, document.context, toast]);

  const handleSectionClick = (sectionId: string) => {
    // Find the section in the outline and scroll to it
    const section = document.outline.find(s => s.id === sectionId);
    if (section && editor) {
      // Search for content matching the section title
      const content = editor.getHTML();
      // In a real implementation, you would have better positioning logic
      toast({
        title: "Section Navigation",
        description: `Navigating to ${section.title}`,
      });
    }
  };

  if (!editor) {
    return <div>Loading editor...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <CollaborationProvider documentId={documentId} editor={editor}>
        {/* Left Sidebar - Outline */}
        {showOutline && (
          <OutlineSidebar
            document={document}
            editor={editor}
            onSectionClick={handleSectionClick}
          />
        )}

        {/* Main Editor Area */}
        <div className="flex-1 flex flex-col">
          <EditorHeader
            document={document}
            isSaving={isSaving}
            lastSaved={lastSaved}
            users={users}
            onToggleOutline={() => setShowOutline(!showOutline)}
            onToggleAISuggestions={() => setShowAISuggestions(!showAISuggestions)}
            onToggleComments={() => setShowComments(!showComments)}
            onExport={onExport}
            onShowOnboarding={() => setShowOnboarding(true)}
          />

          <EditorTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {activeTab === 'editor' && (
            <div className="flex-1 flex">
              <div className="flex-1 p-6">
                <Card className="h-full p-6">
                  <EditorToolbar
                    editor={editor}
                    onAISuggestion={handleAISuggestion}
                    userRole={userRole}
                  />
                  <EditorContent 
                    editor={editor} 
                    className="prose prose-lg max-w-none min-h-[600px] focus:outline-none"
                  />
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'outline' && (
            <div className="flex-1 p-6">
              {/* Outline view component */}
            </div>
          )}

          {activeTab === 'visuals' && (
            <div className="flex-1 p-6">
              {/* Visuals management component */}
            </div>
          )}

          {activeTab === 'review' && (
            <div className="flex-1 p-6">
              {/* Review mode component */}
            </div>
          )}
        </div>

        {/* Right Sidebar - AI Suggestions */}
        {showAISuggestions && (
          <AISuggestionsSidebar
            editor={editor}
            selectedBlock={selectedBlock}
            document={document}
            onApplySuggestion={handleAISuggestion}
          />
        )}

        {/* Comments Sidebar */}
        {showComments && (
          <CommentsSidebar
            comments={comments}
            onAddComment={addComment}
            onResolveComment={resolveComment}
            onReplyToComment={replyToComment}
          />
        )}

        {/* Onboarding Modal */}
        {showOnboarding && (
          <OnboardingModal
            onClose={() => setShowOnboarding(false)}
          />
        )}
      </CollaborationProvider>
    </div>
  );
};
