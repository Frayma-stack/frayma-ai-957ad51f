
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, Sparkles } from "lucide-react";

interface OnboardingStepIdeasProps {
  onNavigateToIdeasBank: () => void;
}

const OnboardingStepIdeas: FC<OnboardingStepIdeasProps> = ({
  onNavigateToIdeasBank,
}) => {
  const handleComplete = () => {
    console.log('🎯 Onboarding complete - navigating to ideas bank');
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
          Perfect! The Frayma AI Narrative Engine has analyzed your profile, business, and target audience. 
          Now you're ready to start generating amazing content ideas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
            <h4 className="font-medium text-green-800 text-lg">Frayma AI Setup Complete ✓</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-green-800 mb-1">Author Profile</div>
              <div className="text-green-700">Your unique voice and expertise captured by Frayma AI</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-blue-800 mb-1">Business Context</div>
              <div className="text-blue-700">Product features and market position analyzed by Frayma AI</div>
            </div>
            <div className="bg-white/50 rounded-lg p-3">
              <div className="font-medium text-purple-800 mb-1">Target Audience</div>
              <div className="text-purple-700">ICP insights and narrative anchors identified by Frayma AI</div>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-story-blue/10 rounded-lg p-4">
            <h4 className="font-medium text-story-blue mb-2">What happens next?</h4>
            <p className="text-sm text-gray-700">
              The Frayma AI Narrative Engine will use all your setup data to generate personalized, 
              compelling content ideas that resonate with your target audience and showcase your unique value proposition.
            </p>
          </div>
          
          <Button 
            onClick={handleComplete}
            size="lg"
            className="bg-story-blue hover:bg-story-light-blue text-white px-8 py-3 text-lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate Ideas with Frayma AI
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-xs text-gray-500">
            Your client is automatically selected and ready for content generation.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnboardingStepIdeas;
