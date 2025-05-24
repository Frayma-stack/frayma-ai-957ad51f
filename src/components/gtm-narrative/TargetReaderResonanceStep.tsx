
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, X } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory } from '@/types/storytelling';

interface NarrativeAnchor {
  type: 'belief' | 'pain' | 'struggle' | 'transformation';
  itemId: string;
  content: string;
}

interface TargetReaderResonanceData {
  mainTargetICP: string;
  journeyStage: 'TOFU' | 'MOFU' | 'BOFU' | '';
  broaderAudience: string;
  readingPrompt: string;
  narrativeAnchors: NarrativeAnchor[];
  successStory: string;
}

interface TargetReaderResonanceStepProps {
  data: TargetReaderResonanceData;
  scripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  onDataChange: (field: keyof TargetReaderResonanceData, value: any) => void;
}

const TargetReaderResonanceStep: FC<TargetReaderResonanceStepProps> = ({
  data,
  scripts,
  successStories,
  onDataChange
}) => {
  const selectedScript = scripts.find(s => s.id === data.mainTargetICP);

  const addNarrativeAnchor = (type: 'belief' | 'pain' | 'struggle' | 'transformation', itemId: string) => {
    if (!selectedScript) return;

    let content = '';
    switch (type) {
      case 'belief':
        content = selectedScript.coreBeliefs.find(item => item.id === itemId)?.content || '';
        break;
      case 'pain':
        content = selectedScript.internalPains.find(item => item.id === itemId)?.content || '';
        break;
      case 'struggle':
        content = selectedScript.externalStruggles.find(item => item.id === itemId)?.content || '';
        break;
      case 'transformation':
        content = selectedScript.desiredTransformations.find(item => item.id === itemId)?.content || '';
        break;
    }

    const newAnchor = { type, itemId, content };
    onDataChange('narrativeAnchors', [...data.narrativeAnchors, newAnchor]);
  };

  const removeNarrativeAnchor = (index: number) => {
    onDataChange('narrativeAnchors', data.narrativeAnchors.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-story-blue">Target Reader Resonance</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Main Target ICP *</label>
        <Select 
          value={data.mainTargetICP} 
          onValueChange={(value) => onDataChange('mainTargetICP', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select the main ICP you're writing for" />
          </SelectTrigger>
          <SelectContent>
            {scripts.map(script => (
              <SelectItem key={script.id} value={script.id}>
                {script.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Customer Journey Stage *</label>
        <Select 
          value={data.journeyStage} 
          onValueChange={(value: 'TOFU' | 'MOFU' | 'BOFU') => onDataChange('journeyStage', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select journey stage" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TOFU">TOFU (Top of Funnel)</SelectItem>
            <SelectItem value="MOFU">MOFU (Middle of Funnel)</SelectItem>
            <SelectItem value="BOFU">BOFU (Bottom of Funnel)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Broader Audience</label>
        <Select 
          value={data.broaderAudience} 
          onValueChange={(value) => onDataChange('broaderAudience', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select broader audience who could find this valuable" />
          </SelectTrigger>
          <SelectContent>
            {scripts.filter(script => script.id !== data.mainTargetICP).map(script => (
              <SelectItem key={script.id} value={script.id}>
                {script.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Reading Prompt *</label>
        <Textarea 
          placeholder="What's likely to prompt the main target ICP to read this piece?"
          value={data.readingPrompt}
          onChange={(e) => onDataChange('readingPrompt', e.target.value)}
          rows={3}
        />
      </div>

      {/* Narrative Anchors */}
      {selectedScript && (
        <div className="space-y-2">
          <label className="text-sm font-medium">Narrative Anchors</label>
          <div className="space-y-3 border p-4 rounded-md bg-gray-50">
            <p className="text-sm text-gray-600">Select narrative elements from the ICP StoryScript to anchor your storytelling:</p>
            
            {['belief', 'pain', 'struggle', 'transformation'].map(type => (
              <div key={type} className="space-y-2">
                <h4 className="text-sm font-medium capitalize">{type === 'belief' ? 'Core Beliefs' : type === 'pain' ? 'Internal Pains' : type === 'struggle' ? 'External Struggles' : 'Desired Transformations'}</h4>
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
                        onClick={() => addNarrativeAnchor(type as any, item.id)}
                        disabled={data.narrativeAnchors.some(anchor => anchor.itemId === item.id)}
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
          {data.narrativeAnchors.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Selected Narrative Anchors:</h4>
              <div className="space-y-2">
                {data.narrativeAnchors.map((anchor, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div>
                      <span className="text-xs font-semibold capitalize text-blue-700">{anchor.type}: </span>
                      <span className="text-sm">{anchor.content}</span>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeNarrativeAnchor(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-sm font-medium">Success Story</label>
        <Select 
          value={data.successStory} 
          onValueChange={(value) => onDataChange('successStory', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a success story for social proof" />
          </SelectTrigger>
          <SelectContent>
            {successStories.map(story => (
              <SelectItem key={story.id} value={story.id}>
                {story.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default TargetReaderResonanceStep;
