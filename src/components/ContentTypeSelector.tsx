
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { GeneratedIdea } from '@/types/ideas';
import ContentTypeSelectorHeader from './content-type-selector/ContentTypeSelectorHeader';
import IdeasBankSection from './content-type-selector/IdeasBankSection';
import ContentTypesGrid from './content-type-selector/ContentTypesGrid';
import MintNewIdeasSection from './content-type-selector/MintNewIdeasSection';

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
    <div className="space-y-6">
      {/* Greeting Section */}
      <ContentTypeSelectorHeader />

      {/* Saved Ideas Selection */}
      <IdeasBankSection
        selectedClientId={selectedClientId}
        ideas={ideas}
        selectedIdeaId={selectedIdeaId}
        onIdeaSelect={onIdeaSelect}
        onNavigateToIdeasBank={handleNavigateToIdeasBank}
      />

      {/* Content Types Grid */}
      <div>
        <ContentTypesGrid onSelect={onSelect} />
      </div>

      {/* Mint New Ideas Section - Moved to bottom */}
      <MintNewIdeasSection onNavigateToIdeasBank={handleNavigateToIdeasBank} />

      {/* Selected Idea Indicator */}
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
