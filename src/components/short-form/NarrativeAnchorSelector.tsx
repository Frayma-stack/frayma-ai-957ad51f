
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
  console.log('🎯 NarrativeAnchorSelector - Debug info:', {
    selectedICP,
    availableAnchors,
    narrativeSelections,
    scriptsCount: scripts.length
  });

  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const isAnchorTypeSelected = (type: NarrativeAnchor) => {
    return narrativeSelections.some(selection => selection.type === type);
  };

  // Fix the narrative type mapping
  const getNarrativeItems = (type: NarrativeAnchor) => {
    const script = getSelectedICPScript();
    if (!script) {
      console.log('🎯 No script found for:', selectedICP);
      return [];
    }

    console.log('🎯 Getting narrative items for type:', type);
    
    let items;
    switch (type) {
      case 'belief':
        items = script.coreBeliefs?.map(item => ({ id: item.id, content: item.content })) || [];
        break;
      case 'pain':
        items = script.internalPains?.map(item => ({ id: item.id, content: item.content })) || [];
        break;
      case 'struggle':
        items = script.externalStruggles?.map(item => ({ id: item.id, content: item.content })) || [];
        break;
      case 'transformation':
        items = script.desiredTransformations?.map(item => ({ id: item.id, content: item.content })) || [];
        break;
      default:
        items = [];
    }
    
    console.log('🎯 Items found for type', type, ':', items);
    return items;
  };

  const isItemSelected = (type: NarrativeAnchor, itemId: string) => {
    const selection = narrativeSelections.find(s => s.type === type);
    return selection ? selection.items.includes(itemId) : false;
  };

  // Map anchor values to narrative types correctly
  const getTypeFromAnchorValue = (value: string): NarrativeAnchor => {
    const mapping: Record<string, NarrativeAnchor> = {
      'coreBeliefs': 'belief',
      'internalPains': 'pain', 
      'externalStruggles': 'struggle',
      'desiredTransformations': 'transformation'
    };
    
    console.log('🎯 Mapping anchor value to type:', { value, mapped: mapping[value] });
    return mapping[value] || 'belief';
  };

  const getLabelFromType = (type: NarrativeAnchor): string => {
    const labels: Record<NarrativeAnchor, string> = {
      'belief': 'Core Beliefs',
      'pain': 'Internal Pains',
      'struggle': 'External Struggles', 
      'transformation': 'Desired Transformations'
    };
    return labels[type];
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
            {availableAnchors.map(anchor => {
              const narrativeType = getTypeFromAnchorValue(anchor.value);
              const isSelected = isAnchorTypeSelected(narrativeType);
              
              console.log('🎯 Anchor button:', {
                anchorValue: anchor.value,
                narrativeType,
                isSelected,
                label: anchor.label
              });
              
              return (
                <Button
                  key={anchor.value}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => onToggleAnchorType(narrativeType)}
                  className={isSelected ? "bg-story-blue hover:bg-story-light-blue" : ""}
                >
                  {anchor.label}
                </Button>
              );
            })}
          </div>
          
          {narrativeSelections.length > 0 ? (
            <div className="space-y-4">
              {narrativeSelections.map(selection => (
                <div key={selection.type} className="border rounded-md p-3 bg-gray-50">
                  <h4 className="font-medium mb-2">{getLabelFromType(selection.type)}</h4>
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
