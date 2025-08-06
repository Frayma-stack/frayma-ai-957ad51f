import { FC, useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Author } from '@/types/storytelling';

interface AutoCraftingReadinessDialogProps {
  isOpen: boolean;
  authors: Author[];
  selectedAuthorId: string;
  selectedExperiences: Array<{ id: string; title: string; type: 'experience' | 'belief' }>;
  onClose: () => void;
  onProceedToAutoCrafting: (config: AutoCraftingConfig) => void;
}

interface AutoCraftingConfig {
  authorId: string;
  experienceIds: string[];
  writingTone: string;
  introWordCount: number;
  bodyWordCount: number;
  conclusionWordCount: number;
  isShortForm?: boolean;
  contentType?: string;
  currentPhase?: 'intro' | 'body' | 'conclusion';
  metadata?: any;
}

const AutoCraftingReadinessDialog: FC<AutoCraftingReadinessDialogProps> = ({
  isOpen,
  authors,
  selectedAuthorId,
  selectedExperiences,
  onClose,
  onProceedToAutoCrafting
}) => {
  const [config, setConfig] = useState<AutoCraftingConfig>({
    authorId: selectedAuthorId,
    experienceIds: selectedExperiences.map(exp => exp.id),
    writingTone: '',
    introWordCount: 300,
    bodyWordCount: 800,
    conclusionWordCount: 200
  });

  // Update config when props change
  useEffect(() => {
    setConfig(prev => ({
      ...prev,
      authorId: selectedAuthorId,
      experienceIds: selectedExperiences.map(exp => exp.id)
    }));
  }, [selectedAuthorId, selectedExperiences]);

  const selectedAuthor = authors.find(a => a.id === selectedAuthorId);

  const handleProceed = () => {
    if (!config.authorId || !config.writingTone) {
      return;
    }
    onProceedToAutoCrafting(config);
  };

  const canProceed = config.authorId && config.writingTone;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Ready for Auto-Crafting?</DialogTitle>
          <p className="text-sm text-gray-600">
            Configure your content generation settings before Frayma AI begins auto-crafting your content.
          </p>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Selected Author (Read-only) */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Selected Author</Label>
            <div className="p-3 bg-gray-50 rounded-md border">
              <div className="font-medium">{selectedAuthor?.name || 'No author selected'}</div>
              <div className="text-sm text-gray-600">{selectedAuthor?.role || ''}</div>
            </div>
          </div>

          {/* Selected Experiences/Beliefs (Read-only) */}
          {selectedExperiences.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Selected Experiences & Beliefs</Label>
              <div className="flex flex-wrap gap-2">
                {selectedExperiences.map((experience, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {experience.type === 'experience' ? '📚' : '💭'} {experience.title}
                  </Badge>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                These will be woven into the content generation to create authentic first-person narratives.
              </p>
            </div>
          )}

          {/* Writing Tone Selection */}
          {selectedAuthor && selectedAuthor.tones && selectedAuthor.tones.length > 0 && (
            <div>
              <Label className="text-sm font-medium mb-2 block">Select Writing Tone</Label>
              <Select value={config.writingTone} onValueChange={(value) => setConfig(prev => ({ ...prev, writingTone: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose writing tone" />
                </SelectTrigger>
                <SelectContent>
                  {selectedAuthor.tones.map((tone, index) => {
                    const toneText = typeof tone === 'string' ? tone : tone.tone || 'Tone';
                    const toneValue = typeof tone === 'string' ? tone : `${index}`;
                    return (
                      <SelectItem key={index} value={toneValue}>
                        {toneText}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          <Separator />

          {/* Word Count Configuration */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Word Count Configuration</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Introduction</Label>
                <Input
                  type="number"
                  value={config.introWordCount}
                  onChange={(e) => setConfig(prev => ({ ...prev, introWordCount: parseInt(e.target.value) || 300 }))}
                  min={100}
                  max={1000}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Main Body</Label>
                <Input
                  type="number"
                  value={config.bodyWordCount}
                  onChange={(e) => setConfig(prev => ({ ...prev, bodyWordCount: parseInt(e.target.value) || 800 }))}
                  min={300}
                  max={2000}
                />
              </div>
              <div>
                <Label className="text-xs text-gray-500 mb-1 block">Conclusion</Label>
                <Input
                  type="number"
                  value={config.conclusionWordCount}
                  onChange={(e) => setConfig(prev => ({ ...prev, conclusionWordCount: parseInt(e.target.value) || 200 }))}
                  min={100}
                  max={500}
                />
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Total estimated word count: {config.introWordCount + config.bodyWordCount + config.conclusionWordCount} words
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Back to Outline
          </Button>
          <Button onClick={handleProceed} disabled={!canProceed}>
            Begin Auto-Crafting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AutoCraftingReadinessDialog;
export type { AutoCraftingConfig };
