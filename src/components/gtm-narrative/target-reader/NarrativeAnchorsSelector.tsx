
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, X } from 'lucide-react';
import { ICPStoryScript } from '@/types/storytelling';

interface NarrativeAnchor {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
}

interface NarrativeAnchorsSelectorProps {
  narrativeAnchors: NarrativeAnchor[];
  selectedScript: ICPStoryScript | undefined;
  onAddNarrativeAnchor: (type: 'belief' | 'pain' | 'struggle' | 'transformation', itemId: string) => void;
  onRemoveNarrativeAnchor: (index: number) => void;
}

const NarrativeAnchorsSelector: FC<NarrativeAnchorsSelectorProps> = ({
  narrativeAnchors,
  selectedScript,
  onAddNarrativeAnchor,
  onRemoveNarrativeAnchor
}) => {
  if (!selectedScript) return null;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Narrative Anchors</label>
      <div className="space-y-3 border p-4 rounded-md bg-gray-50">
        <p className="text-sm text-gray-600">Select narrative elements from the ICP StoryScript to anchor your storytelling:</p>
        
        {['belief', 'pain', 'struggle', 'transformation'].map(type => (
          <div key={type} className="space-y-2">
            <h4 className="text-sm font-medium capitalize">
              {type === 'belief' ? 'Core Beliefs' : 
               type === 'pain' ? 'Internal Pains' : 
               type === 'struggle' ? 'External Struggles' : 
               'Desired Transformations'}
            </h4>
            <div className="grid gap-2">
              {(type === 'belief' ? selectedScript.coreBeliefs :
                type === 'pain' ? selectedScript.internalPains :
                type === 'struggle' ? selectedScript.externalStruggles :
                selectedScript.desiredTransformations).map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 border rounded text-sm">
                  <span>{item.content}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onAddNarrativeAnchor(type as any, item.id)}
                    disabled={narrativeAnchors.some(anchor => anchor.itemId === item.id)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Anchors */}
      {narrativeAnchors.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Narrative Anchors:</h4>
          <div className="space-y-2">
            {narrativeAnchors.map((anchor, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                <div>
                  <span className="text-xs font-semibold capitalize text-blue-700">{anchor.type}: </span>
                  <span className="text-sm">{anchor.content}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onRemoveNarrativeAnchor(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NarrativeAnchorsSelector;
