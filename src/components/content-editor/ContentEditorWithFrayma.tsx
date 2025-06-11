
import React, { useState, useEffect } from 'react';
import { FraymaEditor } from '@/components/frayma-editor/FraymaEditor';
import { FraymaDocument, UserRole, NarrativeAnchor } from '@/components/frayma-editor/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, FileText, Lightbulb } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ContentEditorWithFraymaProps {
  initialContent: string;
  contentType: string;
  contentTypeLabel: string;
  onBack: () => void;
  onContentChange?: (content: string) => void;
}

export const ContentEditorWithFrayma: React.FC<ContentEditorWithFraymaProps> = ({
  initialContent,
  contentType,
  contentTypeLabel,
  onBack,
  onContentChange
}) => {
  const { toast } = useToast();
  const [document, setDocument] = useState<FraymaDocument>(() => {
    const plsInitialContent = initialContent || getPLSTemplate();
    
    // Create properly typed narrative anchors
    const narrativeAnchors: NarrativeAnchor[] = [
      {
        id: 'problem-solution-fit',
        type: 'Problem-Solution Fit',
        content: 'Connect customer pain points to your solution',
        strength: 0.8,
        resonanceFactors: ['pain_point', 'solution_clarity'],
        isLocked: false
      },
      {
        id: 'customer-journey',
        type: 'Customer Journey Mapping', 
        content: 'Map the transformation story from before to after',
        strength: 0.7,
        resonanceFactors: ['transformation', 'journey'],
        isLocked: false
      },
      {
        id: 'value-demonstration',
        type: 'Value Demonstration',
        content: 'Show concrete value and outcomes',
        strength: 0.9,
        resonanceFactors: ['value_prop', 'outcomes'],
        isLocked: false
      },
      {
        id: 'social-proof',
        type: 'Social Proof Integration',
        content: 'Include testimonials and success metrics',
        strength: 0.8,
        resonanceFactors: ['credibility', 'proof'],
        isLocked: false
      }
    ];
    
    return {
      id: `${contentType}-${Date.now()}`,
      title: `${contentTypeLabel} - ${new Date().toLocaleDateString()}`,
      content: plsInitialContent,
      outline: [
        {
          id: 'hook-section',
          type: 'paragraph',
          title: 'Hook & Context Setting',
          content: '',
          order: 1
        },
        {
          id: 'problem-section',
          type: 'paragraph',
          title: 'Problem Definition & Stakes',
          content: '',
          order: 2
        },
        {
          id: 'solution-section',
          type: 'paragraph',
          title: 'Solution Presentation',
          content: '',
          order: 3
        },
        {
          id: 'results-section',
          type: 'paragraph',
          title: 'Results & Social Proof',
          content: '',
          order: 4
        },
        {
          id: 'cta-section',
          type: 'paragraph',
          title: 'Call to Action',
          content: '',
          order: 5
        }
      ],
      context: {
        storyBrief: `PLS-focused ${contentTypeLabel.toLowerCase()} following Product-Led Storytelling principles`,
        narrativeAnchors: narrativeAnchors,
        targetAudience: 'Business decision makers and technical evaluators',
        authorVoice: {
          tone: 'Professional yet approachable',
          experiences: ['Product implementation', 'Customer success'],
          beliefs: ['Product-led growth', 'Customer-centric approach']
        },
        productContext: {
          features: [],
          useCases: [],
          differentiators: []
        }
      },
      metadata: {
        wordCount: plsInitialContent.split(' ').length,
        readingTime: Math.ceil(plsInitialContent.split(' ').length / 200),
        lastEditedBy: 'Current User',
        tags: [contentType, 'pls-approach', '3rs-formula']
      },
      collaborators: [],
      comments: [],
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  // Remove auto-save to prevent automatic draft creation
  // Auto-save only when user explicitly makes changes
  useEffect(() => {
    if (onContentChange && document.content !== initialContent && document.content !== getPLSTemplate()) {
      const timeoutId = setTimeout(() => {
        console.log('💾 Manual save triggered by user content change');
        onContentChange(document.content);
      }, 3000); // Longer delay to prevent accidental saves

      return () => clearTimeout(timeoutId);
    }
  }, [document.content, onContentChange, initialContent]);

  const handleSave = (updatedDocument: FraymaDocument) => {
    console.log('📝 PLS Editor: Document manually saved', { 
      contentLength: updatedDocument.content.length,
      wordCount: updatedDocument.metadata.wordCount 
    });
    
    setDocument(updatedDocument);
    
    if (onContentChange) {
      onContentChange(updatedDocument.content);
    }
    
    toast({
      title: "Draft Saved",
      description: "Your PLS-focused content has been saved successfully.",
    });
  };

  const handleExport = (format: 'markdown' | 'docx' | 'googledocs') => {
    toast({
      title: "Export Started", 
      description: `Exporting PLS content as ${format.toUpperCase()}...`,
    });
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header with PLS guidance */}
      <div className="border-b bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Drafts</span>
            </Button>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-brand-primary" />
              <h1 className="text-xl font-semibold">{contentTypeLabel} - PLS Editor</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Lightbulb className="h-4 w-4" />
            <span>Using Product-Led Storytelling & 3Rs Formula</span>
          </div>
        </div>
        
        {/* PLS Guidance Banner */}
        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            <strong>PLS Framework:</strong> Follow the 3Rs Formula - 
            <span className="font-medium"> Relatable Hook → Real Problem → Remarkable Solution → Results & Proof</span>
          </p>
        </div>
      </div>

      {/* Frayma Editor */}
      <div className="flex-1">
        <FraymaEditor
          documentId={document.id}
          document={document}
          userRole="owner"
          onSave={handleSave}
          onExport={handleExport}
        />
      </div>
    </div>
  );
};

// Improved PLS Template with cleaner, more polished guidance
function getPLSTemplate(): string {
  return `# Your GTM Narrative Draft

## Hook & Context Setting
Start with a relatable scenario that resonates with your target audience. Make them think "Yes, I've been there too."

*PLS Guidance: Open with a moment your audience will recognize from their own experience.*

---

## Problem Definition & Stakes  
Define the real problem your audience faces and why it matters now.

*3Rs Framework - Real Problem: What pain point keeps your prospects awake at night? What's the cost of inaction?*

---

## Solution Presentation
Present your remarkable solution with clear value proposition.

*3Rs Framework - Remarkable Solution: How does your product uniquely solve this problem? What makes it different from alternatives?*

---

## Results & Social Proof
Share specific outcomes and customer success stories.

*3Rs Framework - Results: What measurable outcomes can customers expect? Include testimonials, metrics, and proof points.*

---

## Call to Action
Clear next steps for your audience.

*PLS Guidance: Make it easy for prospects to take the next step. Remove friction and provide clear value for engaging.*

---

*This template follows Product-Led Storytelling approach and 3Rs Formula for maximum narrative impact.*`;
}
