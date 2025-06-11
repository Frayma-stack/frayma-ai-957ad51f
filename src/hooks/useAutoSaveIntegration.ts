
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

  const autoSaveKey = `${config.contentType}_${config.clientId || 'default'}_${config.authorId || 'default'}`;
  
  const autoSave = useAutoSave({
    key: autoSaveKey,
    data: {
      title,
      content,
      contentType: config.contentType,
      clientId: config.clientId,
      authorId: config.authorId
    },
    enabled: Boolean(content.trim() || title.trim()),
    debounceMs: 2000
  });

  // Watch for content changes from parent component
  useEffect(() => {
    if (config.initialContent !== undefined && config.initialContent !== content) {
      console.log('📝 Content updated from parent:', {
        newContentLength: config.initialContent.length,
        currentContentLength: content.length,
        newContentPreview: config.initialContent ? config.initialContent.substring(0, 50) + '...' : 'empty',
        shouldUpdate: config.initialContent !== content
      });
      setContent(config.initialContent);
    }
  }, [config.initialContent, content]);

  // Watch for title changes from parent component
  useEffect(() => {
    if (config.initialTitle !== undefined && config.initialTitle !== title) {
      console.log('📝 Title updated from parent:', {
        newTitle: config.initialTitle,
        currentTitle: title
      });
      setTitle(config.initialTitle);
    }
  }, [config.initialTitle, title]);

  // Load available drafts on mount
  const loadAvailableDrafts = useCallback(async () => {
    try {
      console.log('📝 Loading available drafts...');
      setAvailableDrafts(autoSave.availableDrafts || []);
      
      // Auto-show restore dialog if there are drafts and current content is empty
      if (autoSave.availableDrafts && autoSave.availableDrafts.length > 0 && !title.trim() && !content.trim()) {
        setShowRestoreDialog(true);
      }
    } catch (error) {
      console.error('❌ Failed to load drafts:', error);
    }
  }, [autoSave.availableDrafts, title, content]);

  useEffect(() => {
    loadAvailableDrafts();
  }, [loadAvailableDrafts]);

  const handleRestoreDraft = useCallback((draft: any) => {
    console.log('🔄 Restoring draft:', { draftId: draft.id, title: draft.title });
    setTitle(draft.title || '');
    setContent(draft.content || '');
    
    if (config.onDraftRestored) {
      config.onDraftRestored(draft.title || '', draft.content || '');
    }
  }, [config.onDraftRestored]);

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
    autoSave.clearCurrentDraft();
    setTitle('');
    setContent('');
  }, [autoSave]);

  return {
    title,
    content,
    setTitle,
    setContent,
    isSaving: autoSave.isSaving,
    lastSaved: autoSave.lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts: autoSave.availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft,
    loadAvailableDrafts
  };
};
