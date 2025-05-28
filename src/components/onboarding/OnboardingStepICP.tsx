
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Upload, Plus } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import TranscriptBasedICPCreator from '@/components/icp-scripts/TranscriptBasedICPCreator';
import ICPFormSection from '@/components/icp-scripts/ICPFormSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface OnboardingStepICPProps {
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onNext: () => void;
  clientId: string;
}

const OnboardingStepICP: FC<OnboardingStepICPProps> = ({
  onICPScriptAdded,
  onNext,
  clientId,
}) => {
  const [activeTab, setActiveTab] = useState('upload');
  const [hasCreatedICP, setHasCreatedICP] = useState(false);

  const handleICPCreated = (script: ICPStoryScript) => {
    const scriptWithClient = {
      ...script,
      clientId: clientId
    };
    onICPScriptAdded(scriptWithClient);
    setHasCreatedICP(true);
  };

  const handleNext = () => {
    if (!hasCreatedICP) {
      return;
    }
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Users className="h-5 w-5 text-story-blue" />
          <CardTitle>Define Your Target Audience</CardTitle>
        </div>
        <CardDescription>
          Create an ICP (Ideal Customer Profile) script to understand your audience's needs, pains, and desired transformations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upload" className="flex items-center space-x-2">
              <Upload className="h-4 w-4" />
              <span>Upload Transcript</span>
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Manual Entry</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="upload" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Auto-Extract from Meeting Transcript</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Upload a customer interview or meeting transcript to automatically extract ICP insights.
                </p>
              </div>
              <TranscriptBasedICPCreator 
                onICPScriptCreated={handleICPCreated}
                selectedClientId={clientId}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="manual" className="mt-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Manual ICP Creation</h4>
                <p className="text-sm text-gray-600 mb-4">
                  Manually enter your target audience information and insights.
                </p>
              </div>
              <ICPFormSection 
                onICPScriptCreated={handleICPCreated}
                selectedClientId={clientId}
              />
            </div>
          </TabsContent>
        </Tabs>

        {hasCreatedICP && (
          <div className="mt-6 pt-4 border-t">
            <Button 
              onClick={handleNext}
              className="w-full bg-story-blue hover:bg-story-light-blue"
            >
              Continue to Ideas Generation
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OnboardingStepICP;
