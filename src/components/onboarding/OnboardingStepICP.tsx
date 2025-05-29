
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Upload, Plus, Sparkles, Edit } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import TranscriptBasedICPCreator from '@/components/icp-scripts/TranscriptBasedICPCreator';
import ICPCreationModeSelector from '@/components/icp-scripts/ICPCreationModeSelector';
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
  const [createdICP, setCreatedICP] = useState<ICPStoryScript | null>(null);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showEditMode, setShowEditMode] = useState(false);

  const handleICPCreated = (script: ICPStoryScript) => {
    const scriptWithClient = {
      ...script,
      clientId: clientId
    };
    setCreatedICP(scriptWithClient);
    setHasCreatedICP(true);
    setShowEditMode(false);
    onICPScriptAdded(scriptWithClient);
  };

  const handleNext = () => {
    if (!hasCreatedICP) {
      return;
    }
    onNext();
  };

  const handleManualModeSelect = (mode: 'manual' | 'ai') => {
    if (mode === 'manual') {
      setShowManualForm(true);
    }
  };

  const handleManualCancel = () => {
    setShowManualForm(false);
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
            Refine your ICP created by the Frayma AI Narrative Engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center space-x-2">
                <Upload className="h-4 w-4" />
                <span>Transcript Analysis</span>
              </TabsTrigger>
              <TabsTrigger value="manual" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Manual Entry</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload" className="mt-4">
              <TranscriptBasedICPCreator 
                onSave={handleICPCreated}
                onCancel={() => setShowEditMode(false)}
                selectedClientId={clientId}
                initialScript={createdICP}
              />
            </TabsContent>
            
            <TabsContent value="manual" className="mt-4">
              <div className="text-center p-4 border border-gray-200 rounded-lg">
                <p className="text-gray-600">Manual ICP creation form will be implemented here.</p>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEditMode(false)}
                  className="mt-2"
                >
                  Back
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
              <CardTitle>Target Audience Defined!</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditICP}>
              <Edit className="h-4 w-4 mr-2" />
              Edit ICP
            </Button>
          </div>
          <CardDescription>
            The Frayma AI Narrative Engine has analyzed and created your ICP script. Review the insights below.
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
                <span className="font-medium text-purple-700">ICP Name:</span> {createdICP.name}
              </div>
              <div>
                <span className="font-medium text-purple-700">Demographics:</span> {createdICP.demographics}
              </div>
              {createdICP.coreBeliefs && createdICP.coreBeliefs.length > 0 && (
                <div>
                  <span className="font-medium text-purple-700">Core Beliefs:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    {createdICP.coreBeliefs.slice(0, 2).map((belief) => (
                      <li key={belief.id} className="text-purple-600">{belief.content}</li>
                    ))}
                  </ul>
                </div>
              )}
              {createdICP.internalPains && createdICP.internalPains.length > 0 && (
                <div>
                  <span className="font-medium text-purple-700">Internal Pains:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    {createdICP.internalPains.slice(0, 2).map((pain) => (
                      <li key={pain.id} className="text-purple-600">{pain.content}</li>
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
            Continue to Ideas Generation
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
          Let the Frayma AI Narrative Engine analyze customer conversations to understand your audience's needs, pains, and desired transformations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h4 className="font-medium text-blue-800 mb-2">Frayma AI Narrative Engine</h4>
          <p className="text-sm text-blue-700">
            Our advanced engine analyzes customer interviews and conversations to extract deep insights about your target audience's beliefs, pains, and transformation goals.
          </p>
        </div>
        
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
                  Upload a customer interview or meeting transcript and let the Frayma AI Narrative Engine automatically extract ICP insights.
                </p>
              </div>
              <TranscriptBasedICPCreator 
                onSave={handleICPCreated}
                onCancel={() => {}}
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
              {showManualForm ? (
                <div className="text-center p-4 border border-gray-200 rounded-lg">
                  <p className="text-gray-600">Manual ICP creation form will be implemented here.</p>
                  <Button 
                    variant="outline" 
                    onClick={handleManualCancel}
                    className="mt-2"
                  >
                    Back to Mode Selection
                  </Button>
                </div>
              ) : (
                <ICPCreationModeSelector
                  onModeSelect={handleManualModeSelect}
                  onCancel={() => {}}
                />
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default OnboardingStepICP;
