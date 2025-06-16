
import { useCallback } from 'react';
import { NarrativeSelection } from '@/types/storytelling';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';

interface UseNarrativeAnchorLogicProps {
  narrativeSelections: NarrativeSelection[];
  setNarrativeSelections: (selections: NarrativeSelection[]) => void;
}

export const useNarrativeAnchorLogic = ({
  narrativeSelections,
  setNarrativeSelections
}: UseNarrativeAnchorLogicProps) => {
  
  const toggleAnchorType = useCallback((type: NarrativeAnchor) => {
    console.log('🎯 Toggling anchor type:', type);
    console.log('🎯 Current selections:', narrativeSelections);
    
    const existingSelectionIndex = narrativeSelections.findIndex(s => s.type === type);
    
    if (existingSelectionIndex >= 0) {
      // Remove existing selection
      const updatedSelections = narrativeSelections.filter(s => s.type !== type);
      console.log('🎯 Removing selection, new array:', updatedSelections);
      setNarrativeSelections(updatedSelections);
    } else {
      // Add new selection
      const newSelection: NarrativeSelection = {
        type,
        itemId: '', // Keep for compatibility but items array is primary
        content: '', // Keep for compatibility 
        items: [] // This is what we actually use
      };
      const updatedSelections = [...narrativeSelections, newSelection];
      console.log('🎯 Adding selection, new array:', updatedSelections);
      setNarrativeSelections(updatedSelections);
    }
  }, [narrativeSelections, setNarrativeSelections]);

  const toggleItemSelection = useCallback((type: NarrativeAnchor, itemId: string) => {
    console.log('🎯 Toggling item selection:', { type, itemId });
    console.log('🎯 Current selections:', narrativeSelections);
    
    const updatedSelections = narrativeSelections.map(selection => {
      if (selection.type === type) {
        const currentItems = selection.items || [];
        const isCurrentlySelected = currentItems.includes(itemId);
        
        const newItems = isCurrentlySelected
          ? currentItems.filter(id => id !== itemId)
          : [...currentItems, itemId];
          
        console.log('🎯 Updated items for type', type, ':', newItems);
        
        return {
          ...selection,
          items: newItems
        };
      }
      return selection;
    });
    
    console.log('🎯 Updated selections:', updatedSelections);
    setNarrativeSelections(updatedSelections);
  }, [narrativeSelections, setNarrativeSelections]);

  return {
    toggleAnchorType,
    toggleItemSelection
  };
};
