import { useEffect } from 'react';
import { FormData } from './useGTMNarrativeData';
import { useToast } from "@/hooks/use-toast";

interface UseGTMAutoSaveProps {
  formData: FormData;
  contentPhase?: 'outline' | 'intro' | 'body' | 'conclusion' | 'editor';
  selectedClientId?: string;
  generatedContent?: string;
}

export const useGTMAutoSave = ({
  formData,
  contentPhase = 'outline',
  selectedClientId,
  generatedContent = ''
}: UseGTMAutoSaveProps) => {
  const { toast } = useToast();

  useEffect(() => {
    // Only auto-save when we have meaningful content
    const hasContent = Boolean(
      formData.selectedIdeaId ||
      formData.ideaTrigger ||
      formData.mutualGoal ||
      formData.targetKeyword ||
      formData.businessContextItem ||
      formData.narrativeAnchors?.length > 0 ||
      formData.outlineSections?.length > 0 ||
      formData.autoCraftingConfig ||
      generatedContent
    );

    if (!hasContent) return;

    const autoSaveData = {
      ...formData,
      generatedContent,
      contentPhase,
      selectedClientId,
      lastSaved: new Date().toISOString(),
      type: 'gtm_article'
    };

    // Debounced auto-save
    const timeoutId = setTimeout(() => {
      try {
        const autoSaveKey = `gtm_article_draft_${selectedClientId || 'default'}_${Date.now()}`;
        localStorage.setItem(autoSaveKey, JSON.stringify(autoSaveData));
        
        // Keep only the latest 3 drafts to avoid storage bloat
        const existingKeys = Object.keys(localStorage).filter(key => 
          key.startsWith(`gtm_article_draft_${selectedClientId || 'default'}_`)
        );
        
        if (existingKeys.length > 3) {
          // Sort by timestamp and remove oldest
          existingKeys.sort().slice(0, -3).forEach(key => {
            localStorage.removeItem(key);
          });
        }
      } catch (error) {
        console.error('Failed to auto-save GTM article draft:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, contentPhase, selectedClientId, generatedContent]);

  return {};
};