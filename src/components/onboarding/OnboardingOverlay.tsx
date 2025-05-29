
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { X, User, Building, Users, Lightbulb } from "lucide-react";
import { useOnboarding } from './OnboardingProvider';
import OnboardingStepAuthor from './OnboardingStepAuthor';
import OnboardingStepClient from './OnboardingStepClient';
import OnboardingStepICP from './OnboardingStepICP';
import OnboardingStepIdeas from './OnboardingStepIdeas';
import { Author, Client, ProductContext, ICPStoryScript } from '@/types/storytelling';

interface OnboardingOverlayProps {
  onAuthorAdded: (author: Author) => void;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onNavigateToIdeasBank: () => void;
}

const OnboardingOverlay: FC<OnboardingOverlayProps> = ({
  onAuthorAdded,
  onClientAdded,
  onICPScriptAdded,
  onNavigateToIdeasBank,
}) => {
  const { isOnboarding, currentStep, totalSteps, nextStep, skipOnboarding } = useOnboarding();
  const [createdClientId, setCreatedClientId] = useState<string | null>(null);

  if (!isOnboarding) return null;

  const handleClientAdded = (client: Client, productContext?: ProductContext) => {
    setCreatedClientId(client.id);
    onClientAdded(client, productContext);
  };

  const steps = [
    {
      title: "Add Yourself as an Author",
      description: "Set up your author profile using your social links for authentic content creation",
      icon: User,
      component: <OnboardingStepAuthor onAuthorAdded={onAuthorAdded} onNext={nextStep} />
    },
    {
      title: "Add Your Business",
      description: "Tell us about your company or client to generate relevant content",
      icon: Building,
      component: <OnboardingStepClient onClientAdded={handleClientAdded} onNext={nextStep} />
    },
    {
      title: "Define Your Target Audience",
      description: "Create your ICP (Ideal Customer Profile) through transcript analysis or manual entry",
      icon: Users,
      component: (
        <OnboardingStepICP 
          onICPAdded={onICPScriptAdded} 
          onNext={nextStep}
          selectedClientId={createdClientId || ''}
        />
      )
    },
    {
      title: "Start Creating Content",
      description: "Everything is set up! Let's generate your first content ideas",
      icon: Lightbulb,
      component: <OnboardingStepIdeas onNavigateToIdeasBank={onNavigateToIdeasBank} />
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-story-blue/10 rounded-lg">
                <currentStepData.icon className="h-6 w-6 text-story-blue" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  Welcome to Frayma AI!
                </CardTitle>
                <CardDescription>
                  Let's get you set up with everything you need to create amazing content
                </CardDescription>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={skipOnboarding}
              className="absolute top-4 right-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Step {currentStep} of {totalSteps}: {currentStepData.title}
              </span>
              <span className="text-gray-500">
                {Math.round(progress)}% complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
            <p className="text-gray-600">{currentStepData.description}</p>
          </div>
          
          {currentStepData.component}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingOverlay;
