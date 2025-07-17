
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Sparkles, FileText, Mic } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import ICPStoryScriptForm from '@/components/ICPStoryScriptForm';
import ICPAudioUploadForm from '@/components/icp-scripts/ICPAudioUploadForm';

interface EnforcedOnboardingStepICPProps {
  onICPAdded: (script: ICPStoryScript) => void;
}

const EnforcedOnboardingStepICP: FC<EnforcedOnboardingStepICPProps> = ({
  onICPAdded,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [creationMethod, setCreationMethod] = useState<'manual' | 'upload'>('upload');

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
            Create your ICP StoryScript by uploading customer conversation recordings/transcripts 
            or building it manually. AI will extract key insights about your target audience.
          </p>
        </div>

        {/* Method Selection */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Choose Your Creation Method:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant={creationMethod === 'upload' ? 'default' : 'outline'}
              onClick={() => setCreationMethod('upload')}
              className="flex items-center gap-3 h-auto p-4 text-left"
            >
              <Mic className="h-5 w-5" />
              <div>
                <div className="font-medium">Upload Customer Conversation</div>
                <div className="text-sm opacity-70">Audio, transcript, or document</div>
              </div>
            </Button>
            <Button
              variant={creationMethod === 'manual' ? 'default' : 'outline'}
              onClick={() => setCreationMethod('manual')}
              className="flex items-center gap-3 h-auto p-4 text-left"
            >
              <FileText className="h-5 w-5" />
              <div>
                <div className="font-medium">Create Manually</div>
                <div className="text-sm opacity-70">Build step-by-step</div>
              </div>
            </Button>
          </div>
        </div>

        <div className="border rounded-lg p-6">
          {creationMethod === 'upload' ? (
            <ICPAudioUploadForm
              onScriptGenerated={handleICPCreated}
            />
          ) : (
            <ICPStoryScriptForm
              onSave={handleICPCreated}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepICP;
