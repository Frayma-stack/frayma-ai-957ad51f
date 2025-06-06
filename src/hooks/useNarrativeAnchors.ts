
import { useState, useEffect } from 'react';
import { ICPStoryScript, NarrativeSelection } from '@/types/storytelling';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';

interface UseNarrativeAnchorsProps {
  selectedICP: string;
  scripts: ICPStoryScript[];
  narrativeSelections: NarrativeSelection[];
  setNarrativeSelections: (selections: NarrativeSelection[]) => void;
}

export const useNarrativeAnchors = ({
  selectedICP,
  scripts,
  narrativeSelections,
  setNarrativeSelections
}: UseNarrativeAnchorsProps) => {
  const [availableAnchors, setAvailableAnchors] = useState<{value: string, label: string}[]>([]);

  // Update available narrative anchors when ICP changes
  useEffect(() => {
    if (selectedICP) {
      const script = scripts.find(script => script.id === selectedICP);
      if (script) {
        const options = [];
        
        if (script.coreBeliefs.some(item => item.content.trim())) {
          options.push({value: 'belief', label: 'Core Belief'});
        }
        
        if (script.internalPains && script.internalPains.some(item => item.content.trim())) {
          options.push({value: 'pain', label: 'Internal Pain'});
        }
        
        if (script.externalStruggles && script.externalStruggles.some(item => item.content.trim())) {
          options.push({value: 'struggle', label: 'External Struggle'});
        }
        
        if (script.desiredTransformations && script.desiredTransformations.some(item => item.content.trim())) {
          options.push({value: 'transformation', label: 'Desired Transformation'});
        }
        
        setAvailableAnchors(options);
        
        if (narrativeSelections.length === 0) {
          const firstOption = options[0]?.value as NarrativeAnchor;
          if (firstOption) {
            setNarrativeSelections([{ type: firstOption, itemId: '', content: '', items: [] }]);
          }
        }
      }
    }
  }, [selectedICP, scripts, narrativeSelections.length, setNarrativeSelections]);

  return { availableAnchors };
};
