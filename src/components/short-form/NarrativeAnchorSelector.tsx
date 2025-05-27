
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { List } from "lucide-react";
import { ICPStoryScript, NarrativeSelection } from '@/types/storytelling';

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';

interface NarrativeAnchorSelectorProps {
  selectedICP: string;
  scripts: ICPStoryScript[];
  narrativeSelections: NarrativeSelection[];
  availableAnchors: {value: string, label: string}[];
  onToggleAnchorType: (type: NarrativeAnchor) => void;
  onToggleItemSelection: (type: NarrativeAnchor, itemId: string) => void;
}

const NarrativeAnchorSelector: FC<NarrativeAnchorSelectorProps> = ({
  selectedICP,
  scripts,
  narrativeSelections,
  availableAnchors,
  onToggleAnchorType,
  onToggleItemSelection
}) => {
  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const isAnchorTypeSelected = (type: NarrativeAnchor) => {
    return narrativeSelections.some(selection => selection.type === type);
  };

  const getNarrativeItems = (type: NarrativeAnchor) => {
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

  const isItemSelected = (type: NarrativeAnchor, itemId: string) => {
    const selection = narrativeSelections.find(s => s.type === type);
    return selection ? selection.items.includes(itemId) : false;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center">
        <label className="text-sm font-medium">Narrative Anchors</label>
        <List className="ml-2 h-4 w-4 text-gray-400" />
      </div>
      
      {selectedICP ? (
        <>
          <div className="flex flex-wrap gap-2 mb-3">
            {availableAnchors.map(anchor => (
              <Button
                key={anchor.value}
                variant={isAnchorTypeSelected(anchor.value as NarrativeAnchor) ? "default" : "outline"}
                size="sm"
                onClick={() => onToggleAnchorType(anchor.value as NarrativeAnchor)}
                className={isAnchorTypeSelected(anchor.value as NarrativeAnchor) ? "bg-story-blue hover:bg-story-light-blue" : ""}
              >
                {anchor.label}
              </Button>
            ))}
          </div>
          
          {narrativeSelections.length > 0 ? (
            <div className="space-y-4">
              {narrativeSelections.map(selection => (
                <div key={selection.type} className="border rounded-md p-3 bg-gray-50">
                  <h4 className="font-medium mb-2">{
                    selection.type === 'belief' ? 'Core Beliefs' :
                    selection.type === 'pain' ? 'Internal Pains' :
                    selection.type === 'struggle' ? 'External Struggles' :
                    'Desired Transformations'
                  }</h4>
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {getNarrativeItems(selection.type).map(item => (
                      <div key={item.id} className="flex items-start gap-2">
                        <Checkbox 
                          id={`item-${item.id}`}
                          checked={isItemSelected(selection.type, item.id)}
                          onCheckedChange={() => onToggleItemSelection(selection.type, item.id)}
                        />
                        <label 
                          htmlFor={`item-${item.id}`}
                          className="text-sm cursor-pointer"
                        >
                          {item.content}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Select at least one narrative anchor type
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-4 text-gray-500">
          Select an ICP to see available narrative anchors
        </div>
      )}
    </div>
  );
};

export default NarrativeAnchorSelector;
