
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Lightbulb } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Step Header */}
      <div className="border-l-4 border-story-blue pl-4">
        <h3 className="text-lg font-semibold text-story-blue flex items-center">
          <Lightbulb className="h-5 w-5 mr-2" />
          Strategic Foundation
        </h3>
        <p className="text-gray-600 text-sm mt-1">
          Define the strategic direction that will guide AI to create content aligned with your business goals and messaging strategy.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Core Idea/Trigger/Thesis *</label>
          <p className="text-xs text-gray-500 mb-2">
            The central concept that will anchor your AI-generated narrative
          </p>
          <Textarea 
            placeholder="What's the core idea, trigger, thesis, or antithesis prompting you to create this piece?"
            value={data.ideaTrigger}
            onChange={(e) => onDataChange('ideaTrigger', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Mutual Goal *</label>
          <p className="text-xs text-gray-500 mb-2">
            The shared objective between you and your audience
          </p>
          <Input 
            placeholder="What's the mutual goal for this piece?"
            value={data.mutualGoal}
            onChange={(e) => onDataChange('mutualGoal', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Main Target Keyword *</label>
          <p className="text-xs text-gray-500 mb-2">
            Primary keyword that will guide content optimization and discoverability
          </p>
          <Input 
            placeholder="Primary keyword or topic focus"
            value={data.targetKeyword}
            onChange={(e) => onDataChange('targetKeyword', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Content/Service/Product Cluster *</label>
          <p className="text-xs text-gray-500 mb-2">
            The business context that will shape your narrative positioning
          </p>
          <Input 
            placeholder="What content, service, or product cluster does this relate to?"
            value={data.contentCluster}
            onChange={(e) => onDataChange('contentCluster', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Publication Rationale *</label>
          <p className="text-xs text-gray-500 mb-2">
            The business case that will inform your content's strategic angle
          </p>
          <Textarea 
            placeholder="Why should you/your business publish this piece?"
            value={data.publishReason}
            onChange={(e) => onDataChange('publishReason', e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Desired Action *</label>
          <p className="text-xs text-gray-500 mb-2">
            The specific outcome that will guide your content's persuasive structure
          </p>
          <Input 
            placeholder="What action should readers take after reading?"
            value={data.callToAction}
            onChange={(e) => onDataChange('callToAction', e.target.value)}
          />
        </div>
      </div>

      {/* AI Guidance Preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">How this guides AI content creation:</h4>
        <ul className="text-xs text-blue-700 space-y-1">
          <li>• Your core idea shapes the narrative's central argument and flow</li>
          <li>• Mutual goals ensure content resonates with audience motivations</li>
          <li>• Target keywords optimize for discoverability and SEO performance</li>
          <li>• Business context aligns content with your strategic positioning</li>
        </ul>
      </div>
    </div>
  );
};

export default StrategicAlignmentStep;
