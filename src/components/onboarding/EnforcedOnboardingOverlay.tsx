
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Lock, Mail, CreditCard, Building, User, Users, Lightbulb } from "lucide-react";
import { useEnforcedOnboarding } from './EnforcedOnboardingProvider';
import EnforcedOnboardingStepEmail from './steps/EnforcedOnboardingStepEmail';
import EnforcedOnboardingStepSubscription from './steps/EnforcedOnboardingStepSubscription';
import EnforcedOnboardingStepClient from './steps/EnforcedOnboardingStepClient';
import EnforcedOnboardingStepAuthor from './steps/EnforcedOnboardingStepAuthor';
import EnforcedOnboardingStepICP from './steps/EnforcedOnboardingStepICP';
import EnforcedOnboardingStepComplete from './steps/EnforcedOnboardingStepComplete';
import { Author, Client, ProductContext, ICPStoryScript } from '@/types/storytelling';

interface EnforcedOnboardingOverlayProps {
  onAuthorAdded: (author: Author) => Promise<Author>;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onNavigateToIdeasBank: () => void;
}

const EnforcedOnboardingOverlay: FC<EnforcedOnboardingOverlayProps> = ({
  onAuthorAdded,
  onClientAdded,
  onICPScriptAdded,
  onNavigateToIdeasBank,
}) => {
  const {
    progress,
    currentStep,
    totalSteps,
    isOnboardingRequired,
    canAccessStep,
    isStepCompleted,
    completeStep,
    markClientCreated,
    markAuthorCreated,
    markICPScriptCreated,
    markSubscriptionCompleted,
    completeOnboarding,
    loading
  } = useEnforcedOnboarding();

  const [activeStep, setActiveStep] = useState(currentStep);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg">
          <div className="animate-pulse">Loading onboarding...</div>
        </div>
      </div>
    );
  }

  if (!isOnboardingRequired) {
    return null;
  }

  const steps = [
    {
      id: 1,
      title: "Email Confirmation",
      description: "Confirm your email address to get started",
      icon: Mail,
      required: true
    },
    {
      id: 2,
      title: "Choose Subscription",
      description: "Select your plan and complete payment setup",
      icon: CreditCard,
      required: true
    },
    {
      id: 3,
      title: "Business Setup",
      description: "Add your business information and product context",
      icon: Building,
      required: true
    },
    {
      id: 4,
      title: "Author Profile",
      description: "Set up your professional author profile",
      icon: User,
      required: true
    },
    {
      id: 5,
      title: "Target Audience",
      description: "Define your ICP through transcript analysis",
      icon: Users,
      required: true
    },
    {
      id: 6,
      title: "Setup Complete",
      description: "Ready to generate content ideas!",
      icon: Lightbulb,
      required: false
    }
  ];

  const currentStepData = steps.find(step => step.id === activeStep);
  const progressPercentage = (activeStep / totalSteps) * 100;

  const handleStepClick = (stepId: number) => {
    if (canAccessStep(stepId)) {
      setActiveStep(stepId);
    }
  };

  const handleClientAdded = async (client: Client, productContext?: ProductContext) => {
    await markClientCreated();
    onClientAdded(client, productContext);
    await completeStep(3);
    setActiveStep(4);
  };

  const handleAuthorAdded = async (author: Author) => {
    await markAuthorCreated();
    const savedAuthor = await onAuthorAdded(author);
    await completeStep(4);
    setActiveStep(5);
    return savedAuthor;
  };

  const handleICPAdded = async (script: ICPStoryScript) => {
    await markICPScriptCreated();
    onICPScriptAdded(script);
    await completeStep(5);
    setActiveStep(6);
  };

  const handleSubscriptionCompleted = async () => {
    await markSubscriptionCompleted();
    await completeStep(2);
    setActiveStep(3);
  };

  const handleEmailConfirmed = async () => {
    await completeStep(1);
    setActiveStep(2);
  };

  const handleOnboardingComplete = async () => {
    await completeOnboarding();
    onNavigateToIdeasBank();
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 1:
        return <EnforcedOnboardingStepEmail onEmailConfirmed={handleEmailConfirmed} />;
      case 2:
        return <EnforcedOnboardingStepSubscription onSubscriptionCompleted={handleSubscriptionCompleted} />;
      case 3:
        return <EnforcedOnboardingStepClient onClientAdded={handleClientAdded} />;
      case 4:
        return <EnforcedOnboardingStepAuthor onAuthorAdded={handleAuthorAdded} />;
      case 5:
        return <EnforcedOnboardingStepICP onICPAdded={handleICPAdded} />;
      case 6:
        return <EnforcedOnboardingStepComplete onComplete={handleOnboardingComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl flex items-center space-x-3">
                <span className="text-story-blue">Welcome to Frayma AI!</span>
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Complete these steps to unlock the full power of AI-driven content creation
              </CardDescription>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">
                Step {activeStep} of {totalSteps}: {currentStepData?.title}
              </span>
              <span className="text-gray-500">
                {Math.round(progressPercentage)}% complete
              </span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
          </div>

          {/* Step Navigation */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
            {steps.map((step) => {
              const isCompleted = isStepCompleted(step.id);
              const isAccessible = canAccessStep(step.id);
              const isActive = activeStep === step.id;
              
              return (
                <Button
                  key={step.id}
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleStepClick(step.id)}
                  disabled={!isAccessible && !isCompleted}
                  className={`
                    flex flex-col items-center p-3 h-auto space-y-1
                    ${isCompleted ? 'bg-green-50 border-green-200 text-green-800' : ''}
                    ${isActive ? 'bg-story-blue text-white' : ''}
                    ${!isAccessible && !isCompleted ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="flex items-center space-x-1">
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : !isAccessible ? (
                      <Lock className="h-4 w-4" />
                    ) : (
                      <step.icon className="h-4 w-4" />
                    )}
                    <span className="text-xs font-medium">{step.id}</span>
                  </div>
                  <span className="text-xs text-center leading-tight">{step.title}</span>
                </Button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2">{currentStepData?.title}</h3>
            <p className="text-gray-600">{currentStepData?.description}</p>
          </div>
          
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default EnforcedOnboardingOverlay;
