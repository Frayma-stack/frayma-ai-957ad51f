
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from 'lucide-react';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface SelectedHeadlineDisplayProps {
  selectedHeadline: string;
  headlineOptions: HeadlineOption[];
}

const SelectedHeadlineDisplay: FC<SelectedHeadlineDisplayProps> = ({
  selectedHeadline,
  headlineOptions
}) => {
  const headline = headlineOptions.find(h => h.id === selectedHeadline);
  
  if (!headline) return null;

  return (
    <Card className="mb-6 border-l-4 border-l-story-blue bg-blue-50/50">
      <CardContent className="pt-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-1">
            <Badge className="bg-story-blue text-white">
              <Target className="h-3 w-3 mr-1" />
              PLS Step 1 - Attract
            </Badge>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Selected Article Headline
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {headline.text}
            </p>
            <p className="text-xs text-gray-500 mt-2">
              This headline will attract your target ICP and set the direction for the entire GTM piece.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SelectedHeadlineDisplay;
