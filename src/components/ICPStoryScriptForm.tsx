
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript } from '@/types/storytelling';

interface ICPStoryScriptFormProps {
  onSave: (script: ICPStoryScript) => void;
  initialScript?: ICPStoryScript;
}

const ICPStoryScriptForm: FC<ICPStoryScriptFormProps> = ({ onSave, initialScript }) => {
  const { toast } = useToast();
  const [script, setScript] = useState<ICPStoryScript>(
    initialScript || {
      id: crypto.randomUUID(),
      name: '',
      demographics: '',
      coreBeliefs: '',
      internalPains: '',
      externalStruggles: '',
      desiredTransformations: ''
    }
  );

  const handleInputChange = (field: keyof ICPStoryScript, value: string) => {
    setScript(prev => ({
      ...prev,
      [field]: value
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

    onSave(script);
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
          <div className="space-y-2">
            <label className="text-sm font-medium">Core Beliefs</label>
            <Textarea 
              placeholder="What are their core beliefs and values?"
              value={script.coreBeliefs}
              onChange={(e) => handleInputChange('coreBeliefs', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* WHAT section */}
        <div className="space-y-4">
          <h3 className="font-medium text-story-blue">WHAT</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Internal Pains</label>
            <Textarea 
              placeholder="What internal pains are they experiencing?"
              value={script.internalPains}
              onChange={(e) => handleInputChange('internalPains', e.target.value)}
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">External Struggles</label>
            <Textarea 
              placeholder="What external struggles are they facing?"
              value={script.externalStruggles}
              onChange={(e) => handleInputChange('externalStruggles', e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* WHY section */}
        <div className="space-y-4">
          <h3 className="font-medium text-story-blue">WHY</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium">Desired Transformations</label>
            <Textarea 
              placeholder="What transformations are they seeking that your product/service provides?"
              value={script.desiredTransformations}
              onChange={(e) => handleInputChange('desiredTransformations', e.target.value)}
              rows={3}
            />
          </div>
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
