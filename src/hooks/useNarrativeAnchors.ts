
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
    console.log('🎯 useNarrativeAnchors - Updating available anchors for ICP:', selectedICP);
    
    if (selectedICP) {
      const script = scripts.find(script => script.id === selectedICP);
      if (script) {
        const options = [];
        
        if (script.coreBeliefs && script.coreBeliefs.some(item => item.content && item.content.trim())) {
          options.push({value: 'coreBeliefs', label: 'Core Belief'});
        }
        
        if (script.internalPains && script.internalPains.some(item => item.content && item.content.trim())) {
          options.push({value: 'internalPains', label: 'Internal Pain'});
        }
        
        if (script.externalStruggles && script.externalStruggles.some(item => item.content && item.content.trim())) {
          options.push({value: 'externalStruggles', label: 'External Struggle'});
        }
        
        if (script.desiredTransformations && script.desiredTransformations.some(item => item.content && item.content.trim())) {
          options.push({value: 'desiredTransformations', label: 'Desired Transformation'});
        }
        
        console.log('🎯 useNarrativeAnchors - Available options:', options);
        setAvailableAnchors(options);
        
        // Only auto-select if no selections exist and we have options
        if (narrativeSelections.length === 0 && options.length > 0) {
          console.log('🎯 useNarrativeAnchors - Auto-selecting first option');
          // Don't auto-select, let user choose
          // setNarrativeSelections([{ type: 'belief', itemId: '', content: '', items: [] }]);
        }
      } else {
        console.log('🎯 useNarrativeAnchors - No script found, clearing anchors');
        setAvailableAnchors([]);
      }
    } else {
      console.log('🎯 useNarrativeAnchors - No ICP selected, clearing anchors');
      setAvailableAnchors([]);
    }
  }, [selectedICP, scripts]); // Removed narrativeSelections.length and setNarrativeSelections from deps

  return { availableAnchors };
};
