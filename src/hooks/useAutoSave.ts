import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

interface AutoSaveOptions {
  key: string;
  data: any;
  enabled: boolean;
  debounceMs?: number;
}

interface SavedDraft {
  id: string;
  timestamp: string;
  data: any;
  label: string;
}

export const useAutoSave = ({ key, data, enabled, debounceMs = 2000 }: AutoSaveOptions) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [availableDrafts, setAvailableDrafts] = useState<SavedDraft[]>([]);

  const getDraftsKey = (baseKey: string) => `${baseKey}_drafts`;
  const getCurrentDraftKey = (baseKey: string) => `${baseKey}_current`;

  // Safe JSON parsing function
  const safeParse = (value: string | null): any => {
    if (!value || value === 'undefined' || value === 'null') {
      return null;
    }
    try {
      return JSON.parse(value);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return null;
    }
  };

  // Safe JSON stringifying function
  const safeStringify = (value: any): string => {
    if (value === undefined || value === null) {
      return '';
    }
    try {
      return JSON.stringify(value);
    } catch (error) {
      console.warn('Failed to stringify JSON:', error);
      return '';
    }
  };

  // Load available drafts
  const loadDrafts = useCallback(() => {
    const draftsJson = localStorage.getItem(getDraftsKey(key));
    const drafts = safeParse(draftsJson) || [];
    setAvailableDrafts(Array.isArray(drafts) ? drafts : []);
  }, [key]);

  // Save current data
  const saveData = useCallback(async () => {
    if (!enabled || !data) return;

    setIsSaving(true);
    try {
      // Save current draft
      const currentDraftData = safeStringify(data);
      if (currentDraftData) {
        localStorage.setItem(getCurrentDraftKey(key), currentDraftData);
      }

      // Create a timestamped draft
      const draft: SavedDraft = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        data: data,
        label: `Draft ${new Date().toLocaleString()}`
      };

      const existingDrafts = safeParse(localStorage.getItem(getDraftsKey(key))) || [];
      const drafts = Array.isArray(existingDrafts) ? existingDrafts : [];
      
      // Keep only last 5 drafts
      const updatedDrafts = [draft, ...drafts].slice(0, 5);
      
      const draftsJson = safeStringify(updatedDrafts);
      if (draftsJson) {
        localStorage.setItem(getDraftsKey(key), draftsJson);
      }

      setLastSaved(new Date());
      loadDrafts();
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsSaving(false);
    }
  }, [enabled, data, key, loadDrafts]);

  // Debounced save function
  const debouncedSave = useCallback(
    debounce(saveData, debounceMs),
    [saveData, debounceMs]
  );

  // Check for existing draft on mount
  useEffect(() => {
    if (!enabled) return;

    const currentDraft = safeParse(localStorage.getItem(getCurrentDraftKey(key)));
    if (currentDraft && Object.keys(currentDraft).length > 0) {
      setShowRestoreDialog(true);
    }
    loadDrafts();
  }, [enabled, key, loadDrafts]);

  // Auto-save when data changes
  useEffect(() => {
    if (!enabled || !data) return;
    debouncedSave();
  }, [data, enabled, debouncedSave]);

  // Restore draft
  const handleRestoreDraft = useCallback((draftData: any) => {
    setShowRestoreDialog(false);
    return draftData;
  }, []);

  // Delete draft
  const handleDeleteDraft = useCallback((draftId: string) => {
    const existingDrafts = safeParse(localStorage.getItem(getDraftsKey(key))) || [];
    const drafts = Array.isArray(existingDrafts) ? existingDrafts : [];
    const updatedDrafts = drafts.filter(draft => draft.id !== draftId);
    
    const draftsJson = safeStringify(updatedDrafts);
    if (draftsJson) {
      localStorage.setItem(getDraftsKey(key), draftsJson);
    } else {
      localStorage.removeItem(getDraftsKey(key));
    }
    loadDrafts();
  }, [key, loadDrafts]);

  // Clear current draft
  const clearCurrentDraft = useCallback(() => {
    localStorage.removeItem(getCurrentDraftKey(key));
    setShowRestoreDialog(false);
  }, [key]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      debouncedSave.cancel();
    };
  }, [debouncedSave]);

  return {
    isSaving,
    lastSaved,
    showRestoreDialog,
    setShowRestoreDialog,
    availableDrafts,
    handleRestoreDraft,
    handleDeleteDraft,
    clearCurrentDraft,
    loadDrafts
  };
};
