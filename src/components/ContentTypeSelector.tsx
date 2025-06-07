
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, MessageSquare, Mail, Lightbulb, Trophy, Wand2, Zap } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import ProductCampaignCard from './ProductCampaignCard';

export type ContentType = 'article' | 'linkedin' | 'email' | 'custom' | 'success-story' | 'product-campaign';
export type ArticleSubType = 'thought-leadership' | 'product-showcase' | 'use-case-study' | 'industry-insight' | 'founder-story';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
  onNavigateToIdeasBank?: () => void;
}

const ContentTypeSelector: FC<ContentTypeSelectorProps> = ({
  onSelect,
  ideas,
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect,
  onNavigateToIdeasBank
}) => {
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);

  useEffect(() => {
    if (selectedIdeaId && ideas) {
      const idea = ideas.find(i => i.id === selectedIdeaId);
      setSelectedIdea(idea || null);
    } else {
      setSelectedIdea(null);
    }
  }, [selectedIdeaId, ideas]);

  const handleIdeaSelection = (idea: GeneratedIdea | null) => {
    setSelectedIdea(idea);
    if (onIdeaSelect) {
      onIdeaSelect(idea?.id || null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Ideas Integration */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary mb-2">Auto-craft resonant GTM content</h1>
          <p className="text-gray-600 text-lg">
            Choose a content type to auto-craft with Product-Led Storytelling
          </p>
        </div>

        {/* Ideas Integration */}
        {ideas && ideas.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-800">Use a Saved Idea</p>
                    <p className="text-sm text-blue-600">
                      {selectedIdea 
                        ? `Selected: ${selectedIdea.title}`
                        : 'Select an idea to auto-fill content generation'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {selectedIdea && (
                    <button
                      onClick={() => handleIdeaSelection(null)}
                      className="text-xs text-blue-600 hover:text-blue-800 underline"
                    >
                      Clear
                    </button>
                  )}
                  {ideas.length > 0 && (
                    <select
                      value={selectedIdea?.id || ''}
                      onChange={(e) => {
                        const idea = ideas.find(i => i.id === e.target.value);
                        handleIdeaSelection(idea || null);
                      }}
                      className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
                    >
                      <option value="">Select an idea...</option>
                      {ideas
                        .filter(idea => !selectedClientId || idea.clientId === selectedClientId)
                        .map(idea => (
                        <option key={idea.id} value={idea.id}>
                          {idea.title}
                        </option>
                      ))}
                    </select>
                  )}
                  {onNavigateToIdeasBank && (
                    <button
                      onClick={onNavigateToIdeasBank}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                    >
                      View Ideas Bank
                    </button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCampaignCard onClick={() => onSelect('product-campaign')} />
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => onSelect('article')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileText className="h-8 w-8 text-brand-primary" />
              <Badge variant="secondary">Popular</Badge>
            </div>
            <CardTitle className="text-xl text-brand-primary">GTM Articles</CardTitle>
            <p className="text-gray-600 text-sm">
              Long-form thought leadership, product showcases, and use case studies
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Thought Leadership</div>
              <div>• Product Showcases</div>
              <div>• Use Case Studies</div>
              <div>• Industry Insights</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => onSelect('linkedin')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <MessageSquare className="h-8 w-8 text-blue-600" />
              <Badge variant="outline">Social</Badge>
            </div>
            <CardTitle className="text-xl text-blue-600">LinkedIn Posts</CardTitle>
            <p className="text-gray-600 text-sm">
              Professional posts that drive engagement and build thought leadership
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Thought Leadership</div>
              <div>• Product Updates</div>
              <div>• Industry Commentary</div>
              <div>• Personal Stories</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => onSelect('email')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Mail className="h-8 w-8 text-green-600" />
              <Badge variant="outline">Direct</Badge>
            </div>
            <CardTitle className="text-xl text-green-600">Email Content</CardTitle>
            <p className="text-gray-600 text-sm">
              Newsletters, announcements, and nurture sequences
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Product Announcements</div>
              <div>• Feature Updates</div>
              <div>• Newsletter Content</div>
              <div>• Nurture Sequences</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => onSelect('success-story')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Trophy className="h-8 w-8 text-yellow-600" />
              <Badge variant="outline">Proof</Badge>
            </div>
            <CardTitle className="text-xl text-yellow-600">Success Stories</CardTitle>
            <p className="text-gray-600 text-sm">
              Customer case studies and testimonials that build credibility
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Customer Case Studies</div>
              <div>• Implementation Stories</div>
              <div>• ROI Demonstrations</div>
              <div>• Testimonials</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => onSelect('custom')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Wand2 className="h-8 w-8 text-purple-600" />
              <Badge variant="outline">Flexible</Badge>
            </div>
            <CardTitle className="text-xl text-purple-600">Custom Content</CardTitle>
            <p className="text-gray-600 text-sm">
              Any content type with custom prompts and specifications
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Website Copy</div>
              <div>• Sales Scripts</div>
              <div>• Social Media</div>
              <div>• Custom Formats</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
