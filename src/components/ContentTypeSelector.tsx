
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Mail, 
  Linkedin, 
  Sparkles,
  Lightbulb
} from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';

export type ContentType = 'article' | 'success-story' | 'linkedin' | 'email' | 'custom' | 'mint-ideas';
export type ArticleSubType = 'thought-leadership' | 'newsletter';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  ideas: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ 
  onSelect, 
  ideas, 
  selectedClientId, 
  selectedIdeaId, 
  onIdeaSelect 
}) => {
  const contentTypes = [
    {
      type: 'article' as ContentType,
      title: 'Article',
      description: 'Long-form content',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'linkedin' as ContentType,
      title: 'LinkedIn Post',
      description: 'Professional social content',
      icon: Linkedin,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'email' as ContentType,
      title: 'Email',
      description: 'Direct communication',
      icon: Mail,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      type: 'success-story' as ContentType,
      title: 'Success Story',
      description: 'Customer case studies',
      icon: Sparkles,
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      type: 'mint-ideas' as ContentType,
      title: 'Mint New Ideas',
      description: 'Generate fresh content concepts',
      icon: Lightbulb,
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  ];

  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  const handleContentTypeSelect = (type: ContentType) => {
    if (type === 'mint-ideas') {
      // Navigate to ideas bank for minting new ideas
      window.dispatchEvent(new CustomEvent('navigate-to-ideas-bank'));
      return;
    }
    onSelect(type);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          What Would You Auto-Craft?
        </h2>
        <p className="text-gray-600">
          Choose the type of content you'd like to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {contentTypes.map((contentType) => (
          <Card 
            key={contentType.type}
            className={`cursor-pointer transition-all duration-200 ${contentType.color} hover:shadow-md`}
            onClick={() => handleContentTypeSelect(contentType.type)}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg bg-white`}>
                  <contentType.icon className={`h-5 w-5 ${contentType.iconColor}`} />
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {contentType.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 leading-relaxed">
                {contentType.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredIdeas.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Or start from a saved idea:
          </h3>
          <div className="grid gap-3">
            {filteredIdeas.slice(0, 5).map((idea) => (
              <Card 
                key={idea.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedIdeaId === idea.id 
                    ? 'border-story-blue bg-story-blue/5' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => onIdeaSelect?.(idea.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">
                        {idea.title}
                      </h4>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {idea.narrative}
                      </p>
                    </div>
                    {selectedIdeaId === idea.id && (
                      <div className="ml-3 p-1 bg-story-blue rounded-full">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector;
