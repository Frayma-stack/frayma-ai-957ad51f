
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Editor } from '@tiptap/react';
import { Sparkles, Check, X, RefreshCw, Lightbulb } from 'lucide-react';
import { FraymaDocument, AIsuggestion } from '../types';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface AISuggestionsSidebarProps {
  editor: Editor;
  selectedBlock: string | null;
  document: FraymaDocument;
  onApplySuggestion: (type: string, content: string) => void;
}

export const AISuggestionsSidebar: React.FC<AISuggestionsSidebarProps> = ({
  editor,
  selectedBlock,
  document,
  onApplySuggestion
}) => {
  const { generateContent, isConfigured } = useChatGPT();
  const [suggestions, setSuggestions] = useState<AIsuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');

  const selectedContent = selectedBlock ? 
    editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    ) : '';

  const generateSuggestions = async (type: 'improve' | 'rewrite' | 'expand') => {
    if (!isConfigured || !selectedContent) return;

    setIsGenerating(true);
    try {
      const contextPrompt = `
        Document Context:
        - Story Brief: ${document.context.storyBrief}
        - Target Audience: ${document.context.targetAudience}
        - Author Voice: ${document.context.authorVoice.tone}
        - Narrative Anchors: ${document.context.narrativeAnchors.map(a => `${a.type}: ${a.content}`).join(', ')}
        
        Selected Content: "${selectedContent}"
        
        Task: ${type === 'improve' ? 'Improve this content while maintaining the author voice and narrative anchors' :
               type === 'rewrite' ? 'Rewrite this content in a different style while keeping the core message' :
               'Expand this content with more detail and examples'}
      `;

      const suggestion = await generateContent(contextPrompt);
      
      const newSuggestion: AIsuggestion = {
        id: Date.now().toString(),
        type,
        content: suggestion,
        originalContent: selectedContent,
        confidence: 0.85,
        reasoning: `Generated ${type} suggestion based on document context`
      };

      setSuggestions(prev => [newSuggestion, ...prev.slice(0, 4)]);
    } catch (error) {
      console.error('Failed to generate AI suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCustomSuggestion = async () => {
    if (!customPrompt.trim() || !isConfigured) return;

    setIsGenerating(true);
    try {
      const contextPrompt = `
        Document Context:
        - Story Brief: ${document.context.storyBrief}
        - Author Voice: ${document.context.authorVoice.tone}
        
        Current Content: "${selectedContent}"
        
        User Request: ${customPrompt}
        
        Please provide a suggestion that maintains the document's narrative style and author voice.
      `;

      const suggestion = await generateContent(contextPrompt);
      
      const newSuggestion: AIsuggestion = {
        id: Date.now().toString(),
        type: 'rewrite',
        content: suggestion,
        originalContent: selectedContent,
        confidence: 0.80,
        reasoning: `Custom suggestion: ${customPrompt}`
      };

      setSuggestions(prev => [newSuggestion, ...prev.slice(0, 4)]);
      setCustomPrompt('');
    } catch (error) {
      console.error('Failed to generate custom suggestion:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = (suggestion: AIsuggestion) => {
    onApplySuggestion(suggestion.type, suggestion.content);
    // Remove applied suggestion
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
  };

  const dismissSuggestion = (suggestionId: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== suggestionId));
  };

  return (
    <div className="w-80 border-l bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <Sparkles className="h-5 w-5 mr-2 text-blue-500" />
            AI Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedContent ? (
            <>
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800 font-medium mb-2">Selected Text:</p>
                <p className="text-xs text-blue-700 italic">"{selectedContent.slice(0, 100)}..."</p>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => generateSuggestions('improve')}
                  disabled={isGenerating}
                >
                  <Lightbulb className="h-4 w-4 mr-2" />
                  Improve This Block
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => generateSuggestions('rewrite')}
                  disabled={isGenerating}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rewrite Style
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => generateSuggestions('expand')}
                  disabled={isGenerating}
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Expand Content
                </Button>
              </div>

              <div className="space-y-2">
                <Textarea
                  placeholder="Custom AI request..."
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  className="text-sm"
                  rows={3}
                />
                <Button
                  size="sm"
                  className="w-full"
                  onClick={handleCustomSuggestion}
                  disabled={!customPrompt.trim() || isGenerating}
                >
                  Generate Custom Suggestion
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Sparkles className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm">Select text to get AI suggestions</p>
            </div>
          )}

          {isGenerating && (
            <div className="flex items-center justify-center py-4">
              <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              <span className="text-sm text-gray-600">Generating suggestions...</span>
            </div>
          )}

          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Recent Suggestions</h4>
              {suggestions.map((suggestion) => (
                <Card key={suggestion.id} className="border">
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {suggestion.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {Math.round(suggestion.confidence * 100)}% confidence
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {suggestion.content.slice(0, 150)}...
                    </p>
                    <p className="text-xs text-gray-500 mb-3 italic">
                      {suggestion.reasoning}
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => applySuggestion(suggestion)}
                        className="flex-1"
                      >
                        <Check className="h-3 w-3 mr-1" />
                        Apply
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => dismissSuggestion(suggestion.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
