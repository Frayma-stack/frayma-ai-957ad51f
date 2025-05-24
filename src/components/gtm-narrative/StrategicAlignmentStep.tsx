
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface StrategicAlignmentData {
  ideaTrigger: string;
  mutualGoal: string;
  targetKeyword: string;
  contentCluster: string;
  publishReason: string;
  callToAction: string;
}

interface StrategicAlignmentStepProps {
  data: StrategicAlignmentData;
  onDataChange: (field: keyof StrategicAlignmentData, value: string) => void;
}

const StrategicAlignmentStep: FC<StrategicAlignmentStepProps> = ({
  data,
  onDataChange
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-story-blue">Strategic Alignment</h3>
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Idea/Trigger/Thesis/Antithesis *</label>
        <Textarea 
          placeholder="What's the core idea, trigger, thesis, or antithesis prompting you to create this piece?"
          value={data.ideaTrigger}
          onChange={(e) => onDataChange('ideaTrigger', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Mutual Goal *</label>
        <Input 
          placeholder="What's the mutual goal for this piece?"
          value={data.mutualGoal}
          onChange={(e) => onDataChange('mutualGoal', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Main Target Keyword *</label>
        <Input 
          placeholder="Primary keyword or topic focus"
          value={data.targetKeyword}
          onChange={(e) => onDataChange('targetKeyword', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Content/Service/Product Cluster *</label>
        <Input 
          placeholder="What content, service, or product cluster does this relate to?"
          value={data.contentCluster}
          onChange={(e) => onDataChange('contentCluster', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Why Publish This? *</label>
        <Textarea 
          placeholder="Why should you/your business publish this piece?"
          value={data.publishReason}
          onChange={(e) => onDataChange('publishReason', e.target.value)}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Call to Action *</label>
        <Input 
          placeholder="What action should readers take after reading?"
          value={data.callToAction}
          onChange={(e) => onDataChange('callToAction', e.target.value)}
        />
      </div>
    </div>
  );
};

export default StrategicAlignmentStep;
