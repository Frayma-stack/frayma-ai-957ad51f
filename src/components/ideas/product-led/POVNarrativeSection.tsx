import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Target } from 'lucide-react';

interface POVNarrativeSectionProps {
  povContent: string;
  onPOVChange: (content: string) => void;
}

const POVNarrativeSection: FC<POVNarrativeSectionProps> = ({
  povContent,
  onPOVChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Target className="h-5 w-5" />
          <span>POV / Narrative Direction (Optional)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Personal POV or Strategic Direction</Label>
          <Textarea
            placeholder="Add your framing POV, narrative angle, or strategic direction (e.g., highlight urgency, bust a myth, reframe a belief)..."
            value={povContent}
            onChange={(e) => onPOVChange(e.target.value)}
            className="min-h-[120px] mt-2"
          />
          <p className="text-sm text-gray-500 mt-2">
            This will help guide the AI to generate ideas with your specific narrative angle or perspective.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default POVNarrativeSection;