
import { FC } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';

interface SavedIdeaCardProps {
  idea: GeneratedIdea;
  onSelect: (ideaId: string) => void;
  onUseForContent?: (ideaId: string) => void;
}

const SavedIdeaCard: FC<SavedIdeaCardProps> = ({ 
  idea, 
  onSelect, 
  onUseForContent 
}) => {
  const handleSelect = () => {
    onSelect(idea.id);
  };

  const handleUseForContent = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onUseForContent) {
      onUseForContent(idea.id);
    }
  };

  return (
    <Card 
      className="w-full cursor-pointer hover:shadow-md transition-all duration-200 border-l-4 border-l-story-blue bg-gradient-to-r from-blue-50/30 to-transparent"
      onClick={handleSelect}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-story-blue" />
            <Badge variant="outline" className="text-xs">
              Saved Idea
            </Badge>
            {idea.score && (
              <Badge variant="secondary" className="text-xs">
                Score: {idea.score.value}/3
              </Badge>
            )}
          </div>
          
          {onUseForContent && (
            <Button 
              size="sm" 
              variant="ghost"
              onClick={handleUseForContent}
              className="text-story-blue hover:text-story-blue/80"
            >
              Use for Content
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Title */}
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <div className="w-1 h-4 bg-blue-600 rounded-full"></div>
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Title</span>
          </div>
          <h3 className="font-semibold text-gray-900 leading-tight">
            {idea.title}
          </h3>
        </div>

        {/* Narrative */}
        {idea.narrative && (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <MessageSquare className="h-3 w-3 text-purple-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Narrative</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {idea.narrative}
            </p>
          </div>
        )}

        {/* Product Tie-In */}
        {idea.productTieIn && (
          <div className="space-y-1">
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3 text-green-600" />
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Product Tie-In</span>
            </div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {idea.productTieIn}
            </p>
          </div>
        )}

        {/* CTA (smaller, less prominent) */}
        {idea.cta && (
          <div className="pt-2 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic">
              CTA: {idea.cta}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedIdeaCard;
