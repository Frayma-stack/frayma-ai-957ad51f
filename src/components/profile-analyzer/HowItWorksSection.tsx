
import { FC } from 'react';

const HowItWorksSection: FC = () => {
  return (
    <div className="bg-blue-50 border border-blue-200 p-4 rounded-md">
      <h4 className="text-sm font-medium text-blue-900 mb-2">How it works:</h4>
      <ul className="text-sm text-blue-800 space-y-1">
        <li>• We analyze public content from the provided links</li>
        <li>• Extract key professional experiences and achievements</li>
        <li>• Identify unique writing tones and communication style</li>
        <li>• Auto-populate the author form to save you time</li>
      </ul>
    </div>
  );
};

export default HowItWorksSection;
