
import { FC } from 'react';
import { CheckCircle, Circle, ArrowRight, Sparkles } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Strategic Foundation', description: 'Core inputs' },
    { number: 2, title: 'Audience Resonance', description: 'Target alignment' },
    { number: 3, title: 'Discovery Triggers', description: 'AI pre-fills' },
    { number: 4, title: 'Content Architecture', description: 'Headlines & outline' }
  ];

  return (
    <div className="mb-6">
      {/* Journey Header */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center mb-2">
          <Sparkles className="h-4 w-4 text-story-blue mr-2" />
          <h2 className="text-lg font-semibold text-story-blue">StoryBrief Builder</h2>
        </div>
        <p className="text-xs text-gray-500">
          Step {currentStep} of 4 • Preparing AI for resonant content generation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-story-blue' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium mb-1 ${
                currentStep > step.number 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.number 
                    ? 'bg-story-blue text-white' 
                    : 'bg-gray-200'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.number
                )}
              </div>
              <div className="text-center">
                <span className="text-xs font-medium block max-w-[70px]">{step.title}</span>
                <span className="text-[10px] text-gray-400 block">{step.description}</span>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <ArrowRight className={`h-3 w-3 mx-3 ${currentStep > step.number ? 'text-green-500' : 'text-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Next Phase Preview */}
      {currentStep === 4 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <div className="flex items-center justify-center text-story-blue text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Ready for AI Content Generation → Text Editor
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
