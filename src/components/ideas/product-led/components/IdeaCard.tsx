
import { FC } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Lightbulb, Target, TrendingUp, MessageSquare } from 'lucide-react';
import { IdeaScore } from '@/types/ideas';
import { IdeaWithScore } from '../utils/IdeaParsingUtils';
import IdeaScoreSelector from './IdeaScoreSelector';
import IdeaContentTypeSelector from './IdeaContentTypeSelector';

interface IdeaCardProps {
  ideaData: IdeaWithScore;
  index: number;
  icpId: string;
  selectedClientId?: string;
  onFieldUpdate: (field: 'title' | 'narrative' | 'productTieIn' | 'cta', value: string) => void;
  onScoreUpdate: (score: IdeaScore) => void;
  onSave: () => void;
  onContentTypeSelect: (tempId: string, contentType: string) => void;
}

const IdeaCard: FC<IdeaCardProps> = ({
  ideaData,
  index,
  icpId,
  selectedClientId,
  onFieldUpdate,
  onScoreUpdate,
  onSave,
  onContentTypeSelect
}) => {
  const canSave = ideaData.score && ideaData.title && ideaData.narrative;

  return (
    <Card className="w-full border-l-4 border-l-story-blue">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-story-blue" />
            <Badge variant="outline" className="text-xs">
              Idea {index + 1}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            <IdeaScoreSelector
              score={ideaData.score}
              onChange={onScoreUpdate}
            />
            
            <Button
              onClick={onSave}
              disabled={!canSave}
              size="sm"
              className="bg-story-blue hover:bg-story-blue/90"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Idea
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Title Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-blue-600" />
            <Label className="text-sm font-medium">Title</Label>
          </div>
          <Input
            value={ideaData.title}
            onChange={(e) => onFieldUpdate('title', e.target.value)}
            placeholder="Enter idea title..."
            className="font-medium"
          />
        </div>

        {/* Narrative Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-purple-600" />
            <Label className="text-sm font-medium">Narrative</Label>
          </div>
          <Textarea
            value={ideaData.narrative}
            onChange={(e) => onFieldUpdate('narrative', e.target.value)}
            placeholder="What's the story or tension this idea explores?"
            rows={3}
            className="resize-none"
          />
        </div>

        {/* Product Tie-In Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <Label className="text-sm font-medium">Product Tie-In</Label>
          </div>
          <Textarea
            value={ideaData.productTieIn}
            onChange={(e) => onFieldUpdate('productTieIn', e.target.value)}
            placeholder="How does this naturally connect to your product?"
            rows={2}
            className="resize-none"
          />
        </div>

        {/* CTA Section */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Target className="h-4 w-4 text-orange-600" />
            <Label className="text-sm font-medium">Call to Action</Label>
          </div>
          <Input
            value={ideaData.cta}
            onChange={(e) => onFieldUpdate('cta', e.target.value)}
            placeholder="What action should readers take?"
          />
        </div>

        {/* Content Type Selection */}
        <div className="pt-4 border-t">
          <IdeaContentTypeSelector
            tempId={ideaData.tempId}
            onContentTypeSelect={onContentTypeSelect}
            icpId={icpId}
            selectedClientId={selectedClientId}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
