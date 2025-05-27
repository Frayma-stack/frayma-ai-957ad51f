
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Sparkles, Plus } from "lucide-react";

interface FormatSelectionCardProps {
  selectedFormat: 'structured' | 'open';
  onFormatChange: (format: 'structured' | 'open') => void;
}

const FormatSelectionCard: FC<FormatSelectionCardProps> = ({
  selectedFormat,
  onFormatChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-story-blue" />
          <span>Idea Generation Format</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-4">
          <Button
            variant={selectedFormat === 'structured' ? 'default' : 'outline'}
            onClick={() => onFormatChange('structured')}
            className="flex-1"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            AI-Generated Ideas
          </Button>
          <Button
            variant={selectedFormat === 'open' ? 'default' : 'outline'}
            onClick={() => onFormatChange('open')}
            className="flex-1"
          >
            <Plus className="h-4 w-4 mr-2" />
            Manual Entry
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormatSelectionCard;
