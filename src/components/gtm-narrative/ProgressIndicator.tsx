
import { FC } from 'react';

interface ProgressIndicatorProps {
  currentStep: number;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, title: 'Strategic Alignment' },
    { number: 2, title: 'Target Reader Resonance' },
    { number: 3, title: 'Content Discovery' },
    { number: 4, title: 'Content Outline' }
  ];

  return (
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => (
        <div 
          key={step.number}
          className={`flex items-center ${currentStep >= step.number ? 'text-story-blue' : 'text-gray-400'}`}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= step.number ? 'bg-story-blue text-white' : 'bg-gray-200'}`}>
            {step.number}
          </div>
          <span className="ml-2 text-sm font-medium">{step.title}</span>
        </div>
      ))}
    </div>
  );
};

export default ProgressIndicator;
