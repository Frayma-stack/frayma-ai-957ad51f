
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Mail, 
  Linkedin, 
  Edit3,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';
import IdeaSelector from './IdeaSelector';

export type ContentType = 'article' | 'email' | 'linkedin' | 'success-story' | 'custom';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ 
  onSelect, 
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  const [localSelectedIdeaId, setLocalSelectedIdeaId] = useState<string | null>(selectedIdeaId || null);

  const handleIdeaSelect = (ideaId: string | null) => {
    setLocalSelectedIdeaId(ideaId);
    onIdeaSelect?.(ideaId);
  };

  const contentTypes = [
    {
      type: 'article' as ContentType,
      title: 'GTM Narrative Piece',
      description: 'Create compelling thought leadership content.\nBuild authority and drive engagement.\nTransform insights into market-moving narratives.',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'email' as ContentType,
      title: 'Sales Email',
      description: 'Craft personalized outreach that converts.\nBreak through inbox noise.\nTurn prospects into conversations.',
      icon: Mail,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'linkedin' as ContentType,
      title: 'LinkedIn Post',
      description: 'Build your professional brand with impact.\nSpark meaningful discussions.\nAmplify your thought leadership.',
      icon: Linkedin,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      type: 'success-story' as ContentType,
      title: 'Success Story',
      description: 'Transform wins into compelling narratives.\nShowcase real customer value.\nBuild trust through authentic stories.',
      icon: Sparkles,
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
      iconColor: 'text-orange-600'
    },
    {
      type: 'custom' as ContentType,
      title: 'Custom Content',
      description: 'Create any content type you need.\nFlexible format for unique requirements.\nTailored to your specific goals.',
      icon: Edit3,
      color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
      iconColor: 'text-gray-600'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Idea Selector - only show if we have ideas */}
      {ideas.length > 0 && (
        <IdeaSelector
          ideas={ideas}
          selectedIdeaId={localSelectedIdeaId}
          onIdeaSelect={handleIdeaSelect}
          selectedClientId={selectedClientId}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentTypes.map((content) => (
          <Card 
            key={content.type} 
            className={`cursor-pointer transition-all duration-200 ${content.color} hover:shadow-md border-2`}
            onClick={() => onSelect(content.type)}
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-3 text-lg">
                <content.icon className={`h-6 w-6 ${content.iconColor}`} />
                <span className="text-gray-800">{content.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {content.description}
              </p>
              <Button 
                className="w-full mt-4 bg-story-blue hover:bg-story-light-blue text-white"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(content.type);
                }}
              >
                Create {content.title}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
