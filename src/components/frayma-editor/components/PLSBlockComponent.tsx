import React, { useState } from 'react';
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Hash, 
  Target, 
  Sparkles, 
  TrendingUp, 
  Lock, 
  Unlock,
  Edit3,
  Check,
  X 
} from 'lucide-react';

interface PLSBlockComponentProps extends NodeViewProps {
  // NodeViewProps already includes node, updateAttributes, etc.
}

const BLOCK_CONFIG = {
  relatable: {
    icon: Hash,
    title: 'Relatable Hook',
    description: 'Start with something your audience recognizes from their own experience',
    color: 'bg-blue-50 border-blue-200',
    badgeColor: 'bg-blue-100 text-blue-800',
    guidance: 'Open with a scenario, challenge, or moment your target audience will immediately recognize. Make them think "Yes, I\'ve been there too." Keep it under 50 words.',
  },
  real: {
    icon: Target,
    title: 'Real Problem',
    description: 'Define the genuine problem and why it matters now',
    color: 'bg-red-50 border-red-200',
    badgeColor: 'bg-red-100 text-red-800',
    guidance: 'Articulate the specific problem your audience faces. What pain point keeps them awake at night? What\'s the cost of inaction? Be specific and quantify when possible.',
  },
  remarkable: {
    icon: Sparkles,
    title: 'Remarkable Solution',
    description: 'Present your unique solution and value proposition',
    color: 'bg-purple-50 border-purple-200',
    badgeColor: 'bg-purple-100 text-purple-800',
    guidance: 'Showcase how your product uniquely solves the problem. What makes it different from alternatives? Focus on the transformation it enables, not just features.',
  },
  results: {
    icon: TrendingUp,
    title: 'Results & Proof',
    description: 'Share specific outcomes and social proof',
    color: 'bg-green-50 border-green-200',
    badgeColor: 'bg-green-100 text-green-800',
    guidance: 'Provide measurable outcomes, testimonials, case studies, or proof points. What specific results can customers expect? Include metrics, quotes, or success stories.',
  },
};

export const PLSBlockComponent: React.FC<PLSBlockComponentProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempContent, setTempContent] = useState(node.attrs.content);
  
  const config = BLOCK_CONFIG[node.attrs.type];
  const IconComponent = config.icon;

  const handleSave = () => {
    updateAttributes({ content: tempContent });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempContent(node.attrs.content);
    setIsEditing(false);
  };

  const toggleLock = () => {
    updateAttributes({ locked: !node.attrs.locked });
  };

  return (
    <NodeViewWrapper className={`pls-block ${selected ? 'ring-2 ring-brand-primary' : ''}`}>
      <Card className={`${config.color} border-2 transition-all duration-200 ${selected ? 'shadow-lg' : 'shadow-sm'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <IconComponent className="h-5 w-5 text-gray-700" />
              <CardTitle className="text-lg font-semibold">{config.title}</CardTitle>
              <Badge className={config.badgeColor}>{node.attrs.type.toUpperCase()}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleLock}
                className="h-8 w-8 p-0"
              >
                {node.attrs.locked ? (
                  <Lock className="h-4 w-4" />
                ) : (
                  <Unlock className="h-4 w-4" />
                )}
              </Button>
              {!node.attrs.locked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="h-8 w-8 p-0"
                >
                  <Edit3 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-600">{config.description}</p>
        </CardHeader>
        
        <CardContent className="pt-0">
          {/* Guidance */}
          <div className="mb-4 p-3 bg-white/50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-700 leading-relaxed">
              <strong>Guidance:</strong> {config.guidance}
            </p>
          </div>

          {/* Content Area */}
          {isEditing ? (
            <div className="space-y-3">
              <Textarea
                value={tempContent}
                onChange={(e) => setTempContent(e.target.value)}
                placeholder={`Write your ${config.title.toLowerCase()} content here...`}
                className="min-h-[120px] resize-none"
                disabled={node.attrs.locked}
              />
              <div className="flex items-center space-x-2">
                <Button size="sm" onClick={handleSave}>
                  <Check className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="min-h-[80px]">
              {node.attrs.content ? (
                <div className="prose prose-sm max-w-none">
                  <NodeViewContent />
                </div>
              ) : (
                <div className="text-gray-500 italic">
                  Click edit to add your {config.title.toLowerCase()} content...
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </NodeViewWrapper>
  );
};