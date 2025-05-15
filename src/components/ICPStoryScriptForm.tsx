
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript, ICPStoryScriptItem } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface ICPStoryScriptFormProps {
  onSave: (script: ICPStoryScript) => void;
  initialScript?: ICPStoryScript;
}

const createEmptyItem = (): ICPStoryScriptItem => ({
  id: crypto.randomUUID(),
  content: ''
});

const ICPStoryScriptForm: FC<ICPStoryScriptFormProps> = ({ onSave, initialScript }) => {
  const { toast } = useToast();
  const [script, setScript] = useState<ICPStoryScript>(
    initialScript || {
      id: crypto.randomUUID(),
      name: '',
      demographics: '',
      coreBeliefs: [createEmptyItem()],
      internalPains: [createEmptyItem()],
      externalStruggles: [createEmptyItem()],
      desiredTransformations: [createEmptyItem()]
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
    // Don't remove if it's the only item
    if (script[category].length <= 1) return;
    
    setScript(prev => ({
      ...prev,
      [category]: prev[category].filter(item => item.id !== id)
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!script.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this ICP StoryScript.",
        variant: "destructive"
      });
      return;
    }

    // Clean up empty items
    const cleanedScript = {
      ...script,
      coreBeliefs: script.coreBeliefs.filter(item => item.content.trim() !== ''),
      internalPains: script.internalPains.filter(item => item.content.trim() !== ''),
      externalStruggles: script.externalStruggles.filter(item => item.content.trim() !== ''),
      desiredTransformations: script.desiredTransformations.filter(item => item.content.trim() !== '')
    };

    // Ensure each category has at least one item (even if empty)
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

  const renderItemInputs = (
    category: 'coreBeliefs' | 'internalPains' | 'externalStruggles' | 'desiredTransformations',
    title: string,
    placeholder: string
  ) => {
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">{title}</label>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={() => addItem(category)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add
          </Button>
        </div>
        
        {script[category].map((item, index) => (
          <div key={item.id} className="flex gap-2 items-start">
            <Textarea 
              placeholder={`${placeholder} #${index + 1}`}
              value={item.content}
              onChange={(e) => handleItemChange(category, item.id, e.target.value)}
              rows={2}
              className="flex-1"
            />
            {script[category].length > 1 && (
              <Button 
                type="button"
                variant="ghost" 
                size="icon"
                onClick={() => removeItem(category, item.id)}
                className="mt-1"
              >
                <Trash className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">ICP StoryScript</CardTitle>
        <CardDescription>Define WHO you're writing for, WHAT they're battling with, and WHY they'd choose your product</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* WHO section */}
        <div className="space-y-4">
          <h3 className="font-medium text-story-blue">WHO</h3>
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
          
          {renderItemInputs('coreBeliefs', 'Core Beliefs', 'What belief do they hold?')}
        </div>

        {/* WHAT section */}
        <div className="space-y-4">
          <h3 className="font-medium text-story-blue">WHAT</h3>
          {renderItemInputs('internalPains', 'Internal Pains', 'What internal pain are they experiencing?')}
          {renderItemInputs('externalStruggles', 'External Struggles', 'What external struggle are they facing?')}
        </div>

        {/* WHY section */}
        <div className="space-y-4">
          <h3 className="font-medium text-story-blue">WHY</h3>
          {renderItemInputs('desiredTransformations', 'Desired Transformations', 'What transformation are they seeking?')}
        </div>

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
