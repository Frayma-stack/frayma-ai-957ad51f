
import { FC } from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trophy } from 'lucide-react';

interface SuccessStoryFlowHeaderProps {
  onBack: () => void;
}

const SuccessStoryFlowHeader: FC<SuccessStoryFlowHeaderProps> = ({ onBack }) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trophy className="h-6 w-6 text-brand-primary" />
          <div>
            <CardTitle className="text-brand-primary font-sora">Auto-Craft Success Story</CardTitle>
            <CardDescription>
              Build compelling customer success narratives using the 5-step structured flow
            </CardDescription>
          </div>
        </div>
        <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
      </div>
    </CardHeader>
  );
};

export default SuccessStoryFlowHeader;
