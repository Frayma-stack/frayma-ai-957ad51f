
import { useAuthorAnalysisHandler } from './useAuthorAnalysisHandler';

export const useAuthorAnalysisIntegration = (
  handleInputChange: (field: any, value: string) => void,
  setExperiencesFromAnalysis: (experiences: any[]) => void,
  setTonesFromAnalysis: (tones: any[]) => void,
  setBeliefsFromAnalysis: (beliefs: any[]) => void
) => {
  const { handleAuthorAnalysisResult } = useAuthorAnalysisHandler(
    (updater) => {
      if (typeof updater === 'function') {
        // This is a workaround since we can't directly access basicInfo state here
        // We'll update through individual field changes
        const mockBasicInfo = { role: '', organization: '', backstory: '' };
        const newBasicInfo = updater(mockBasicInfo as any);
        if (newBasicInfo.role) handleInputChange('role', newBasicInfo.role);
        if (newBasicInfo.organization) handleInputChange('organization', newBasicInfo.organization);
        if (newBasicInfo.backstory) handleInputChange('backstory', newBasicInfo.backstory);
      }
    },
    setExperiencesFromAnalysis,
    setTonesFromAnalysis,
    setBeliefsFromAnalysis
  );

  return { handleAuthorAnalysisResult };
};
