
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import HeadlineSelection from './HeadlineSelection';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface HeadlinePLSSectionProps {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  introPOV: string;
  isGeneratingHeadlines: boolean;
  onHeadlineChange: (value: string) => void;
  onIntroPOVChange: (value: string) => void;
  onAddHeadline: (headline: HeadlineOption) => void;
}

const HeadlinePLSSection: FC<HeadlinePLSSectionProps> = ({
  headlineOptions,
  selectedHeadline,
  introPOV,
  isGeneratingHeadlines,
  onHeadlineChange,
  onIntroPOVChange,
  onAddHeadline
}) => {
  return (
    <div className="space-y-6">
      {/* PLS Step 1 - Headline (Attract) */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
              <Target className="h-4 w-4 mr-2" />
              Resonance - Attract
            </Badge>
            <div>
              <div className="text-sm font-medium text-gray-900">PLS Step 1: Headline Selection</div>
              <div className="text-xs text-gray-500">Hook and capture attention with compelling headline</div>
            </div>
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="h-4 w-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-xs">
                  Your selected headline becomes PLS Step 1 (Attract) and sets the tone for the entire piece. 
                  Change headlines to update this step.
                </p>
              </TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent>
          <HeadlineSelection
            headlineOptions={headlineOptions}
            selectedHeadline={selectedHeadline}
            isGeneratingHeadlines={isGeneratingHeadlines}
            onHeadlineChange={onHeadlineChange}
            onAddHeadline={onAddHeadline}
          />
        </CardContent>
      </Card>

      {/* Introduction POV Section */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
              <Target className="h-4 w-4 mr-2" />
              Resonance - Filter
            </Badge>
            <div>
              <div className="text-sm font-medium text-gray-900">PLS Steps 2-3: Introduction & ICP Filter</div>
              <div className="text-xs text-gray-500">Guide AI to craft resonant intro that filters target ICP</div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div>
            <Label className="text-sm font-medium mb-2 block">Introduction POV/Direction (Optional)</Label>
            <Textarea
              value={introPOV}
              onChange={(e) => onIntroPOVChange(e.target.value)}
              placeholder="Provide your perspective or specific direction for the introduction. How should it resonate with and filter your target ICP? What tone or angle should it take?"
              rows={4}
              className="text-sm"
            />
            <p className="text-xs text-gray-400 mt-2">
              This guides Frayma AI to auto-craft a resonant introduction that effectively filters for your target ICP readers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HeadlinePLSSection;
