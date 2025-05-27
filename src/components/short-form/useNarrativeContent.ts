
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
  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getSelectedNarrativeContents = () => {
    const result: string[] = [];
    
    narrativeSelections.forEach(selection => {
      const items = getNarrativeItems(selection.type);
      selection.items.forEach(itemId => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          result.push(item.content);
        }
      });
    });
    
    return result;
  };

  const getNarrativeItems = (type: 'belief' | 'pain' | 'struggle' | 'transformation') => {
    const script = getSelectedICPScript();
    if (!script) return [];

    switch (type) {
      case 'belief':
        return script.coreBeliefs.map(item => ({ id: item.id, content: item.content }));
      case 'pain':
        return script.internalPains.map(item => ({ id: item.id, content: item.content }));
      case 'struggle':
        return script.externalStruggles.map(item => ({ id: item.id, content: item.content }));
      case 'transformation':
        return script.desiredTransformations.map(item => ({ id: item.id, content: item.content }));
      default:
        return [];
    }
  };

  return {
    getSelectedNarrativeContents,
    getNarrativeItems
  };
};
