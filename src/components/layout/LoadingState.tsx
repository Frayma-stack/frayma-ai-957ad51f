
import { FC } from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-story-blue mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading your workspace...</h2>
        <p className="text-gray-600">Setting up your content creation environment</p>
      </div>
    </div>
  );
};

export default LoadingState;
