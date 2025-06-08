
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Trophy, 
  Linkedin, 
  Mail, 
  Lightbulb,
  Wand2,
  Package,
  Star,
  TrendingUp,
  MessageSquare,
  Target,
  Sparkles
} from "lucide-react";
import { GeneratedIdea } from '@/types/ideas';
import { ScrollArea } from "@/components/ui/scroll-area";

export type ContentType = 'article' | 'success-story' | 'linkedin' | 'email' | 'custom' | 'product-campaign';

interface ContentTypeSelectorProps {
  onSelect: (type: ContentType) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string | null;
  selectedIdeaId?: string | null;
  onIdeaSelect?: (ideaId: string | null) => void;
  onNavigateToIdeasBank?: () => void;
}

const ContentTypeSelector: React.FC<ContentTypeSelectorProps> = ({ 
  onSelect, 
  ideas = [], 
  selectedClientId,
  selectedIdeaId,
  onIdeaSelect,
  onNavigateToIdeasBank
}) => {
  console.log('🎯 ContentTypeSelector render:', { 
    selectedClientId, 
    ideasCount: ideas.length,
    selectedIdeaId 
  });

  // Filter ideas for the selected client
  const clientIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : [];

  const handleNavigateToIdeasBank = () => {
    console.log('🎯 ContentTypeSelector: Dispatching navigate-to-ideas-bank event');
    
    // Dispatch custom event for navigation
    const event = new CustomEvent('navigate-to-ideas-bank', {
      detail: { clientId: selectedClientId }
    });
    window.dispatchEvent(event);
    
    // Also call the callback if provided
    if (onNavigateToIdeasBank) {
      onNavigateToIdeasBank();
    }
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, [app user's first name]
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          What GTM asset do you need help auto-crafting?
        </p>
        <p className="text-md text-gray-500 mb-6">
          Choose or start from a Saved Idea below.
        </p>
      </div>

      {/* Ideas Bank Section */}
      {selectedClientId && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              Use a Saved Idea
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-700">
                Select an idea to get started
              </p>
              
              {clientIdeas.length > 0 ? (
                <div className="space-y-3">
                  <ScrollArea className="h-32">
                    <div className="space-y-2">
                      {clientIdeas.slice(0, 5).map((idea) => (
                        <div 
                          key={idea.id}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            selectedIdeaId === idea.id 
                              ? 'bg-yellow-200 border-2 border-yellow-400' 
                              : 'bg-white hover:bg-yellow-100 border border-yellow-200'
                          }`}
                          onClick={() => onIdeaSelect?.(selectedIdeaId === idea.id ? null : idea.id)}
                        >
                          <div className="font-medium text-sm text-gray-900">{idea.title}</div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">{idea.narrative}</div>
                          {idea.score && (
                            <Badge variant="secondary" className="mt-2 text-xs">
                              Score: {idea.score.value}/3
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="text-sm text-gray-500">
                    Select an idea… 
                  </div>
                </div>
              ) : (
                <p className="text-yellow-600 text-sm">
                  No ideas saved yet. Create some ideas first!
                </p>
              )}
              
              <Button 
                onClick={handleNavigateToIdeasBank}
                variant="outline" 
                className="w-full bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-50"
              >
                <Lightbulb className="mr-2 h-4 w-4" />
                View Ideas Bank
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mint New Ideas Section */}
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Frame thoughts into freshly-minted GTM asset ideas…
        </p>
        <Button 
          onClick={handleNavigateToIdeasBank}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg text-lg font-medium"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Mint New Ideas
        </Button>
      </div>

      <div className="border-t pt-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
          Or choose a GTM asset type to create directly:
        </h3>
      </div>

      {/* Content Types Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Campaign Card - Featured */}
        <Card 
          className="cursor-pointer hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 hover:border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50 relative"
          onClick={() => onSelect('product-campaign')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg text-gray-900">Product/Feature Update Campaign</CardTitle>
                  <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 mt-1">
                    <Star className="h-3 w-3 mr-1" />
                    NEW
                  </Badge>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Auto-craft complete GTM content packages for product or feature updates using the Product-Led Storytelling approach.
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge variant="outline" className="text-xs">11 GTM Assets</Badge>
              <Badge variant="outline" className="text-xs">PLS Framework</Badge>
              <Badge variant="outline" className="text-xs">ICP-Targeted</Badge>
              <Badge variant="outline" className="text-xs">Auto-Crafted</Badge>
            </div>
            <div className="bg-white/60 rounded-md p-3">
              <p className="font-medium text-sm text-gray-800 mb-2">Generated Assets Include:</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Articles (General + ICP-specific)</li>
                <li>• Social Posts (LinkedIn, Twitter)</li>
                <li>• Email Newsletter & Changelog</li>
                <li>• Product Video Script</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* GTM Articles */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
          onClick={() => onSelect('article')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">GTM Articles</CardTitle>
                <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Popular
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Long-form thought leadership, product showcases, and how-to guides
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thought Leadership</li>
              <li>• Product Showcases</li>
              <li>• Detailed How-to Guides</li>
              <li>• Industry Insights</li>
            </ul>
          </CardContent>
        </Card>

        {/* LinkedIn Posts */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
          onClick={() => onSelect('linkedin')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                <Linkedin className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">LinkedIn Posts</CardTitle>
                <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mt-1">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Social
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Professional posts that drive engagement and build thought leadership
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Thought Leadership</li>
              <li>• Product Updates</li>
              <li>• Industry Commentary</li>
              <li>• Personal Stories</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sales Email */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
          onClick={() => onSelect('email')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Sales Email</CardTitle>
                <Badge className="bg-red-100 text-red-700 hover:bg-red-100 mt-1">
                  <Target className="h-3 w-3 mr-1" />
                  Direct
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Expansion, nurture sequences, sales outreach
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Upsell & Cross-sell Emails</li>
              <li>• Cold Outbound Emails</li>
              <li>• Nurture Sequences</li>
            </ul>
          </CardContent>
        </Card>

        {/* Success Stories */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
          onClick={() => onSelect('success-story')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Success Stories</CardTitle>
                <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 mt-1">
                  Proof
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Customer case studies and testimonials that build credibility
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Customer Case Studies</li>
              <li>• Implementation Stories</li>
              <li>• ROI Demonstrations</li>
              <li>• Testimonials</li>
            </ul>
          </CardContent>
        </Card>

        {/* Custom Content */}
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
          onClick={() => onSelect('custom')}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg text-gray-900">Custom Content</CardTitle>
                <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 mt-1">
                  Flexible
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Any content type with custom prompts and specifications
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Website Copy</li>
              <li>• Video Content Scripts</li>
              <li>• Twitter (X) Threads</li>
              <li>• Custom Formats</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {selectedIdeaId && (
        <div className="text-center">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Starting from selected idea
          </Badge>
        </div>
      )}
    </div>
  );
};

export default ContentTypeSelector;
