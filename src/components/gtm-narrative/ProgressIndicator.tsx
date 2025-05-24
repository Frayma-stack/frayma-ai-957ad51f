
import { FC } from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Strategic Foundation' },
    { number: 2, title: 'Audience Resonance' },
    { number: 3, title: 'Discovery Optimization' },
    { number: 4, title: 'Content Architecture' }
  ];

  return (
    <div className="mb-6">
      {/* Compact Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-story-blue">StoryBrief & Outline Builder</h2>
        <p className="text-xs text-gray-500">Step {currentStep} of 4 • Building foundation for AI-powered content creation</p>
      </div>

      {/* Compact Progress Steps */}
      <div className="flex items-center justify-between max-w-lg mx-auto">
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
              <span className="text-xs font-medium text-center max-w-[80px]">{step.title}</span>
            </div>
            
            {index < steps.length - 1 && (
              <ArrowRight className={`h-3 w-3 mx-3 ${currentStep > step.number ? 'text-green-500' : 'text-gray-300'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Completion Status */}
      {currentStep === 4 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <div className="flex items-center justify-center text-green-800 text-sm">
            <CheckCircle className="h-4 w-4 mr-2" />
            Ready for AI Content Generation
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
