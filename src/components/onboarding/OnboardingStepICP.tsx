
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Sparkles, Edit } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import TranscriptBasedICPCreator from '@/components/icp-scripts/TranscriptBasedICPCreator';

interface OnboardingStepICPProps {
  onICPAdded: (script: ICPStoryScript) => void;
  onNext: () => void;
  selectedClientId?: string;
}

const OnboardingStepICP: FC<OnboardingStepICPProps> = ({
  onICPAdded,
  onNext,
  selectedClientId,
}) => {
  const [hasCreatedICP, setHasCreatedICP] = useState(false);
  const [createdICP, setCreatedICP] = useState<ICPStoryScript | null>(null);
  const [showEditMode, setShowEditMode] = useState(false);

  const handleICPCreated = (script: ICPStoryScript) => {
    console.log('👥 ICP created in onboarding:', script.name || script.title);
    setCreatedICP(script);
    setHasCreatedICP(true);
    setShowEditMode(false);
    onICPAdded(script);
  };

  const handleNext = () => {
    if (!hasCreatedICP) return;
    onNext();
  };

  const handleEditICP = () => {
    setShowEditMode(true);
  };

  if (showEditMode) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-story-blue" />
            <CardTitle>Edit Target Audience Profile</CardTitle>
          </div>
          <CardDescription>
            Refine the audience analysis created by the Frayma AI Narrative Engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TranscriptBasedICPCreator
            onSave={handleICPCreated}
            onCancel={() => setShowEditMode(false)}
            selectedClientId={selectedClientId}
          />
        </CardContent>
      </Card>
    );
  }

  if (hasCreatedICP && createdICP) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-story-blue" />
              <CardTitle>Target Audience Profile Created!</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditICP}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <CardDescription>
            The Frayma AI Narrative Engine has analyzed your target audience. Review the insights below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-purple-600" />
              <h4 className="font-medium text-purple-800">Frayma AI Audience Analysis</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-purple-700">Target Audience:</span> {createdICP.name || createdICP.title}
              </div>
              {createdICP.description && (
                <div>
                  <span className="font-medium text-purple-700">Description:</span> {createdICP.description}
                </div>
              )}
              {createdICP.idealCustomerProfile && createdICP.idealCustomerProfile.length > 0 && (
                <div>
                  <span className="font-medium text-purple-700">Key Profile Points:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    {createdICP.idealCustomerProfile.slice(0, 3).map((point, index) => (
                      <li key={index} className="text-purple-600">{point.profile}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleNext}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            Complete Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-story-blue" />
          <CardTitle>Define Your Target Audience</CardTitle>
        </div>
        <CardDescription>
          Let the Frayma AI Narrative Engine analyze your ideal customer profile to create resonant messaging frameworks.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TranscriptBasedICPCreator
          onSave={handleICPCreated}
          onCancel={() => {}}
          selectedClientId={selectedClientId}
        />
      </CardContent>
    </Card>
  );
};

export default OnboardingStepICP;
