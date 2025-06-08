
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, MessageSquare, Mail, Lightbulb, Trophy, Wand2, Zap, Sparkles } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import ProductCampaignCard from './ProductCampaignCard';
import { useAuth } from "@/contexts/AuthContext";

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
  const { user } = useAuth();
  const [selectedIdea, setSelectedIdea] = useState<GeneratedIdea | null>(null);
  const [showContentTypeSelection, setShowContentTypeSelection] = useState(false);

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
    
    if (idea) {
      setShowContentTypeSelection(true);
    } else {
      setShowContentTypeSelection(false);
    }
  };

  const handleContentTypeSelect = (type: ContentType) => {
    if (selectedIdea) {
      // Store the selected idea in session storage for the content creation flow
      sessionStorage.setItem('selectedIdeaForContent', JSON.stringify(selectedIdea));
    }
    onSelect(type);
  };

  const getUserFirstName = () => {
    if (!user?.email) return 'there';
    
    // Try to get from user metadata first
    const metadata = (user as any)?.user_metadata;
    if (metadata?.full_name) {
      return metadata.full_name.split(' ')[0];
    }
    
    // Fallback to email username
    return user.email.split('@')[0];
  };

  const filteredIdeas = ideas?.filter(idea => !selectedClientId || idea.clientId === selectedClientId) || [];

  if (showContentTypeSelection && selectedIdea) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Choose Content Type for "{selectedIdea.title}"
          </h1>
          <p className="text-gray-600 text-lg">
            What type of content would you like to auto-craft from this idea?
          </p>
          <Button 
            variant="ghost" 
            onClick={() => {
              setShowContentTypeSelection(false);
              handleIdeaSelection(null);
            }}
            className="text-sm"
          >
            ← Back to content types
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProductCampaignCard onClick={() => handleContentTypeSelect('product-campaign')} />
          
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
            onClick={() => handleContentTypeSelect('article')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <FileText className="h-8 w-8 text-brand-primary" />
                <Badge variant="secondary">Popular</Badge>
              </div>
              <CardTitle className="text-xl text-brand-primary">GTM Articles</CardTitle>
              <p className="text-gray-600 text-sm">
                Long-form thought leadership, product showcases, and how-to guides
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Thought Leadership</div>
                <div>• Product Showcases</div>
                <div>• Detailed How-to Guides</div>
                <div>• Industry Insights</div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
            onClick={() => handleContentTypeSelect('linkedin')}
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
            onClick={() => handleContentTypeSelect('email')}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Mail className="h-8 w-8 text-green-600" />
                <Badge variant="outline">Direct</Badge>
              </div>
              <CardTitle className="text-xl text-green-600">Sales Email</CardTitle>
              <p className="text-gray-600 text-sm">
                Expansion, nurture sequences, sales outreach
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Upsell & Cross-sell Emails</div>
                <div>• Cold Outbound Emails</div>
                <div>• Nurture Sequences</div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
            onClick={() => handleContentTypeSelect('success-story')}
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
            onClick={() => handleContentTypeSelect('custom')}
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
                <div>• Video Content Scripts</div>
                <div>• Twitter (X) Threads</div>
                <div>• Custom Formats</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Updated Header */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-primary mb-2">
            Welcome, {getUserFirstName()}
          </h1>
          <p className="text-gray-600 text-lg">
            What GTM content type would you auto-craft?
          </p>
          <p className="text-gray-500 text-base">
            Choose or start from a Saved Idea below.
          </p>
        </div>

        {/* Ideas Integration */}
        {filteredIdeas.length > 0 && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium text-blue-800">Use a Saved Idea</p>
                    <p className="text-sm text-blue-600">
                      Select an idea to get started
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={selectedIdea?.id || ''}
                    onChange={(e) => {
                      const idea = filteredIdeas.find(i => i.id === e.target.value);
                      handleIdeaSelection(idea || null);
                    }}
                    className="text-sm border border-blue-300 rounded px-2 py-1 bg-white"
                  >
                    <option value="">Select an idea...</option>
                    {filteredIdeas.map(idea => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>
                  {onNavigateToIdeasBank && (
                    <Button
                      onClick={onNavigateToIdeasBank}
                      variant="outline"
                      size="sm"
                      className="text-blue-600 border-blue-300 hover:bg-blue-50"
                    >
                      View Ideas Bank
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Mint New Ideas Option */}
        {onNavigateToIdeasBank && (
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Sparkles className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium text-green-800">Mint New Ideas</p>
                    <p className="text-sm text-green-600">
                      Generate fresh content ideas for your next campaign
                    </p>
                  </div>
                </div>
                <Button
                  onClick={onNavigateToIdeasBank}
                  className="bg-green-600 hover:bg-green-700 text-white"
                  size="sm"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Mint Ideas
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductCampaignCard onClick={() => handleContentTypeSelect('product-campaign')} />
        
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => handleContentTypeSelect('article')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <FileText className="h-8 w-8 text-brand-primary" />
              <Badge variant="secondary">Popular</Badge>
            </div>
            <CardTitle className="text-xl text-brand-primary">GTM Articles</CardTitle>
            <p className="text-gray-600 text-sm">
              Long-form thought leadership, product showcases, and how-to guides
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Thought Leadership</div>
              <div>• Product Showcases</div>
              <div>• Detailed How-to Guides</div>
              <div>• Industry Insights</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => handleContentTypeSelect('linkedin')}
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
          onClick={() => handleContentTypeSelect('email')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <Mail className="h-8 w-8 text-green-600" />
              <Badge variant="outline">Direct</Badge>
            </div>
            <CardTitle className="text-xl text-green-600">Sales Email</CardTitle>
            <p className="text-gray-600 text-sm">
              Expansion, nurture sequences, sales outreach
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <div>• Upsell & Cross-sell Emails</div>
              <div>• Cold Outbound Emails</div>
              <div>• Nurture Sequences</div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 border-2 hover:border-brand-primary/30"
          onClick={() => handleContentTypeSelect('success-story')}
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
          onClick={() => handleContentTypeSelect('custom')}
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
              <div>• Video Content Scripts</div>
              <div>• Twitter (X) Threads</div>
              <div>• Custom Formats</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentTypeSelector;
