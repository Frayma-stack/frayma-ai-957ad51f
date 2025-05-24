
import { FC } from 'react';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { 
      number: 1, 
      title: 'Strategic Foundation', 
      subtitle: 'Define your narrative direction',
      description: 'Set the strategic foundation for AI-powered content creation'
    },
    { 
      number: 2, 
      title: 'Audience Resonance', 
      subtitle: 'Target reader insights',
      description: 'Guide AI to understand your audience deeply'
    },
    { 
      number: 3, 
      title: 'Discovery Optimization', 
      subtitle: 'Content discoverability',
      description: 'Optimize for search and audience needs'
    },
    { 
      number: 4, 
      title: 'Content Architecture', 
      subtitle: 'AI-powered outline',
      description: 'Structure for compelling narrative flow'
    }
  ];

  return (
    <div className="mb-8">
      {/* Journey Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-story-blue mb-2">StoryBrief & Outline Builder</h2>
        <p className="text-gray-600 text-sm">
          Building the foundation for AI-powered GTM narrative creation
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className={`flex flex-col items-center ${currentStep >= step.number ? 'text-story-blue' : 'text-gray-400'}`}>
              {/* Step Icon */}
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                currentStep > step.number 
                  ? 'bg-green-500 text-white' 
                  : currentStep === step.number 
                    ? 'bg-story-blue text-white' 
                    : 'bg-gray-200'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              
              {/* Step Info */}
              <div className="text-center max-w-[120px]">
                <h4 className="text-xs font-semibold">{step.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{step.subtitle}</p>
                {currentStep === step.number && (
                  <p className="text-xs text-story-blue mt-1 font-medium">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
            
            {/* Arrow between steps */}
            {index < steps.length - 1 && (
              <div className="flex-1 flex justify-center mx-2">
                <ArrowRight className={`h-4 w-4 ${currentStep > step.number ? 'text-green-500' : 'text-gray-300'}`} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Next Phase Preview */}
      {currentStep === 4 && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center text-green-800">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Ready for AI Content Generation</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            Your StoryBrief is complete. Next: Generate your personalized GTM narrative in the Frayma AI Editor.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgressIndicator;
