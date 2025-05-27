
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';

export type ArticleSubType = 'thought-leadership' | 'newsletter';

interface ArticleTypeSelectorProps {
  onSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  ideas: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
}

const ArticleTypeSelector: FC<ArticleTypeSelectorProps> = ({ 
  onSelect, 
  onBack, 
  ideas, 
  selectedClientId, 
  selectedIdeaId, 
  onIdeaSelect 
}) => {
  const articleTypes = [
    {
      type: 'thought-leadership' as ArticleSubType,
      title: 'Thought Leadership',
      description: 'In-depth articles that establish\nexpertise and industry authority',
      icon: FileText,
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      type: 'newsletter' as ArticleSubType,
      title: 'Newsletter',
      description: 'Engaging content designed\nfor regular audience updates',
      icon: Mail,
      color: 'bg-green-50 border-green-200 hover:bg-green-100',
      iconColor: 'text-green-600'
    }
  ];

  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Choose Article Type
        </h2>
        <p className="text-gray-600">
          Select the format that best fits your content goals
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {articleTypes.map((articleType) => (
          <Card 
            key={articleType.type}
            className={`cursor-pointer transition-all duration-200 ${articleType.color} hover:shadow-md`}
            onClick={() => onSelect(articleType.type)}
          >
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-3 rounded-lg bg-white`}>
                  <articleType.icon className={`h-6 w-6 ${articleType.iconColor}`} />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {articleType.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {articleType.description}
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

export default ArticleTypeSelector;
