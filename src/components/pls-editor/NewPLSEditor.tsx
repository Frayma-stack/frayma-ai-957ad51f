import { FC, useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  ArrowLeft, 
  Save, 
  Undo, 
  Redo,
  Copy,
  Loader2,
  Menu
} from 'lucide-react';
import { FormData } from '../gtm-narrative/useGTMNarrativeData';
import { AutoCraftingConfig } from '../gtm-narrative/outline/AutoCraftingReadinessDialog';
import EditorToolbar from './components/EditorToolbar';
import FloatingMenu from './components/FloatingMenu';
import ContextualMenu from './components/ContextualMenu';
import WordCounter from './components/WordCounter';
import './styles/editor.css';

interface NewPLSEditorProps {
  formData: FormData;
  autoCraftingConfig: AutoCraftingConfig;
  isGenerating: boolean;
  onDataChange: (field: keyof FormData, value: any) => void;
  onGeneratePhase: (phase: 'intro' | 'body' | 'conclusion') => Promise<void>;
  onBackToOutline: () => void;
  onSaveAsDraft: () => Promise<void>;
}

const NewPLSEditor: FC<NewPLSEditorProps> = ({
  formData,
  autoCraftingConfig,
  isGenerating,
  onDataChange,
  onGeneratePhase,
  onBackToOutline,
  onSaveAsDraft
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [selectedText, setSelectedText] = useState('');
  const [selectionPosition, setSelectionPosition] = useState<{ x: number; y: number } | null>(null);
  const [showContextualMenu, setShowContextualMenu] = useState(false);
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Combine all content into a single document
  const fullContent = [
    formData.generatedIntro || '',
    formData.generatedBody || '',
    formData.generatedConclusion || ''
  ].filter(section => section.trim()).join('\n\n');

  // Handle content changes
  const handleContentChange = (content: string) => {
    // Store current content in undo stack
    if (fullContent !== content) {
      setUndoStack(prev => [...prev, fullContent]);
      setRedoStack([]);
    }
    
    // Update the content directly - we'll handle section splitting elsewhere if needed
    onDataChange('generatedIntro', content);
    onDataChange('generatedBody', '');
    onDataChange('generatedConclusion', '');
    
    setHasUnsavedChanges(true);
  };

  // Handle text selection and show toolbar
  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelectedText(selection.toString());
      setSelectionPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
      setShowContextualMenu(true);
    } else {
      setSelectedText('');
      setSelectionPosition(null);
      setShowContextualMenu(false);
    }
  };

  // Handle input events to show toolbar while typing
  const handleEditorInput = (e: React.FormEvent<HTMLDivElement>) => {
    const content = e.currentTarget.textContent || '';
    handleContentChange(content);
    setShowToolbar(true);
  };

  // Handle editor focus
  const handleEditorFocus = () => {
    setShowToolbar(true);
  };

  const handleEditorBlur = () => {
    // Keep toolbar visible if there's selected text
    if (!selectedText) {
      setShowToolbar(false);
    }
  };

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 10000);
      return () => clearTimeout(autoSaveTimer);
    }
  }, [hasUnsavedChanges]);

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      await onSaveAsDraft();
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      toast({
        title: "Draft saved",
        description: "Your content has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Unable to save your draft. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousContent = undoStack[undoStack.length - 1];
      setRedoStack(prev => [fullContent, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      handleContentChange(previousContent);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextContent = redoStack[0];
      setUndoStack(prev => [...prev, fullContent]);
      setRedoStack(prev => prev.slice(1));
      handleContentChange(nextContent);
    }
  };

  const handleCopyEntireDraft = async () => {
    try {
      await navigator.clipboard.writeText(fullContent);
      toast({
        title: "Copied to clipboard",
        description: "Your entire draft has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const wordCount = fullContent.split(' ').filter(w => w.length > 0).length;
  const charCount = fullContent.length;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-auto">
      {/* Top Toolbar - Shows while typing or when text is selected */}
      {showToolbar && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-2xl mx-auto px-6 py-3">
            <div className="flex items-center justify-between">
              {/* Editing Icons - Faint opacity, clearer when text is selected */}
              <div className={`transition-opacity duration-200 ${selectedText ? 'opacity-100' : 'opacity-40'}`}>
                <EditorToolbar
                  selectedText={selectedText}
                  onTextUpdate={handleContentChange}
                />
              </div>
              
              {/* Undo/Redo and Word Counter */}
              <div className="flex items-center space-x-4">
                <WordCounter wordCount={wordCount} charCount={charCount} />
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleUndo}
                    disabled={undoStack.length === 0}
                  >
                    <Undo className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRedo}
                    disabled={redoStack.length === 0}
                  >
                    <Redo className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Editor Area */}
      <div className={`${showToolbar ? 'pt-16' : 'pt-6'} pb-6`}>
        <div className="max-w-4xl mx-auto px-6">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="ghost" onClick={onBackToOutline} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Outline
            </Button>
          </div>

          {/* Center-aligned Paper-like Editor */}
          <div className="max-w-2xl mx-auto bg-background shadow-lg rounded-lg border border-border min-h-[700px]">
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              className="pls-editor-content focus:outline-none p-12"
              style={{
                fontSize: '17px',
                fontFamily: 'Inter, sans-serif',
                fontWeight: 400,
                lineHeight: '24px',
                minHeight: '600px',
                whiteSpace: 'pre-wrap'
              }}
              onInput={handleEditorInput}
              onFocus={handleEditorFocus}
              onBlur={handleEditorBlur}
              onMouseUp={handleTextSelection}
              onKeyUp={handleTextSelection}
            >
              {fullContent}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Menu */}
      <FloatingMenu
        onAddHeading={(level) => {
          if (editorRef.current) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
              const range = selection.getRangeAt(0);
              const headingText = document.createTextNode(`\n\n${'#'.repeat(level)} New Heading\n\n`);
              range.insertNode(headingText);
              
              // Update content
              const newContent = editorRef.current.textContent || '';
              handleContentChange(newContent);
            }
          }
        }}
        onAddVisual={() => {
          const visualPlaceholder = '\n\n[Visual Placeholder - Add your image here]\n\n';
          handleContentChange(fullContent + visualPlaceholder);
        }}
        onRunAIChecks={() => {
          toast({
            title: "AI Checks",
            description: "Running comprehensive checks for grammar, Resonance, Relevance, and Results...",
          });
        }}
        onCopyDraft={handleCopyEntireDraft}
        isGenerating={isGenerating}
        showGTMControls={!autoCraftingConfig.isShortForm}
        onRegeneratePhase={() => {
          if (autoCraftingConfig.currentPhase) {
            onGeneratePhase(autoCraftingConfig.currentPhase);
          }
        }}
        onNextPhase={async () => {
          if (autoCraftingConfig.currentPhase === 'intro') {
            await onGeneratePhase('body');
          } else if (autoCraftingConfig.currentPhase === 'body') {
            await onGeneratePhase('conclusion');
          }
        }}
      />

      {/* Contextual Menu */}
      {showContextualMenu && selectionPosition && (
        <ContextualMenu
          position={selectionPosition}
          selectedText={selectedText}
          onClose={() => setShowContextualMenu(false)}
          onEdit={(newText) => {
            const updatedContent = fullContent.replace(selectedText, newText);
            handleContentChange(updatedContent);
            setShowContextualMenu(false);
          }}
          onAddComment={(comment) => {
            toast({
              title: "Comment added",
              description: `Comment: "${comment}" added to selected text.`,
            });
            setShowContextualMenu(false);
          }}
          autoCraftingConfig={autoCraftingConfig}
        />
      )}

      {/* Save Status */}
      <div className="fixed bottom-6 right-6">
        <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg px-4 py-2 shadow-lg">
          <div className="flex items-center space-x-3">
            <div className="text-sm text-muted-foreground">
              {isSaving ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Saving...
                </div>
              ) : hasUnsavedChanges ? (
                <span className="text-orange-600">Unsaved changes</span>
              ) : lastSaved ? (
                `Last saved: ${lastSaved.toLocaleTimeString()}`
              ) : (
                'All changes saved'
              )}
            </div>
            <Button
              onClick={handleSave}
              disabled={!hasUnsavedChanges || isSaving}
              size="sm"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPLSEditor;