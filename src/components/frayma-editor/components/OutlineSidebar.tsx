
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Editor } from '@tiptap/react';
import { ChevronRight, Lock, Hash, FileText, Quote } from 'lucide-react';
import { FraymaDocument, DocumentSection } from '../types';

interface OutlineSidebarProps {
  document: FraymaDocument;
  editor: Editor;
  onSectionClick: (sectionId: string) => void;
}

export const OutlineSidebar: React.FC<OutlineSidebarProps> = ({
  document,
  editor,
  onSectionClick
}) => {
  const getSectionIcon = (type: string) => {
    switch (type) {
      case 'resonance':
        return <Hash className="h-4 w-4 text-blue-500" />;
      case 'relevance':
        return <FileText className="h-4 w-4 text-green-500" />;
      case 'results':
        return <Quote className="h-4 w-4 text-purple-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSectionBadgeColor = (type: string) => {
    switch (type) {
      case 'resonance':
        return 'bg-blue-100 text-blue-800';
      case 'relevance':
        return 'bg-green-100 text-green-800';
      case 'results':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-80 border-r bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Document Outline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {document.outline.map((section) => (
            <div
              key={section.id}
              className="group cursor-pointer p-3 rounded-lg hover:bg-white transition-colors"
              onClick={() => onSectionClick(section.id)}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getSectionIcon(section.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {section.title}
                    </h4>
                    {section.isLocked && (
                      <Lock className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  <Badge className={`text-xs ${getSectionBadgeColor(section.type)}`}>
                    {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                  </Badge>
                  {section.narrativeAnchor && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Anchor: {section.narrativeAnchor.type}
                      </span>
                    </div>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Smart Blocks Library */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Smart Blocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Insert ResonanceBlock
              editor.chain().focus().insertContent(`
                <div class="resonance-block">
                  <h3>🎯 Narrative Anchor</h3>
                  <p>Add compelling narrative content here...</p>
                </div>
              `).run();
            }}
          >
            <Hash className="h-4 w-4 mr-2 text-blue-500" />
            Resonance Block
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Insert RelevanceBlock
              editor.chain().focus().insertContent(`
                <div class="relevance-block">
                  <h3>🔗 Feature Connection</h3>
                  <p>Explain product relevance here...</p>
                </div>
              `).run();
            }}
          >
            <FileText className="h-4 w-4 mr-2 text-green-500" />
            Relevance Block
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => {
              // Insert ResultsBlock
              editor.chain().focus().insertContent(`
                <div class="results-block">
                  <h3>📊 Results & Impact</h3>
                  <blockquote>Customer success story quote...</blockquote>
                </div>
              `).run();
            }}
          >
            <Quote className="h-4 w-4 mr-2 text-purple-500" />
            Results Block
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
