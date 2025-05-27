
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, ICPStoryScriptItem } from '@/types/storytelling';
import ICPFormSection from './icp-scripts/ICPFormSection';
import ICPItemInputs from './icp-scripts/ICPItemInputs';

interface ICPStoryScriptFormProps {
  onSave: (script: ICPStoryScript) => void;
  initialScript?: ICPStoryScript;
  selectedClientId?: string;
}

const createEmptyItem = (): ICPStoryScriptItem => ({
  id: crypto.randomUUID(),
  content: ''
});

const ICPStoryScriptForm: FC<ICPStoryScriptFormProps> = ({ 
  onSave, 
  initialScript, 
  selectedClientId 
}) => {
  const { toast } = useToast();
  const [script, setScript] = useState<ICPStoryScript>(
    initialScript || {
      id: crypto.randomUUID(),
      name: '',
      demographics: '',
      coreBeliefs: [createEmptyItem()],
      internalPains: [createEmptyItem()],
      externalStruggles: [createEmptyItem()],
      desiredTransformations: [createEmptyItem()],
      clientId: selectedClientId
    }
  );

  const handleInputChange = (field: 'name' | 'demographics', value: string) => {
    setScript(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemChange = (
    category: 'coreBeliefs' | 'internalPains' | 'externalStruggles' | 'desiredTransformations',
    id: string,
    content: string
  ) => {
    setScript(prev => ({
      ...prev,
      [category]: prev[category].map(item => 
        item.id === id ? { ...item, content } : item
      )
    }));
  };

  const addItem = (category: 'coreBeliefs' | 'internalPains' | 'externalStruggles' | 'desiredTransformations') => {
    setScript(prev => ({
      ...prev,
      [category]: [...prev[category], createEmptyItem()]
    }));
  };

  const removeItem = (
    category: 'coreBeliefs' | 'internalPains' | 'externalStruggles' | 'desiredTransformations',
    id: string
  ) => {
    if (script[category].length <= 1) return;
    
    setScript(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const handleSubmit = () => {
    if (!script.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this ICP StoryScript.",
        variant: "destructive"
      });
      return;
    }

    const cleanedScript = {
      ...script,
      clientId: selectedClientId || script.clientId,
      coreBeliefs: script.coreBeliefs.filter(item => item.content.trim() !== ''),
      internalPains: script.internalPains.filter(item => item.content.trim() !== ''),
      externalStruggles: script.externalStruggles.filter(item => item.content.trim() !== ''),
      desiredTransformations: script.desiredTransformations.filter(item => item.content.trim() !== '')
    };

    // Ensure each category has at least one item
    if (cleanedScript.coreBeliefs.length === 0) cleanedScript.coreBeliefs = [createEmptyItem()];
    if (cleanedScript.internalPains.length === 0) cleanedScript.internalPains = [createEmptyItem()];
    if (cleanedScript.externalStruggles.length === 0) cleanedScript.externalStruggles = [createEmptyItem()];
    if (cleanedScript.desiredTransformations.length === 0) cleanedScript.desiredTransformations = [createEmptyItem()];

    onSave(cleanedScript);
    toast({
      title: "ICP StoryScript saved",
      description: `"${script.name}" has been saved successfully.`
    });
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">ICP StoryScript</CardTitle>
        <CardDescription>Define WHO you're writing for, WHAT they're battling with, and WHY they'd choose your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ICPFormSection title="WHO">
          <div className="space-y-2">
            <label className="text-sm font-medium">ICP Name/Role*</label>
            <Input 
              placeholder="e.g., SaaS Founder, CTO, CFO"
              value={script.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Demographics</label>
            <Textarea 
              placeholder="Describe the demographics of this persona"
              value={script.demographics}
              onChange={(e) => handleInputChange('demographics', e.target.value)}
              rows={3}
            />
          </div>
          
          <ICPItemInputs
            items={script.coreBeliefs}
            title="Core Beliefs"
            placeholder="What belief do they hold?"
            onItemChange={(id, content) => handleItemChange('coreBeliefs', id, content)}
            onAddItem={() => addItem('coreBeliefs')}
            onRemoveItem={(id) => removeItem('coreBeliefs', id)}
          />
        </ICPFormSection>

        <ICPFormSection title="WHAT">
          <ICPItemInputs
            items={script.internalPains}
            title="Internal Pains"
            placeholder="What internal pain are they experiencing?"
            onItemChange={(id, content) => handleItemChange('internalPains', id, content)}
            onAddItem={() => addItem('internalPains')}
            onRemoveItem={(id) => removeItem('internalPains', id)}
          />
          <ICPItemInputs
            items={script.externalStruggles}
            title="External Struggles"
            placeholder="What external struggle are they facing?"
            onItemChange={(id, content) => handleItemChange('externalStruggles', id, content)}
            onAddItem={() => addItem('externalStruggles')}
            onRemoveItem={(id) => removeItem('externalStruggles', id)}
          />
        </ICPFormSection>

        <ICPFormSection title="WHY">
          <ICPItemInputs
            items={script.desiredTransformations}
            title="Desired Transformations"
            placeholder="What transformation are they seeking?"
            onItemChange={(id, content) => handleItemChange('desiredTransformations', id, content)}
            onAddItem={() => addItem('desiredTransformations')}
            onRemoveItem={(id) => removeItem('desiredTransformations', id)}
          />
        </ICPFormSection>

        <Button 
          className="w-full bg-story-blue hover:bg-story-light-blue mt-4"
          onClick={handleSubmit}
        >
          Save ICP StoryScript
        </Button>
      </CardContent>
    </Card>
  );
};

export default ICPStoryScriptForm;
