
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Sparkles } from 'lucide-react';

interface HeadlineOption {
  id: string;
  text: string;
  isGenerated: boolean;
}

interface HeadlineSelectionProps {
  headlineOptions: HeadlineOption[];
  selectedHeadline: string;
  isGeneratingHeadlines: boolean;
  onHeadlineChange: (value: string) => void;
  onAddHeadline: (headline: HeadlineOption) => void;
}

const HeadlineSelection: FC<HeadlineSelectionProps> = ({
  headlineOptions,
  selectedHeadline,
  isGeneratingHeadlines,
  onHeadlineChange,
  onAddHeadline
}) => {
  const [newHeadlineText, setNewHeadlineText] = useState('');

  const addCustomHeadline = () => {
    if (!newHeadlineText.trim()) return;
    
    const newHeadline: HeadlineOption = {
      id: `custom_${Date.now()}`,
      text: newHeadlineText,
      isGenerated: false
    };
    
    onAddHeadline(newHeadline);
    setNewHeadlineText('');
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Choose Your Headline</CardTitle>
          {isGeneratingHeadlines && (
            <div className="flex items-center text-sm text-story-blue">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Generating options...
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {headlineOptions.length > 0 ? (
          <RadioGroup value={selectedHeadline} onValueChange={onHeadlineChange}>
            {headlineOptions.map((headline) => (
              <div key={headline.id} className="flex items-start space-x-2">
                <RadioGroupItem value={headline.id} id={headline.id} className="mt-1" />
                <div className="flex-1">
                  <Label htmlFor={headline.id} className="text-sm leading-relaxed cursor-pointer">
                    {headline.text}
                  </Label>
                  {headline.isGenerated && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Generated
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </RadioGroup>
        ) : (
          <div className="text-center py-4 text-gray-500">
            <Sparkles className="h-6 w-6 mx-auto mb-2 text-gray-300" />
            <p className="text-sm">AI will generate headline options based on your content triggers</p>
          </div>
        )}
        
        {/* Add Custom Headline */}
        <div className="border-t pt-4">
          <Label className="text-sm font-medium mb-2 block">Add Your Own Headline</Label>
          <div className="flex gap-2">
            <Input
              value={newHeadlineText}
              onChange={(e) => setNewHeadlineText(e.target.value)}
              placeholder="Write your custom headline..."
              className="flex-1"
            />
            <Button onClick={addCustomHeadline} size="sm" disabled={!newHeadlineText.trim()}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeadlineSelection;
