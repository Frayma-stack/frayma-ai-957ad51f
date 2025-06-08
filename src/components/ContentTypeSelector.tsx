
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
  Package
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

  const contentTypes = [
    {
      type: 'article' as ContentType,
      title: 'GTM Narrative',
      description: 'Long-form thought leadership content',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      type: 'success-story' as ContentType,
      title: 'Success Story',
      description: 'Customer case studies and testimonials',
      icon: Trophy,
      color: 'bg-green-500',
    },
    {
      type: 'linkedin' as ContentType,
      title: 'LinkedIn Post',
      description: 'Professional social media content',
      icon: Linkedin,
      color: 'bg-blue-600',
    },
    {
      type: 'email' as ContentType,
      title: 'Email Copy',
      description: 'Marketing and outreach emails',
      icon: Mail,
      color: 'bg-purple-500',
    },
    {
      type: 'custom' as ContentType,
      title: 'Custom Content',
      description: 'Flexible content for any purpose',
      icon: Wand2,
      color: 'bg-orange-500',
    },
    {
      type: 'product-campaign' as ContentType,
      title: 'Product Campaign',
      description: 'Product-focused marketing campaigns',
      icon: Package,
      color: 'bg-indigo-500',
    },
  ];

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
          What GTM asset do you need help auto-crafting?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Choose or start from a Saved Idea below.
        </p>
      </div>

      {/* Ideas Bank Section */}
      {selectedClientId && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <Lightbulb className="h-5 w-5" />
              Ideas Bank ({clientIdeas.length} saved ideas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-yellow-700">
                Jump-start your content creation with previously saved ideas.
              </p>
              
              {clientIdeas.length > 0 ? (
                <div className="space-y-3">
                  <h4 className="font-medium text-yellow-800">Recent Ideas:</h4>
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
                Go to Ideas Bank
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Types Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contentTypes.map((content) => {
          const Icon = content.icon;
          return (
            <Card 
              key={content.type}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105 border-2 hover:border-gray-300"
              onClick={() => onSelect(content.type)}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 ${content.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {content.title}
                </h3>
                <p className="text-gray-600">
                  {content.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
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
