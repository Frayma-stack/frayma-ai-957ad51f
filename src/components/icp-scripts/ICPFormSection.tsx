
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ICPStoryScript } from '@/types/storytelling';
import { useToast } from "@/components/ui/use-toast";

interface ICPFormSectionProps {
  onICPScriptCreated: (script: ICPStoryScript) => void;
  selectedClientId: string;
}

const ICPFormSection: FC<ICPFormSectionProps> = ({
  onICPScriptCreated,
  selectedClientId
}) => {
  const [icpName, setIcpName] = useState('');
  const [demographics, setDemographics] = useState('');
  const [coreBeliefs, setCoreBeliefs] = useState<string[]>(['', '', '', '', '', '']);
  const [internalPains, setInternalPains] = useState<string[]>(['', '', '', '', '', '']);
  const [externalStruggles, setExternalStruggles] = useState<string[]>(['', '', '', '', '', '']);
  const [desiredTransformations, setDesiredTransformations] = useState<string[]>(['', '', '', '', '', '']);
  const { toast } = useToast();

  const updateArrayItem = (array: string[], index: number, value: string, setter: (arr: string[]) => void) => {
    const newArray = [...array];
    newArray[index] = value;
    setter(newArray);
  };

  const handleSubmit = () => {
    if (!icpName.trim() || !demographics.trim()) {
      toast({
        title: "Missing required fields",
        description: "Please fill in the ICP name and demographics.",
        variant: "destructive"
      });
      return;
    }

    const newScript: ICPStoryScript = {
      id: crypto.randomUUID(),
      name: icpName,
      demographics,
      coreBeliefs: coreBeliefs.filter(belief => belief.trim()).map(belief => ({
        id: crypto.randomUUID(),
        content: belief
      })),
      internalPains: internalPains.filter(pain => pain.trim()).map(pain => ({
        id: crypto.randomUUID(),
        content: pain
      })),
      externalStruggles: externalStruggles.filter(struggle => struggle.trim()).map(struggle => ({
        id: crypto.randomUUID(),
        content: struggle
      })),
      desiredTransformations: desiredTransformations.filter(transformation => transformation.trim()).map(transformation => ({
        id: crypto.randomUUID(),
        content: transformation
      })),
      clientId: selectedClientId
    };

    onICPScriptCreated(newScript);
    
    toast({
      title: "ICP Script Created",
      description: `ICP StoryScript for "${icpName}" has been created successfully.`
    });
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Manual ICP Creation</CardTitle>
        <CardDescription>
          Create your ICP StoryScript by manually entering the target audience details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="icp-name">ICP Name *</Label>
          <Input
            id="icp-name"
            placeholder="e.g., SaaS Founder, CTO, Marketing Director"
            value={icpName}
            onChange={(e) => setIcpName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="demographics">Demographics *</Label>
          <Textarea
            id="demographics"
            placeholder="Describe the demographics of your target audience (company size, role, industry, experience level, team structure)"
            value={demographics}
            onChange={(e) => setDemographics(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-4">
          <div>
            <Label>Core Beliefs</Label>
            <p className="text-sm text-gray-600 mb-2">What they believe about their industry, customers, processes, success</p>
            {coreBeliefs.map((belief, index) => (
              <Textarea
                key={index}
                placeholder={`Core belief ${index + 1}`}
                value={belief}
                onChange={(e) => updateArrayItem(coreBeliefs, index, e.target.value, setCoreBeliefs)}
                className="mb-2"
                rows={2}
              />
            ))}
          </div>

          <div>
            <Label>Internal Pains</Label>
            <p className="text-sm text-gray-600 mb-2">Emotional frustrations, confidence issues, stress points, personal challenges</p>
            {internalPains.map((pain, index) => (
              <Textarea
                key={index}
                placeholder={`Internal pain ${index + 1}`}
                value={pain}
                onChange={(e) => updateArrayItem(internalPains, index, e.target.value, setInternalPains)}
                className="mb-2"
                rows={2}
              />
            ))}
          </div>

          <div>
            <Label>External Struggles</Label>
            <p className="text-sm text-gray-600 mb-2">Operational challenges, resource constraints, market pressures, competitive issues</p>
            {externalStruggles.map((struggle, index) => (
              <Textarea
                key={index}
                placeholder={`External struggle ${index + 1}`}
                value={struggle}
                onChange={(e) => updateArrayItem(externalStruggles, index, e.target.value, setExternalStruggles)}
                className="mb-2"
                rows={2}
              />
            ))}
          </div>

          <div>
            <Label>Desired Transformations</Label>
            <p className="text-sm text-gray-600 mb-2">Goals they want to achieve, changes they seek, outcomes they desire</p>
            {desiredTransformations.map((transformation, index) => (
              <Textarea
                key={index}
                placeholder={`Desired transformation ${index + 1}`}
                value={transformation}
                onChange={(e) => updateArrayItem(desiredTransformations, index, e.target.value, setDesiredTransformations)}
                className="mb-2"
                rows={2}
              />
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!icpName.trim() || !demographics.trim()}
          className="w-full bg-story-blue hover:bg-story-light-blue"
        >
          Create ICP StoryScript
        </Button>
      </CardContent>
    </Card>
  );
};

export default ICPFormSection;
