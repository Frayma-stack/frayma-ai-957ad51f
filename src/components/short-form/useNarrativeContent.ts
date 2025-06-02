
import { ICPStoryScript, NarrativeSelection } from '@/types/storytelling';

interface UseNarrativeContentProps {
  narrativeSelections: NarrativeSelection[];
  selectedICP: string;
  scripts: ICPStoryScript[];
}

export const useNarrativeContent = ({
  narrativeSelections,
  selectedICP,
  scripts
}: UseNarrativeContentProps) => {
  const getSelectedNarrativeContents = (): string[] => {
    const script = scripts.find(s => s.id === selectedICP);
    if (!script) return [];

    const contents: string[] = [];

    narrativeSelections.forEach(selection => {
      let items;
      switch (selection.type) {
        case 'belief':
          items = script.coreBeliefs || [];
          break;
        case 'pain':
          items = script.internalPains || [];
          break;
        case 'struggle':
          items = script.externalStruggles || [];
          break;
        case 'transformation':
          items = script.desiredTransformations || [];
          break;
        default:
          items = [];
      }

      selection.items.forEach(itemId => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          contents.push(item.content);
        }
      });
    });

    return contents;
  };

  return {
    getSelectedNarrativeContents
  };
};
