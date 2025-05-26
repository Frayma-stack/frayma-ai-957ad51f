
import { useToast } from "@/components/ui/use-toast";
import { AuthorExperience, AuthorToneItem, AuthorBelief } from '@/types/storytelling';

export const useAuthorAnalysisHandler = (
  handleInputChange: (field: any, value: string) => void,
  setExperiencesFromAnalysis: (experiences: AuthorExperience[]) => void,
  setTonesFromAnalysis: (tones: AuthorToneItem[]) => void,
  setBeliefsFromAnalysis: (beliefs: AuthorBelief[]) => void
) => {
  const { toast } = useToast();

  const handleAuthorAnalysisResult = (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: AuthorExperience[];
    tones?: AuthorToneItem[];
    beliefs?: AuthorBelief[];
  }) => {
    // Update basic info through individual field changes
    if (results.currentRole) handleInputChange('role', results.currentRole);
    if (results.organization) handleInputChange('organization', results.organization);
    if (results.backstory) handleInputChange('backstory', results.backstory);

    // Update arrays if provided
    if (results.experiences) setExperiencesFromAnalysis(results.experiences);
    if (results.tones) setTonesFromAnalysis(results.tones);
    if (results.beliefs) setBeliefsFromAnalysis(results.beliefs);

    // Show success message with what was extracted
    const extractedItems = [];
    if (results.currentRole) extractedItems.push('role');
    if (results.organization) extractedItems.push('organization');
    if (results.backstory) extractedItems.push('backstory');
    if (results.experiences && results.experiences.length > 0) extractedItems.push(`${results.experiences.length} experiences`);
    if (results.tones && results.tones.length > 0) extractedItems.push(`${results.tones.length} writing tones`);
    if (results.beliefs && results.beliefs.length > 0) extractedItems.push(`${results.beliefs.length} product beliefs`);
    
    if (extractedItems.length > 0) {
      toast({
        title: "Profile analysis complete!",
        description: `Successfully auto-filled: ${extractedItems.join(', ')}.`,
      });
    }
  };

  return {
    handleAuthorAnalysisResult
  };
};
