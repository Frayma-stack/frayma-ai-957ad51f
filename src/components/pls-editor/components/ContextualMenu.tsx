import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Edit3,
  MessageSquare,
  X,
  Sparkles,
  Palette,
  Lightbulb
} from 'lucide-react';
import { AutoCraftingConfig } from '../../gtm-narrative/outline/AutoCraftingReadinessDialog';
import BusinessContentSelector from './BusinessContentSelector';

interface ContextualMenuProps {
  position: { x: number; y: number };
  selectedText: string;
  fullContent: string;
  onClose: () => void;
  onEdit: (newText: string) => void;
  onAddComment: (comment: string) => void;
  autoCraftingConfig: AutoCraftingConfig;
  authorTones?: Array<{ id: string; name: string; description: string }>;
}

const ContextualMenu: FC<ContextualMenuProps> = ({
  position,
  selectedText,
  fullContent,
  onClose,
  onEdit,
  onAddComment,
  autoCraftingConfig,
  authorTones = []
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'comment' | 'weave'>('edit');
  const [editedText, setEditedText] = useState(selectedText);
  const [comment, setComment] = useState('');
  const [selectedTone, setSelectedTone] = useState(autoCraftingConfig.writingTone);
  const [narrativeDirection, setNarrativeDirection] = useState('');

  // Check if selected text is long enough for business content weaving (paragraph or more)
  const isLongEnoughForWeaving = selectedText.split(' ').length >= 20;

  // Use author tones if available, otherwise fallback to default tones
  const toneOptions = authorTones.length > 0 
    ? authorTones.map(tone => tone.name)
    : [
        'Professional',
        'Conversational',
        'Authoritative',
        'Friendly',
        'Analytical',
        'Inspiring',
        'Direct',
        'Storytelling'
      ];

  const handleRephraseWithAI = () => {
    // Simulate AI rephrase
    const rephrasedText = `[AI Rephrase: ${selectedText}]`;
    setEditedText(rephrasedText);
  };

  const handleApplyEdit = () => {
    onEdit(editedText);
    onClose();
  };

  const handleAddComment = () => {
    onAddComment(comment);
    onClose();
  };

  return (
    <div
      className="fixed z-50"
      style={{
        left: Math.max(10, Math.min(position.x - 150, window.innerWidth - 310)),
        top: Math.max(10, position.y - 10)
      }}
    >
      <Card className="w-72 bg-background/95 backdrop-blur-sm shadow-xl border border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Edit Selection</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Tab Selector */}
          <div className="flex space-x-1 bg-muted/50 rounded-md p-1">
            <Button
              variant={activeTab === 'edit' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('edit')}
              className="flex-1 text-xs"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button
              variant={activeTab === 'comment' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('comment')}
              className="flex-1 text-xs"
            >
              <MessageSquare className="h-3 w-3 mr-1" />
              Comment
            </Button>
            {isLongEnoughForWeaving && (
              <Button
                variant={activeTab === 'weave' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('weave')}
                className="flex-1 text-xs"
              >
                <Sparkles className="h-3 w-3 mr-1" />
                Weave
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {activeTab === 'edit' ? (
            <>
              {/* Edit Options */}
              <div className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRephraseWithAI}
                  className="w-full justify-start"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Rephrase with AI
                </Button>

                {/* Tone Selector */}
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center">
                    <Palette className="h-3 w-3 mr-1" />
                    Choose Tone
                  </label>
                  <Select value={selectedTone} onValueChange={setSelectedTone}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {toneOptions.map((tone) => (
                        <SelectItem key={tone} value={tone} className="text-xs">
                          {tone}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Narrative Direction */}
                <div className="space-y-2">
                  <label className="text-xs font-medium flex items-center">
                    <Lightbulb className="h-3 w-3 mr-1" />
                    Narrative Direction
                  </label>
                  <Input
                    placeholder="Add POV or narrative direction..."
                    value={narrativeDirection}
                    onChange={(e) => setNarrativeDirection(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>

                {/* Edit Text */}
                <div className="space-y-2">
                  <label className="text-xs font-medium">Edit Text</label>
                  <Textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    rows={3}
                    className="text-xs resize-none"
                  />
                </div>

                <Button onClick={handleApplyEdit} size="sm" className="w-full">
                  Apply Changes
                </Button>
              </div>
            </>
          ) : activeTab === 'weave' ? (
            <>
              {/* Business Content Weaving */}
              {isLongEnoughForWeaving ? (
                <BusinessContentSelector
                  selectedText={selectedText}
                  fullContent={fullContent}
                  narrativeDirection={narrativeDirection}
                  onWeaveContent={(newText) => {
                    onEdit(newText);
                    onClose();
                  }}
                  onClose={onClose}
                />
              ) : (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Please highlight a longer section (20+ words) to weave in business content.
                </div>
              )}
            </>
          ) : (
            <>
              {/* Comment Section */}
              <div className="space-y-3">
                <div className="text-xs text-muted-foreground">
                  Selected: "{selectedText.substring(0, 50)}..."
                </div>
                
                <Textarea
                  placeholder="Add your comment..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={3}
                  className="text-xs resize-none"
                />

                <Button
                  onClick={handleAddComment}
                  size="sm"
                  className="w-full"
                  disabled={!comment.trim()}
                >
                  Add Comment
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ContextualMenu;