
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Sparkles, ArrowRight } from "lucide-react";
import { useOnboarding } from './OnboardingProvider';

interface OnboardingStepIdeasProps {
  onNavigateToIdeasBank: () => void;
}

const OnboardingStepIdeas: FC<OnboardingStepIdeasProps> = ({
  onNavigateToIdeasBank,
}) => {
  const { completeOnboarding } = useOnboarding();

  const handleGenerateIdeas = () => {
    completeOnboarding();
    onNavigateToIdeasBank();
  };

  return (
    <div className="space-y-6">
      <Card className="border-story-blue/20 bg-gradient-to-r from-story-blue/5 to-purple-50">
        <CardContent className="p-6 text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-story-blue/10 rounded-full">
              <Lightbulb className="h-8 w-8 text-story-blue" />
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              You're All Set! 🎉
            </h3>
            <p className="text-gray-600">
              Amazing! You've completed the setup. Now you have everything needed to generate 
              compelling content ideas that will resonate with your target audience.
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 space-y-3 text-left">
            <h4 className="font-medium text-gray-900">What you've set up:</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Your author profile with unique voice and expertise</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Your company context and value proposition</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Your target customer's mindset and pain points</span>
              </li>
            </ul>
          </div>

          <div className="pt-4">
            <Button 
              onClick={handleGenerateIdeas}
              className="w-full bg-gradient-to-r from-story-blue to-purple-600 hover:from-story-light-blue hover:to-purple-700 text-white"
              size="lg"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Mint Your First Ideas
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-gray-600 text-center">
            <strong>Pro tip:</strong> With all this context, our AI will generate ideas that feel like they came 
            from your brain - but ones you never would have thought of on your own! 
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingStepIdeas;
