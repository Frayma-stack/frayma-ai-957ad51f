
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import TranscriptBasedICPCreator from '@/components/icp-scripts/TranscriptBasedICPCreator';

interface EnforcedOnboardingStepICPProps {
  onICPAdded: (script: ICPStoryScript) => void;
}

const EnforcedOnboardingStepICP: FC<EnforcedOnboardingStepICPProps> = ({
  onICPAdded,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleICPCreated = (script: ICPStoryScript) => {
    setIsCreating(true);
    try {
      onICPAdded(script);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-6 w-6 text-story-blue" />
          <CardTitle>Define Your Target Audience</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-green-600" />
            <h4 className="font-medium text-green-800">Frayma AI Audience Analysis</h4>
          </div>
          <p className="text-green-700 text-sm">
            Upload customer interview transcripts, sales calls, or feedback sessions. 
            Frayma AI will analyze them to identify your audience's core beliefs, pain points, 
            and desired transformations for highly targeted content.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Upload Transcripts For Analysis:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Customer interview transcripts</li>
            <li>• Sales call recordings (transcribed)</li>
            <li>• User feedback sessions</li>
            <li>• Support conversation logs</li>
            <li>• Market research interviews</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <TranscriptBasedICPCreator
            onSave={handleICPCreated}
            onCancel={() => {}}
            isLoading={isCreating}
            enforceCompletion={true}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepICP;
