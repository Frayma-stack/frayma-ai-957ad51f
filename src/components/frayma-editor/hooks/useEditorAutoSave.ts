
import { useState, useEffect, useRef, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { FraymaDocument } from '../types';
import { useToast } from '@/hooks/use-toast';

interface UseEditorAutoSaveProps {
  editor: Editor | null;
  documentId: string;
  document: FraymaDocument;
  onSave?: (document: FraymaDocument) => void;
  interval?: number;
}

export const useAutoSave = ({
  editor,
  documentId,
  document,
  onSave,
  interval = 10000 // 10 seconds
}: UseEditorAutoSaveProps) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const autoSaveTimer = useRef<NodeJS.Timeout>();
  const lastContent = useRef<string>(document.content);

  const saveDocument = useCallback(async () => {
    if (!editor || !hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      const currentContent = editor.getHTML();
      const wordCount = editor.storage.characterCount?.words() || 0;
      const readingTime = Math.ceil(wordCount / 200); // Assume 200 WPM

      const updatedDocument: FraymaDocument = {
        ...document,
        content: currentContent,
        metadata: {
          ...document.metadata,
          wordCount,
          readingTime,
          lastEditedBy: 'current-user' // This would come from auth context
        },
        updatedAt: new Date().toISOString(),
        version: document.version + 1
      };

      // Save to local storage first (offline support)
      localStorage.setItem(`frayma-draft-${documentId}`, JSON.stringify(updatedDocument));

      // Call the save callback
      if (onSave) {
        await onSave(updatedDocument);
      }

      setLastSaved(new Date());
      setHasUnsavedChanges(false);
      lastContent.current = currentContent;

      console.log('Document auto-saved successfully');
    } catch (error) {
      console.error('Auto-save failed:', error);
      toast({
        title: "Auto-save failed",
        description: "Your changes are saved locally but couldn't sync to the server.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  }, [editor, document, documentId, hasUnsavedChanges, onSave, toast]);

  // Handle content changes
  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const currentContent = editor.getHTML();
      if (currentContent !== lastContent.current) {
        setHasUnsavedChanges(true);
        
        // Clear existing timer
        if (autoSaveTimer.current) {
          clearTimeout(autoSaveTimer.current);
        }

        // Set new auto-save timer
        autoSaveTimer.current = setTimeout(() => {
          saveDocument();
        }, interval);
      }
    };

    editor.on('update', handleUpdate);

    return () => {
      editor.off('update', handleUpdate);
      if (autoSaveTimer.current) {
        clearTimeout(autoSaveTimer.current);
      }
    };
  }, [editor, interval, saveDocument]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        // Attempt final save
        saveDocument();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges, saveDocument]);

  // Manual save function
  const manualSave = useCallback(() => {
    saveDocument();
  }, [saveDocument]);

  // Load from offline storage on mount
  useEffect(() => {
    const offlineData = localStorage.getItem(`frayma-draft-${documentId}`);
    if (offlineData && editor) {
      try {
        const savedDocument = JSON.parse(offlineData);
        // Only load if it's newer than current document
        if (new Date(savedDocument.updatedAt) > new Date(document.updatedAt)) {
          editor.commands.setContent(savedDocument.content);
          toast({
            title: "Offline changes restored",
            description: "Your offline changes have been restored.",
          });
        }
      } catch (error) {
        console.error('Failed to load offline data:', error);
      }
    }
  }, [documentId, document.updatedAt, editor, toast]);

  return {
    isSaving,
    lastSaved,
    hasUnsavedChanges,
    manualSave
  };
};
