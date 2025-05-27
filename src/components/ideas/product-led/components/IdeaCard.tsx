
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Save } from 'lucide-react';
import { IdeaWithScore, ParsedIdea } from '../utils/IdeaParsingUtils';
import IdeaScoreSelector from './IdeaScoreSelector';
import IdeaContentActions from '../../IdeaContentActions';
import { IdeaScore } from '@/types/ideas';

interface IdeaCardProps {
  ideaData: IdeaWithScore;
  index: number;
  icpId: string;
  selectedClientId?: string;
  onFieldUpdate: (field: keyof ParsedIdea, value: string) => void;
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
  return (
    <Card className="border-l-4 border-l-blue-500 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center justify-between">
          <span>Idea {index + 1}</span>
          <div className="flex items-center space-x-3">
            <IdeaScoreSelector
              score={ideaData.score}
              onScoreChange={onScoreUpdate}
            />
            <IdeaContentActions
              idea={{
                id: ideaData.tempId,
                title: ideaData.title,
                narrative: ideaData.narrative,
                productTieIn: ideaData.productTieIn,
                cta: ideaData.cta,
                createdAt: new Date().toISOString(),
                score: ideaData.score,
                source: { type: 'manual', content: ideaData.originalContent },
                icpId: icpId,
                narrativeAnchor: 'belief',
                narrativeItemId: '',
                productFeatures: [],
                clientId: selectedClientId,
              }}
              onContentTypeSelect={onContentTypeSelect}
            />
            <Button
              onClick={onSave}
              disabled={!ideaData.score}
              className="bg-green-500 hover:bg-green-600 text-white"
              size="sm"
            >
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-blue-600">Title</Label>
            <Textarea
              value={ideaData.title}
              onChange={(e) => onFieldUpdate('title', e.target.value)}
              className="min-h-[60px] font-medium border-blue-200 focus:border-blue-400"
              placeholder="Enter a compelling title..."
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-green-600">Narrative</Label>
            <Textarea
              value={ideaData.narrative}
              onChange={(e) => onFieldUpdate('narrative', e.target.value)}
              className="min-h-[100px] border-green-200 focus:border-green-400"
              placeholder="Describe the narrative tension or belief this idea challenges..."
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-purple-600">Product Tie-In</Label>
            <Textarea
              value={ideaData.productTieIn}
              onChange={(e) => onFieldUpdate('productTieIn', e.target.value)}
              className="min-h-[100px] border-purple-200 focus:border-purple-400"
              placeholder="How does this naturally surface your product's unique value..."
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-orange-600">Call to Action</Label>
            <Textarea
              value={ideaData.cta}
              onChange={(e) => onFieldUpdate('cta', e.target.value)}
              className="min-h-[60px] border-orange-200 focus:border-orange-400"
              placeholder="What specific action should readers take..."
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeaCard;
