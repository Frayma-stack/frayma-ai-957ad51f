
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sparkles } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import ICPStoryScriptForm from '@/components/ICPStoryScriptForm';

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
            Define your ideal customer profile by identifying their core beliefs, pain points, 
            and desired transformations for highly targeted content.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Define Your ICP:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Target audience demographics and role</li>
            <li>• Core beliefs they hold</li>
            <li>• Internal pains they experience</li>
            <li>• External struggles they face</li>
            <li>• Desired transformations they seek</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <ICPStoryScriptForm
            onSave={handleICPCreated}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepICP;
