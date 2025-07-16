import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Crown, Sparkles } from 'lucide-react';

interface BlurredIdeaCardProps {
  index: number;
  onUpgrade: () => void;
}

const BlurredIdeaCard: FC<BlurredIdeaCardProps> = ({ index, onUpgrade }) => {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/80 to-gray-100/90 z-10" />
      <div className="filter blur-sm">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="h-6 bg-gray-200 rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full animate-pulse" />
              <div className="h-3 bg-gray-200 rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </div>
      
      <div className="absolute inset-0 z-20 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-6 shadow-lg text-center max-w-sm mx-4">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <Lock className="h-8 w-8 text-blue-600" />
              <Crown className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1" />
            </div>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">
            Unlock Idea #{index + 1}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Upgrade to see all {20} generated ideas with full details, scoring, and unlimited access.
          </p>
          <Button
            onClick={onUpgrade}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Upgrade Plan
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default BlurredIdeaCard;