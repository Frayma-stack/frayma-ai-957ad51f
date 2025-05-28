
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Edit3, Brain, Upload } from "lucide-react";

interface ICPCreationModeSelectorProps {
  onModeSelect: (mode: 'manual' | 'ai') => void;
  onCancel: () => void;
}

const ICPCreationModeSelector: FC<ICPCreationModeSelectorProps> = ({
  onModeSelect,
  onCancel
}) => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Create ICP StoryScript</CardTitle>
        <CardDescription>
          Choose how you'd like to create your new ICP StoryScript
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Manual Creation Option */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-story-blue/50">
            <CardContent className="p-6" onClick={() => onModeSelect('manual')}>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Edit3 className="h-12 w-12 text-story-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Manual Input</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Fill out the ICP details manually using our guided form
                  </p>
                </div>
                <Button 
                  className="w-full bg-story-blue hover:bg-story-light-blue"
                  onClick={() => onModeSelect('manual')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Create Manually
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI-Powered Creation Option */}
          <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-story-blue/50">
            <CardContent className="p-6" onClick={() => onModeSelect('ai')}>
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <Brain className="h-12 w-12 text-story-blue" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">AI Analysis</h3>
                  <p className="text-sm text-gray-600 mt-2">
                    Upload meeting transcripts and let AI extract ICP insights automatically
                  </p>
                </div>
                <Button 
                  className="w-full bg-story-blue hover:bg-story-light-blue"
                  onClick={() => onModeSelect('ai')}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload & Analyze
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-center pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ICPCreationModeSelector;
