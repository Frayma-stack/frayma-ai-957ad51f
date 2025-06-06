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
  // Check if a narrative anchor type is selected
  const isAnchorTypeSelected = (type: NarrativeAnchor) => {
    return narrativeSelections.some(selection => selection.type === type);
  };
  
  // Add or remove a narrative anchor type
  const toggleAnchorType = (type: NarrativeAnchor) => {
    if (isAnchorTypeSelected(type)) {
      setNarrativeSelections(narrativeSelections.filter(selection => selection.type !== type));
    } else {
      setNarrativeSelections([...narrativeSelections, { type, itemId: '', content: '', items: [] }]);
    }
  };

  // Toggle an item selection for a specific narrative anchor type
  const toggleItemSelection = (type: NarrativeAnchor, itemId: string) => {
    setNarrativeSelections(narrativeSelections.map(selection => {
      if (selection.type === type) {
        if (selection.items.includes(itemId)) {
          return { ...selection, items: selection.items.filter(id => id !== itemId) };
        } else {
          return { ...selection, items: [...selection.items, itemId] };
        }
      }
      return selection;
    }));
  };

  return {
    isAnchorTypeSelected,
    toggleAnchorType,
    toggleItemSelection
  };
};
