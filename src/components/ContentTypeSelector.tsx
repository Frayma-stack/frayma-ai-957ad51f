
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, MessageSquare, Users, Lightbulb, Plus } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import SavedIdeaCard from './SavedIdeaCard';

export type ContentType = 'article' | 'linkedin' | 'email' | 'custom' | 'success-story';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string) => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({ 
  onSelect,
  ideas = [],
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect
}) => {
  const [selectedIdea, setSelectedIdea] = useState<string | null>(selectedIdeaId || null);

  console.log('🎨 ContentTypeSelector: Rendering with:', {
    ideasCount: ideas.length,
    selectedClientId,
    selectedIdeaId: selectedIdea
  });

  // Filter ideas to only show those for the selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  console.log('🎨 ContentTypeSelector: Filtered ideas count:', filteredIdeas.length);

  const contentTypes = [
    {
      type: 'article' as ContentType,
      title: 'GTM Narrative Piece',
      description: 'Long-form thought leadership content using Product-Led Storytelling framework',
      icon: FileText,
      color: 'bg-blue-500',
      badge: 'Premium'
    },
    {
      type: 'linkedin' as ContentType,
      title: 'LinkedIn Content',
      description: 'Professional posts designed to engage your network and drive conversations',
      icon: MessageSquare,
      color: 'bg-blue-600',
      badge: 'Social'
    },
    {
      type: 'email' as ContentType,
      title: 'Email Content',
      description: 'Engaging email content for newsletters, sequences, and campaigns',
      icon: Mail,
      color: 'bg-green-500',
      badge: 'Direct'
    },
    {
      type: 'custom' as ContentType,
      title: 'Custom Content',
      description: 'Flexible content creation for any format or platform you need',
      icon: Plus,
      color: 'bg-purple-500',
      badge: 'Flexible'
    },
    {
      type: 'success-story' as ContentType,
      title: 'Success Story',
      description: 'Customer success stories that showcase your product\'s impact',
      icon: Users,
      color: 'bg-orange-500',
      badge: 'Proof'
    }
  ];

  const handleIdeaSelect = (ideaId: string) => {
    console.log('💡 Idea selected:', ideaId);
    setSelectedIdea(ideaId);
    if (onIdeaSelect) {
      onIdeaSelect(ideaId);
    }
  };

  const handleUseIdeaForContent = (ideaId: string) => {
    console.log('🚀 Using idea for content:', ideaId);
    setSelectedIdea(ideaId);
    if (onIdeaSelect) {
      onIdeaSelect(ideaId);
    }
    // Automatically select article type when using an idea
    onSelect('article');
  };

  return (
    <div className="space-y-8">
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
              Or choose a content type to create from scratch:
            </h2>
          </div>
        </div>
      )}

      {/* Content Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((contentType) => {
          const Icon = contentType.icon;
          return (
            <Card
              key={contentType.type}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 group border-2 hover:border-story-blue"
              onClick={() => onSelect(contentType.type)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${contentType.color} group-hover:scale-110 transition-transform duration-200`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {contentType.badge}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CardTitle className="text-lg mb-2 group-hover:text-story-blue transition-colors">
                  {contentType.title}
                </CardTitle>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {contentType.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ContentTypeSelector;
