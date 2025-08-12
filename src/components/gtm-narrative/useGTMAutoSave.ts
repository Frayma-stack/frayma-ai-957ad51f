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
      formData.generatedIntro ||
      formData.generatedBody ||
      formData.generatedConclusion ||
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
        // Use a consistent key that includes the selected headline or timestamp for uniqueness
        const draftIdentifier = formData.selectedHeadline 
          ? formData.selectedHeadline.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')
          : Date.now().toString();
        const autoSaveKey = `gtm_article_draft_${selectedClientId || 'default'}_${draftIdentifier}`;
        
        localStorage.setItem(autoSaveKey, JSON.stringify(autoSaveData));
        
        // Keep only the latest 5 drafts to avoid storage bloat
        const existingKeys = Object.keys(localStorage).filter(key => 
          key.startsWith(`gtm_article_draft_${selectedClientId || 'default'}_`)
        );
        
        if (existingKeys.length > 5) {
          // Sort by timestamp (extract from key) and remove oldest
          existingKeys
            .sort((a, b) => {
              const timeA = a.split('_').pop() || '0';
              const timeB = b.split('_').pop() || '0';
              return parseInt(timeA) - parseInt(timeB);
            })
            .slice(0, -5)
            .forEach(key => {
              localStorage.removeItem(key);
            });
        }
        
        console.log('Auto-saved GTM draft:', autoSaveKey);
      } catch (error) {
        console.error('Failed to auto-save GTM article draft:', error);
      }
    }, 2000);

    return () => clearTimeout(timeoutId);
  }, [formData, contentPhase, selectedClientId, generatedContent]);

  return {};
};