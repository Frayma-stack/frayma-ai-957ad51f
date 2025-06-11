
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Editor } from '@tiptap/react';
import { ChevronRight, Lock, Hash, FileText, Quote, Plus, Edit2 } from 'lucide-react';
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
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [showAddSection, setShowAddSection] = useState(false);

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

  const addHeading = (level: 2 | 3, title?: string) => {
    const headingText = title || `New ${level === 2 ? 'Section' : 'Subsection'}`;
    const headingMarkdown = `${'#'.repeat(level)} ${headingText}`;
    
    editor.chain().focus().insertContent(`\n\n${headingMarkdown}\n\n`).run();
    
    if (showAddSection) {
      setShowAddSection(false);
      setNewSectionTitle('');
    }
  };

  const addCustomSection = () => {
    if (newSectionTitle.trim()) {
      addHeading(2, newSectionTitle.trim());
    }
  };

  const insertPLSBlock = (type: 'hook' | 'problem' | 'solution' | 'results' | 'cta') => {
    const blocks = {
      hook: {
        title: 'Relatable Hook',
        content: 'Start with a scenario your audience recognizes...',
        guidance: 'Make them think "I\'ve been there too"'
      },
      problem: {
        title: 'Real Problem',
        content: 'Define the specific challenge your audience faces...',
        guidance: 'What pain point keeps them awake at night?'
      },
      solution: {
        title: 'Remarkable Solution', 
        content: 'Present how your product uniquely solves this...',
        guidance: 'What makes your approach different?'
      },
      results: {
        title: 'Results & Proof',
        content: 'Share specific outcomes and success stories...',
        guidance: 'Include metrics, testimonials, and proof points'
      },
      cta: {
        title: 'Call to Action',
        content: 'Clear next steps for your audience...',
        guidance: 'Remove friction and provide clear value'
      }
    };

    const block = blocks[type];
    const blockContent = `
## ${block.title}
${block.content}

*${block.guidance}*

---
`;

    editor.chain().focus().insertContent(blockContent).run();
  };

  return (
    <div className="w-80 border-r bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            Document Outline
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAddSection(!showAddSection)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Add Section Interface */}
          {showAddSection && (
            <div className="p-3 bg-white rounded-lg border space-y-2">
              <Input
                placeholder="Section title..."
                value={newSectionTitle}
                onChange={(e) => setNewSectionTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCustomSection();
                  }
                }}
              />
              <div className="flex space-x-2">
                <Button size="sm" onClick={addCustomSection}>
                  Add H2
                </Button>
                <Button size="sm" variant="outline" onClick={() => addHeading(3, newSectionTitle.trim())}>
                  Add H3
                </Button>
              </div>
            </div>
          )}

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

      {/* PLS Content Blocks */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">PLS Content Blocks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => insertPLSBlock('hook')}
          >
            <Hash className="h-4 w-4 mr-2 text-blue-500" />
            Relatable Hook
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => insertPLSBlock('problem')}
          >
            <FileText className="h-4 w-4 mr-2 text-red-500" />
            Real Problem
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => insertPLSBlock('solution')}
          >
            <Edit2 className="h-4 w-4 mr-2 text-green-500" />
            Remarkable Solution
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => insertPLSBlock('results')}
          >
            <Quote className="h-4 w-4 mr-2 text-purple-500" />
            Results & Proof
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => insertPLSBlock('cta')}
          >
            <ChevronRight className="h-4 w-4 mr-2 text-orange-500" />
            Call to Action
          </Button>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-sm">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => addHeading(2)}
          >
            <Hash className="h-4 w-4 mr-2" />
            Add H2 Section
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => addHeading(3)}
          >
            <Hash className="h-4 w-4 mr-2" />
            Add H3 Subsection
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
