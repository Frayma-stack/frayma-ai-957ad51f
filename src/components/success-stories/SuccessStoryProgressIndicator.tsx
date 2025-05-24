
import { FC } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface SuccessStoryProgressIndicatorProps {
  currentStep: number;
}

const steps = [
  { number: 1, title: 'Story Brief', subtitle: 'Strategic Inputs' },
  { number: 2, title: 'Narrative Anchors', subtitle: 'Customer Voice' },
  { number: 3, title: 'Implementation', subtitle: 'Journey & Assets' },
  { number: 4, title: 'Outcome Metrics', subtitle: 'Results Section' },
  { number: 5, title: 'Auto-Crafting', subtitle: 'Enhancements' }
];

const SuccessStoryProgressIndicator: FC<SuccessStoryProgressIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                step.number <= currentStep
                  ? 'bg-brand-primary border-brand-primary text-white'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}>
                {step.number < currentStep ? (
                  <CheckCircle className="h-5 w-5" />
                ) : (
                  <span className="text-sm font-medium">{step.number}</span>
                )}
              </div>
              <div className="text-center mt-2">
                <div className={`text-sm font-medium ${
                  step.number <= currentStep ? 'text-brand-primary' : 'text-gray-400'
                }`}>
                  {step.title}
                </div>
                <div className="text-xs text-gray-500">{step.subtitle}</div>
              </div>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-4 ${
                step.number < currentStep ? 'bg-brand-primary' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuccessStoryProgressIndicator;
