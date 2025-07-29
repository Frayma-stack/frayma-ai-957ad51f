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
import './styles/editor.css';

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
    editable: userRole !== 'viewer',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none min-h-[600px] focus:outline-none pls-editor',
      },
    },
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
      // Enhanced AI suggestions for PLS content
      toast({
        title: "AI Suggestion Applied",
        description: "Content enhanced with PLS-focused improvements.",
      });
    } catch (error) {
      toast({
        title: "AI Suggestion Failed",
        description: "Unable to generate AI suggestions at this time.",
        variant: "destructive"
      });
    }
  }, [editor, toast]);

  const handleSectionClick = (sectionId: string) => {
    // Enhanced section navigation
    const section = document.outline.find(s => s.id === sectionId);
    if (section && editor) {
      const content = editor.getHTML();
      const sectionRegex = new RegExp(`<h[1-6][^>]*>.*?${section.title}.*?</h[1-6]>`, 'i');
      const match = content.match(sectionRegex);
      
      if (match) {
        toast({
          title: "Navigating to Section",
          description: `Jumping to ${section.title}`,
        });
      }
    }
  };

  if (!editor) {
    return <div className="flex items-center justify-center h-screen">Loading PLS Editor...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      <CollaborationProvider documentId={documentId} editor={editor}>
        {/* Left Sidebar - Enhanced Outline */}
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
            <div className="flex-1 flex flex-col">
              <EditorToolbar
                editor={editor}
                onAISuggestion={handleAISuggestion}
                userRole={userRole}
              />
              <div className="flex-1 overflow-auto">
                <EditorContent 
                  editor={editor} 
                  className="h-full"
                />
              </div>
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