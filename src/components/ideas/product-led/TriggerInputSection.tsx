
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Lightbulb, Upload, FileText, Image } from 'lucide-react';

interface TriggerInput {
  type: 'text' | 'image' | 'file';
  content: string;
}

interface TriggerInputSectionProps {
  triggerInput: TriggerInput;
  onTriggerInputChange: (input: TriggerInput) => void;
}

const TriggerInputSection: FC<TriggerInputSectionProps> = ({
  triggerInput,
  onTriggerInputChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <span>Idea Trigger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Input Type</Label>
          <div className="flex space-x-2 mt-2">
            <Button
              variant={triggerInput.type === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'text' })}
            >
              <FileText className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              variant={triggerInput.type === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'image' })}
            >
              <Image className="h-4 w-4 mr-1" />
              Image
            </Button>
            <Button
              variant={triggerInput.type === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'file' })}
            >
              <Upload className="h-4 w-4 mr-1" />
              File
            </Button>
          </div>
        </div>

        <div>
          <Label>Trigger/Thesis/Anti-thesis</Label>
          <Textarea
            placeholder="What triggered you to mint new ideas? Paste text, describe an image, or explain file content..."
            value={triggerInput.content}
            onChange={(e) => onTriggerInputChange({ ...triggerInput, content: e.target.value })}
            className="min-h-[200px] mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default TriggerInputSection;
