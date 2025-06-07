
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Save, FileText, Mail, MessageSquare } from 'lucide-react';
import { IdeaScore } from '@/types/ideas';
import { IdeaWithScore, ParsedIdea, SCORE_OPTIONS } from '../utils/IdeaParsingUtils';

interface ExpandedIdeaCardProps {
  ideaData: IdeaWithScore;
  index: number;
  icpId: string;
  selectedClientId?: string;
  onFieldUpdate: (field: keyof ParsedIdea, value: string) => void;
  onScoreUpdate: (score: IdeaScore) => void;
  onSave: () => void;
  onContentTypeSelect: (tempId: string, contentType: string) => void;
}

const ExpandedIdeaCard: FC<ExpandedIdeaCardProps> = ({
  ideaData,
  index,
  icpId,
  selectedClientId,
  onFieldUpdate,
  onScoreUpdate,
  onSave,
  onContentTypeSelect
}) => {
  const contentTypes = [
    { key: 'linkedin', label: 'LinkedIn Post', icon: MessageSquare },
    { key: 'email', label: 'Sales Email', icon: Mail },
    { key: 'article', label: 'GTM Article', icon: FileText },
  ];

  const handleContentTypeSelect = (contentType: string) => {
    console.log('🎯 Content type selected for generated idea:', {
      tempId: ideaData.tempId,
      contentType,
      ideaTitle: ideaData.title,
      icpId,
      selectedClientId
    });
    
    // Store the idea data with ICP and client information for the content creation flow
    const enhancedIdeaData = {
      ...ideaData,
      icpId,
      selectedClientId
    };
    
    localStorage.setItem('selectedGeneratedIdea', JSON.stringify(enhancedIdeaData));
    
    // Pass the tempId to trigger navigation
    onContentTypeSelect(ideaData.tempId, contentType);
  };

  return (
    <Card className="w-full border-2 border-gray-200 hover:border-blue-300 transition-colors">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-800">
            Idea #{index + 1}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="text-xs">
              Generated
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Title Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Title</Label>
          <Textarea
            value={ideaData.title}
            onChange={(e) => onFieldUpdate('title', e.target.value)}
            className="min-h-[60px] resize-none"
            placeholder="Enter idea title..."
          />
        </div>

        {/* Narrative Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Narrative</Label>
          <Textarea
            value={ideaData.narrative}
            onChange={(e) => onFieldUpdate('narrative', e.target.value)}
            className="min-h-[100px] resize-none"
            placeholder="Enter narrative content..."
          />
        </div>

        {/* Product Tie-in Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Product Tie-in</Label>
          <Textarea
            value={ideaData.productTieIn}
            onChange={(e) => onFieldUpdate('productTieIn', e.target.value)}
            className="min-h-[80px] resize-none"
            placeholder="Enter product connection..."
          />
        </div>

        {/* CTA Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">Call to Action</Label>
          <Textarea
            value={ideaData.cta}
            onChange={(e) => onFieldUpdate('cta', e.target.value)}
            className="min-h-[60px] resize-none"
            placeholder="Enter call to action..."
          />
        </div>

        {/* Score Section */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700 flex items-center">
            <Star className="h-4 w-4 mr-1" />
            Rate this Idea
          </Label>
          <Select
            value={ideaData.score?.value !== undefined ? ideaData.score.value.toString() : '__no_score__'}
            onValueChange={(value) => {
              if (value === '__no_score__') return;
              const score = SCORE_OPTIONS.find(s => s.value === Number(value));
              if (score) onScoreUpdate(score);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a score..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__no_score__">No Score</SelectItem>
              {SCORE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Actions */}
        <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
          <Button
            onClick={onSave}
            disabled={!ideaData.score}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
          >
            <Save className="h-4 w-4 mr-2" />
            Save to Ideas Bank
          </Button>
          
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">Auto-Craft Content</Label>
            <div className="grid grid-cols-1 gap-2">
              {contentTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <Button
                    key={type.key}
                    variant="outline"
                    size="sm"
                    onClick={() => handleContentTypeSelect(type.key)}
                    className="justify-start"
                  >
                    <IconComponent className="h-4 w-4 mr-2" />
                    {type.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandedIdeaCard;
