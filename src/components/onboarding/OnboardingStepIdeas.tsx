
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";

interface OnboardingStepIdeasProps {
  onNavigateToIdeasBank: () => void;
}

const OnboardingStepIdeas: FC<OnboardingStepIdeasProps> = ({
  onNavigateToIdeasBank,
}) => {
  const handleComplete = () => {
    onNavigateToIdeasBank();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-story-blue" />
          <CardTitle>You're All Set!</CardTitle>
        </div>
        <CardDescription>
          Perfect! You've set up your author profile, business information, and target audience. 
          Now you're ready to start generating amazing content ideas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-800 mb-2">Setup Complete ✓</h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• Author profile created with your unique voice</li>
            <li>• Business information added and analyzed</li>
            <li>• Target audience (ICP) insights captured</li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Your client is automatically selected and ready for content generation.
          </p>
          <Button 
            onClick={handleComplete}
            size="lg"
            className="bg-story-blue hover:bg-story-light-blue"
          >
            Mint New Narrative Ideas
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStepIdeas;
