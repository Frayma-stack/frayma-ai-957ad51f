
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";

interface ManualEntrySectionProps {
  manualTitle: string;
  manualNarrative: string;
  manualProductTieIn: string;
  manualCTA: string;
  onTitleChange: (value: string) => void;
  onNarrativeChange: (value: string) => void;
  onProductTieInChange: (value: string) => void;
  onCTAChange: (value: string) => void;
  onAddManualIdea: () => void;
}

const ManualEntrySection: FC<ManualEntrySectionProps> = ({
  manualTitle,
  manualNarrative,
  manualProductTieIn,
  manualCTA,
  onTitleChange,
  onNarrativeChange,
  onProductTieInChange,
  onCTAChange,
  onAddManualIdea
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Idea Manually</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Idea Title *</Label>
          <Input
            placeholder="Enter a compelling title for your idea"
            value={manualTitle}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>

        <div>
          <Label>Core Narrative *</Label>
          <Textarea
            placeholder="Describe the main narrative or insight"
            value={manualNarrative}
            onChange={(e) => onNarrativeChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>

        <div>
          <Label>Product Tie-in (Optional)</Label>
          <Textarea
            placeholder="How does this idea connect to your product or service?"
            value={manualProductTieIn}
            onChange={(e) => onProductTieInChange(e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div>
          <Label>Call to Action (Optional)</Label>
          <Input
            placeholder="What action do you want readers to take?"
            value={manualCTA}
            onChange={(e) => onCTAChange(e.target.value)}
          />
        </div>

        <Button
          onClick={onAddManualIdea}
          disabled={!manualTitle.trim() || !manualNarrative.trim()}
          className="w-full bg-story-blue hover:bg-story-light-blue"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Idea
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualEntrySection;
