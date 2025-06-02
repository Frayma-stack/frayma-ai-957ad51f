
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AutoSaveConfig {
  contentType: string;
  clientId?: string;
  authorId?: string;
  debounceMs?: number;
  enableAutoSave?: boolean;
}

interface DraftData {
  title: string;
  content: string;
  contentType: string;
  clientId?: string;
  authorId?: string;
}

export const useAutoSave = (config: AutoSaveConfig) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { enableAutoSave = true, debounceMs = 2000 } = config;

  // Create or update a draft
  const saveDraft = useCallback(async (data: DraftData) => {
    if (!user || !enableAutoSave) {
      console.log('⚠️ Auto-save skipped:', { hasUser: !!user, enableAutoSave });
      return null;
    }

    if (!data.content.trim()) {
      console.log('⚠️ Auto-save skipped: empty content');
      return null;
    }

    try {
      setIsSaving(true);
      console.log('💾 Starting auto-save:', {
        contentLength: data.content.length,
        hasCurrentDraftId: !!currentDraftId,
        contentType: data.contentType
      });
      
      const draftPayload = {
        title: data.title || 'Untitled Draft',
        content: data.content,
        content_type: data.contentType,
        client_id: data.clientId || null,
        author_id: data.authorId || null,
        user_id: user.id,
        created_by: user.email || 'Unknown User',
        last_edited_by: user.email || 'Unknown User',
        status: 'draft' as const
      };

      if (currentDraftId) {
        // Update existing draft
        const { error } = await supabase
          .from('drafts')
          .update({
            ...draftPayload,
            updated_at: new Date().toISOString()
          })
          .eq('id', currentDraftId);

        if (error) {
          console.error('❌ Auto-save update failed:', error);
          throw error;
        }
        console.log('✅ Draft updated successfully:', currentDraftId);
      } else {
        // Create new draft
        const { data: newDraft, error } = await supabase
          .from('drafts')
          .insert(draftPayload)
          .select('id')
          .single();

        if (error) {
          console.error('❌ Auto-save insert failed:', error);
          throw error;
        }
        if (newDraft) {
          setCurrentDraftId(newDraft.id);
          console.log('✅ New draft created:', newDraft.id);
        }
      }

      setLastSaved(new Date());
      return currentDraftId;
    } catch (error) {
      console.error('❌ Auto-save failed:', error);
      toast({
        title: "Auto-save failed",
        description: "Generated post could not be saved automatically. Please save manually.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSaving(false);
    }
  }, [user, currentDraftId, enableAutoSave, toast]);

  // Debounced save function
  const debouncedSave = useCallback((data: DraftData) => {
    if (!enableAutoSave || !data.content.trim()) {
      console.log('⚠️ Debounced save skipped:', { enableAutoSave, hasContent: !!data.content.trim() });
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      console.log('⏰ Debounced save executing...');
      saveDraft(data);
    }, debounceMs);
  }, [saveDraft, debounceMs, enableAutoSave]);

  // Load existing drafts for restoration
  const loadDrafts = useCallback(async () => {
    if (!user) return [];

    try {
      let query = supabase
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .eq('content_type', config.contentType)
        .order('updated_at', { ascending: false })
        .limit(5);

      // Only add client_id filter if it's provided and not null/undefined
      if (config.clientId) {
        query = query.eq('client_id', config.clientId);
      } else {
        query = query.is('client_id', null);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to load drafts:', error);
      return [];
    }
  }, [user, config.contentType, config.clientId]);

  // Clear current draft
  const clearDraft = useCallback(async () => {
    if (currentDraftId) {
      try {
        await supabase
          .from('drafts')
          .delete()
          .eq('id', currentDraftId);
        
        setCurrentDraftId(null);
        setLastSaved(null);
        console.log('🗑️ Draft cleared successfully');
      } catch (error) {
        console.error('Failed to clear draft:', error);
      }
    }
  }, [currentDraftId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    saveDraft: debouncedSave,
    loadDrafts,
    clearDraft,
    currentDraftId,
    isSaving,
    lastSaved,
    setCurrentDraftId
  };
};
