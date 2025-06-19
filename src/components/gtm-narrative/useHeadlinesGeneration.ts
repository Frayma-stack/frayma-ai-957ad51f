
import { useState } from 'react';
import { HeadlineOption, OutlineSection } from './useGTMNarrativeData';

interface UseHeadlinesGenerationProps {
  formData: any;
  onDataChange: (field: string, value: any) => void;
}

export const useHeadlinesGeneration = ({ formData, onDataChange }: UseHeadlinesGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateHeadlines = async () => {
    setIsGenerating(true);
    try {
      // Mock headline generation - replace with actual API call
      const mockHeadlines: HeadlineOption[] = [
        { id: '1', text: 'Transform Your Business with Product-Led Growth', isGenerated: true },
        { id: '2', text: 'The Complete Guide to Customer Success Stories', isGenerated: true },
        { id: '3', text: 'How to Build a Winning GTM Strategy', isGenerated: true }
      ];
      
      onDataChange('headlineOptions', mockHeadlines);
      
      // Mock outline sections with proper phase mapping and plsSteps
      const mockOutlineSections: OutlineSection[] = [
        {
          id: 'intro',
          type: 'H2',
          title: 'Introduction',
          phase: 'resonance',
          context: 'Opening hook and reader filter',
          linkedAssetType: undefined,
          linkedAssetId: undefined,
          plsSteps: 'PLS Steps 2-3'
        },
        {
          id: 'main-content',
          type: 'H2',
          title: 'Main Content',
          phase: 'relevance',
          context: 'Core value and insights',
          linkedAssetType: undefined,
          linkedAssetId: undefined,
          plsSteps: 'PLS Steps 4-6'
        },
        {
          id: 'results',
          type: 'H2',
          title: 'Results and Social Proof',
          phase: 'results',
          context: 'Success stories and proof points',
          linkedAssetType: 'success_story',
          linkedAssetId: undefined,
          plsSteps: 'PLS Steps 7-9'
        }
      ];
      
      onDataChange('outlineSections', mockOutlineSections);
      
    } catch (error) {
      console.error('Error generating headlines:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generateHeadlines
  };
};
