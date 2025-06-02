
import { useState, useEffect, useCallback } from 'react';
import { useAutoSave } from './useAutoSave';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface AutoSaveIntegrationConfig {
  contentType: string;
  clientId?: string;
  authorId?: string;
  initialTitle?: string;
  initialContent?: string;
  onDraftRestored?: (title: string, content: string) => void;
}

export const useAutoSaveIntegration = (config: AutoSaveIntegrationConfig) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(config.initialTitle || '');
  const [content, setContent] = useState(config.initialContent || '');
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [availableDrafts, setAvailableDrafts] = useState<any[]>([]);

  const autoSave = useAutoSave({
    contentType: config.contentType,
    clientId: config.clientId,
    authorId: config.authorId
  });

  // Auto-save when content changes (with updated content tracking)
  useEffect(() => {
    console.log('💾 Auto-save effect triggered:', {
      hasTitle: !!title.trim(),
      hasContent: !!content.trim(),
      contentLength: content.length,
      contentType: config.contentType
    });

    if (content.trim()) {
      // Generate a title if one doesn't exist
      const autoTitle = title.trim() || `${config.contentType} - ${new Date().toLocaleDateString()}`;
      
      autoSave.saveDraft({
        title: autoTitle,
        content,
        contentType: config.contentType,
        clientId: config.clientId,
        authorId: config.authorId
      });
    }
  }, [content, title, config.contentType, config.clientId, config.authorId]);

  // Watch for content changes from parent component
  useEffect(() => {
    if (config.initialContent && config.initialContent !== content) {
      console.log('📝 Content updated from parent:', {
        newContentLength: config.initialContent.length,
        currentContentLength: content.length
      });
      setContent(config.initialContent);
    }
  }, [config.initialContent]);

  // Load available drafts on mount
  const loadAvailableDrafts = useCallback(async () => {
    const drafts = await autoSave.loadDrafts();
    setAvailableDrafts(drafts);
    
    // Auto-show restore dialog if there are drafts and current content is empty
    if (drafts.length > 0 && !title.trim() && !content.trim()) {
      setShowRestoreDialog(true);
    }
  }, [autoSave.loadDrafts, title, content]);

  useEffect(() => {
    loadAvailableDrafts();
  }, [loadAvailableDrafts]);

  const handleRestoreDraft = useCallback((draft: any) => {
    console.log('🔄 Restoring draft:', { draftId: draft.id, title: draft.title });
    setTitle(draft.title);
    setContent(draft.content);
    autoSave.setCurrentDraftId(draft.id);
    
    if (config.onDraftRestored) {
      config.onDraftRestored(draft.title, draft.content);
    }
  }, [autoSave.setCurrentDraftId, config.onDraftRestored]);

  const handleDeleteDraft = useCallback(async (draftId: string) => {
    if (!user) return;

    try {
      await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);
      
      // Reload drafts
      await loadAvailableDrafts();
    } catch (error) {
      console.error('Failed to delete draft:', error);
    }
  }, [user, loadAvailableDrafts]);

  const clearCurrentDraft = useCallback(async () => {
    console.log('🗑️ Clearing current draft');
    await autoSave.clearDraft();
    setTitle('');
    setContent('');
  }, [autoSave.clearDraft]);

  return {
    title,
    content,
    setTitle,
    setContent,
    isSaving: autoSave.isSaving,
    lastSaved: autoSave.lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft,
    loadAvailableDrafts
  };
};
