
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, FileText, Mail, Lightbulb } from 'lucide-react';
import { ArticleSubType } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import SavedIdeaCard from './SavedIdeaCard';

interface ArticleTypeSelectorProps {
  onSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string) => void;
}

const ArticleTypeSelector: FC<ArticleTypeSelectorProps> = ({ 
  onSelect, 
  onBack,
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  // Filter ideas to only show those for the selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  const articleTypes = [
    {
      type: 'thought_leadership' as ArticleSubType,
      title: 'Long-Form GTM Pieces',
      description: 'Auto-craft in-depth thought leadership content or how-to guides with narratives that solidify your positioning',
      icon: FileText,
      color: 'bg-blue-500',
      badge: 'Thought Leadership'
    },
    {
      type: 'newsletter' as ArticleSubType,
      title: 'First-Person Newsletters',
      description: 'Craft newsletters in first-person narratives that build and foster more engaged audiences',
      icon: Mail,
      color: 'bg-green-500',
      badge: 'Newsletter'
    }
  ];

  const handleIdeaSelect = (ideaId: string) => {
    if (onIdeaSelect) {
      onIdeaSelect(ideaId);
    }
  };

  const handleUseIdeaForContent = (ideaId: string) => {
    if (onIdeaSelect) {
      onIdeaSelect(ideaId);
    }
    // Auto-select thought leadership when using an idea
    onSelect('thought_leadership');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 mb-6">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Choose Article Type</h1>
          <p className="text-gray-600">Select the type of article you want to create</p>
        </div>
      </div>

      {/* Saved Ideas Section */}
      {filteredIdeas.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-story-blue" />
            <h2 className="text-lg font-semibold text-gray-900">
              Or start from a saved idea:
            </h2>
            <Badge variant="secondary" className="text-xs">
              {filteredIdeas.length} idea{filteredIdeas.length !== 1 ? 's' : ''} available
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
            {filteredIdeas.map((idea) => (
              <SavedIdeaCard
                key={idea.id}
                idea={idea}
                onSelect={handleIdeaSelect}
                onUseForContent={handleUseIdeaForContent}
              />
            ))}
          </div>
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Or choose an article type to create from scratch:
            </h2>
          </div>
        </div>
      )}

      {/* Article Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articleTypes.map((articleType) => {
          const Icon = articleType.icon;
          return (
            <Card
              key={articleType.type}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 hover:border-story-blue"
              onClick={() => onSelect(articleType.type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${articleType.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {articleType.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2 group-hover:text-story-blue transition-colors">
                  {articleType.title}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {articleType.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ArticleTypeSelector;
