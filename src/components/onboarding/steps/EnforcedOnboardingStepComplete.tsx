
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, ArrowRight, CheckCircle } from "lucide-react";

interface EnforcedOnboardingStepCompleteProps {
  onComplete: () => void;
}

const EnforcedOnboardingStepComplete: FC<EnforcedOnboardingStepCompleteProps> = ({
  onComplete,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-story-blue" />
          <CardTitle>Setup Complete! 🎉</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Sparkles className="h-6 w-6 text-green-600" />
            <h4 className="font-medium text-green-800 text-lg">Frayma AI is Ready! ✓</h4>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Email Confirmed</span>
              </div>
              <p className="text-green-700">Account verified and secure</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">Subscription Active</span>
              </div>
              <p className="text-blue-700">Plan configured and ready</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-purple-800">Business Analyzed</span>
              </div>
              <p className="text-purple-700">Product context captured by Frayma AI</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-800">Author Profile Created</span>
              </div>
              <p className="text-orange-700">Voice and expertise analyzed</p>
            </div>
            
            <div className="bg-white/50 rounded-lg p-3 md:col-span-2">
              <div className="flex items-center space-x-2 mb-2">
                <CheckCircle className="h-4 w-4 text-indigo-600" />
                <span className="font-medium text-indigo-800">Target Audience Defined</span>
              </div>
              <p className="text-indigo-700">ICP insights and narrative anchors identified</p>
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="bg-story-blue/10 rounded-lg p-6">
            <h4 className="font-medium text-story-blue mb-3 text-lg">What's Next?</h4>
            <p className="text-gray-700">
              The Frayma AI Narrative Engine will use all your setup data to generate personalized, 
              compelling content ideas that resonate with your target audience and showcase your unique value proposition.
            </p>
          </div>
          
          <Button 
            onClick={onComplete}
            size="lg"
            className="bg-story-blue hover:bg-story-light-blue text-white px-8 py-4 text-lg"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Start Generating Ideas with Frayma AI
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
          
          <p className="text-sm text-gray-500">
            You'll be taken to the Ideas Bank where you can start creating amazing content.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepComplete;
