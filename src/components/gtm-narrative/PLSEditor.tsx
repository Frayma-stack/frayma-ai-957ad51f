import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Sparkles, Save, FileText, Brain, TrendingUp, Loader2 } from 'lucide-react';
import { FormData } from './useGTMNarrativeData';
import { AutoCraftingConfig } from './outline/AutoCraftingReadinessDialog';

interface PLSEditorProps {
  formData: FormData;
  autoCraftingConfig: AutoCraftingConfig;
  isGenerating: boolean;
  onDataChange: (field: keyof FormData, value: any) => void;
  onGeneratePhase: (phase: 'body' | 'conclusion') => Promise<void>;
  onBackToOutline: () => void;
  onSaveAsDraft: () => Promise<void>;
}

const PLSEditor: FC<PLSEditorProps> = ({
  formData,
  autoCraftingConfig,
  isGenerating,
  onDataChange,
  onGeneratePhase,
  onBackToOutline,
  onSaveAsDraft
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Auto-save whenever content changes
  useEffect(() => {
    if (formData.generatedIntro || formData.generatedBody || formData.generatedConclusion) {
      setHasUnsavedChanges(true);
      const autoSaveTimer = setTimeout(() => {
        handleSave();
      }, 10000); // Auto-save after 10 seconds of inactivity

      return () => clearTimeout(autoSaveTimer);
    }
  }, [formData.generatedIntro, formData.generatedBody, formData.generatedConclusion]);

  const handleSave = async () => {
    if (!hasUnsavedChanges) return;
    
    setIsSaving(true);
    try {
      await onSaveAsDraft();
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleContentChange = (field: keyof FormData, value: string) => {
    onDataChange(field, value);
    setHasUnsavedChanges(true);
  };

  const formatLastSaved = () => {
    if (!lastSaved) return '';
    return `Last saved: ${lastSaved.toLocaleTimeString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBackToOutline} size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Outline
          </Button>
          <div>
            <h2 className="text-2xl font-bold">PLS Content Editor</h2>
            <p className="text-gray-600">Edit your auto-crafted content using the Product-Led Storytelling approach</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-500">
            {isSaving ? (
              <div className="flex items-center">
                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                Saving...
              </div>
            ) : hasUnsavedChanges ? (
              <span className="text-orange-600">Unsaved changes</span>
            ) : (
              formatLastSaved()
            )}
          </div>
          <Button onClick={handleSave} disabled={!hasUnsavedChanges || isSaving} size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Content Configuration Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Auto-Crafting Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Writing Tone:</span>
              <Badge variant="secondary" className="ml-2">{autoCraftingConfig.writingTone}</Badge>
            </div>
            <div>
              <span className="font-medium">Word Counts:</span>
              <span className="ml-2 text-gray-600">
                Intro: {autoCraftingConfig.introWordCount} | Body: {autoCraftingConfig.bodyWordCount} | Conclusion: {autoCraftingConfig.conclusionWordCount}
              </span>
            </div>
            <div>
              <span className="font-medium">Total:</span>
              <span className="ml-2 font-medium">
                {autoCraftingConfig.introWordCount + autoCraftingConfig.bodyWordCount + autoCraftingConfig.conclusionWordCount} words
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PLS Phases */}
      <div className="space-y-6">
        {/* Phase 1: Resonance (Introduction) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Brain className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Resonance Phase</CardTitle>
                  <p className="text-sm text-gray-600">PLS Steps 1-3: Filter & Build Connection</p>
                </div>
              </div>
              <Badge variant="secondary">Introduction</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.generatedIntro || ''}
              onChange={(e) => handleContentChange('generatedIntro', e.target.value)}
              placeholder="Your introduction content will appear here after auto-crafting..."
              className="min-h-[200px] resize-y"
            />
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Target: {autoCraftingConfig.introWordCount} words</span>
              <span>Current: {(formData.generatedIntro || '').split(' ').filter(w => w.length > 0).length} words</span>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Phase 2: Relevance (Main Body) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Relevance Phase</CardTitle>
                  <p className="text-sm text-gray-600">PLS Steps 4-6: Engage & Show Value</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Main Body</Badge>
                <Button
                  onClick={() => onGeneratePhase('body')}
                  disabled={isGenerating || !formData.generatedIntro}
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Craft Main Body
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.generatedBody || ''}
              onChange={(e) => handleContentChange('generatedBody', e.target.value)}
              placeholder="Click 'Auto-Craft Main Body' to generate content for this section..."
              className="min-h-[300px] resize-y"
            />
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Target: {autoCraftingConfig.bodyWordCount} words</span>
              <span>Current: {(formData.generatedBody || '').split(' ').filter(w => w.length > 0).length} words</span>
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Phase 3: Results (Conclusion) */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Results Phase</CardTitle>
                  <p className="text-sm text-gray-600">PLS Steps 7-9: Persuade & Convert</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Conclusion</Badge>
                <Button
                  onClick={() => onGeneratePhase('conclusion')}
                  disabled={isGenerating || !formData.generatedBody}
                  size="sm"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Auto-Craft Conclusion
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Textarea
              value={formData.generatedConclusion || ''}
              onChange={(e) => handleContentChange('generatedConclusion', e.target.value)}
              placeholder="Click 'Auto-Craft Conclusion' to generate the final section..."
              className="min-h-[250px] resize-y"
            />
            <div className="flex justify-between items-center mt-4 text-sm text-gray-500">
              <span>Target: {autoCraftingConfig.conclusionWordCount} words</span>
              <span>Current: {(formData.generatedConclusion || '').split(' ').filter(w => w.length > 0).length} words</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Final Actions */}
      <div className="flex justify-between items-center pt-6 border-t">
        <Button variant="outline" onClick={onBackToOutline}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Content Architecture
        </Button>
        
        <div className="flex space-x-3">
          <Button onClick={handleSave} disabled={!hasUnsavedChanges || isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            className="bg-story-blue hover:bg-story-blue/90"
            disabled={!formData.generatedIntro || !formData.generatedBody || !formData.generatedConclusion}
          >
            Complete Article
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PLSEditor;