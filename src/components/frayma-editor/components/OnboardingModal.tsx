
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Hash, 
  FileText, 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle 
} from 'lucide-react';

interface OnboardingModalProps {
  onClose: () => void;
}

const onboardingSteps = [
  {
    title: 'Welcome to Frayma Editor',
    description: 'Create compelling GTM articles with AI-powered assistance and real-time collaboration.',
    content: (
      <div className="text-center py-8">
        <div className="text-6xl mb-4">✨</div>
        <p className="text-lg text-gray-600">
          Let's walk through the key features that will help you craft resonant narratives.
        </p>
      </div>
    )
  },
  {
    title: 'Smart Blocks System',
    description: 'Frayma uses three core block types aligned with the PLS framework.',
    content: (
      <div className="space-y-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Hash className="h-5 w-5 text-blue-600" />
              <h4 className="font-semibold text-blue-900">Resonance Block</h4>
            </div>
            <p className="text-sm text-blue-800">
              Highlights narrative anchors (beliefs, pains, transformations) that resonate with your audience.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <FileText className="h-5 w-5 text-green-600" />
              <h4 className="font-semibold text-green-900">Relevance Block</h4>
            </div>
            <p className="text-sm text-green-800">
              Connects product features, use cases, and customer journey moments to your narrative.
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3 mb-2">
              <Quote className="h-5 w-5 text-purple-600" />
              <h4 className="font-semibold text-purple-900">Results Block</h4>
            </div>
            <p className="text-sm text-purple-800">
              Showcases transformation stories, customer quotes, and success metrics.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  },
  {
    title: 'AI-Powered Assistance',
    description: 'Get intelligent suggestions to improve your content.',
    content: (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl mb-2">🔄</div>
            <h4 className="font-medium">Rewrite</h4>
            <p className="text-sm text-gray-600">Change tone while keeping core message</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl mb-2">💡</div>
            <h4 className="font-medium">Improve</h4>
            <p className="text-sm text-gray-600">Enhance clarity and impact</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl mb-2">📈</div>
            <h4 className="font-medium">Insert CTA</h4>
            <p className="text-sm text-gray-600">Add compelling calls-to-action</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-2xl mb-2">🎨</div>
            <h4 className="font-medium">Suggest Visual</h4>
            <p className="text-sm text-gray-600">Recommend supporting images</p>
          </div>
        </div>
      </div>
    )
  },
  {
    title: 'Collaboration Features',
    description: 'Work together seamlessly with your team.',
    content: (
      <div className="space-y-4">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm">Real-time editing with colored cursors</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-sm">Contextual comments and replies</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-sm">Role-based permissions (Owner/Editor/Viewer)</span>
        </div>
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
          <span className="text-sm">Auto-save every 10 seconds</span>
        </div>
      </div>
    )
  },
  {
    title: 'Ready to Start!',
    description: 'You\'re all set to create compelling GTM narratives.',
    content: (
      <div className="text-center py-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <p className="text-lg text-gray-600 mb-4">
          You now understand the core features of Frayma Editor.
        </p>
        <p className="text-sm text-gray-500">
          Start by selecting text and use the AI suggestions sidebar, or insert smart blocks from the outline.
        </p>
      </div>
    )
  }
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{currentStepData.title}</DialogTitle>
          <DialogDescription>{currentStepData.description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          {currentStepData.content}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {onboardingSteps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex space-x-2">
            {currentStep > 0 && (
              <Button variant="outline" onClick={handlePrevious}>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
            )}
            <Button onClick={handleNext}>
              {currentStep === onboardingSteps.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
