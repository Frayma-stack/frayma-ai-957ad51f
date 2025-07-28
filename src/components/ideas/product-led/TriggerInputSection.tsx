
import { FC, useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Lightbulb, Upload, FileText, X, File, Loader2, Sparkles } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';
import { useIdeaSummarization } from '@/hooks/useIdeaSummarization';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface TriggerInput {
  type: 'text' | 'file';
  content: string;
  fileName?: string;
  fileDescription?: string;
}

interface TriggerInputSectionProps {
  triggerInput: TriggerInput;
  onTriggerInputChange: (input: TriggerInput) => void;
  ideas?: GeneratedIdea[];
  selectedClientId?: string;
}

const TriggerInputSection: FC<TriggerInputSectionProps> = ({
  triggerInput,
  onTriggerInputChange,
  ideas = [],
  selectedClientId
}) => {
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>('none');
  const [isProcessingIdea, setIsProcessingIdea] = useState(false);
  const [isProcessingFile, setIsProcessingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { summarizeIdeaForContent } = useIdeaSummarization();

  // Filter ideas by selected client
  const filteredIdeas = selectedClientId 
    ? ideas.filter(idea => idea.clientId === selectedClientId)
    : ideas;

  const handleIdeaSelection = async (ideaId: string) => {
    if (!ideaId || ideaId === 'none') {
      setSelectedIdeaId('none');
      return;
    }

    const selectedIdea = filteredIdeas.find(idea => idea.id === ideaId);
    if (!selectedIdea) return;

    setSelectedIdeaId(ideaId);
    setIsProcessingIdea(true);

    try {
      const summary = await summarizeIdeaForContent(selectedIdea);
      onTriggerInputChange({
        ...triggerInput,
        content: summary
      });
      toast.success('Idea summary generated and applied as trigger');
    } catch (error) {
      console.error('Error processing idea:', error);
      toast.error('Failed to process idea. Please try again.');
    } finally {
      setIsProcessingIdea(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF, Word document, Excel file, or text file');
      return;
    }

    setIsProcessingFile(true);

    try {
      // Create form data for file upload
      const formData = new FormData();
      formData.append('file', file);

      // Call edge function to extract text
      const { data, error } = await supabase.functions.invoke('extract-document-text', {
        body: formData,
      });

      if (error) {
        throw new Error(error.message || 'Failed to extract text from file');
      }

      if (data?.extractedText) {
        // Store the extracted text temporarily but don't show it to user
        onTriggerInputChange({
          ...triggerInput,
          content: data.extractedText, // This will be replaced when user describes the file
          fileName: file.name,
          fileDescription: ''
        });
        toast.success(`File uploaded successfully. Please describe how this relates to your GTM ideas.`);
      } else {
        throw new Error('No text could be extracted from the file');
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(`Failed to process file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsProcessingFile(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileDescriptionChange = async (description: string) => {
    onTriggerInputChange({
      ...triggerInput,
      fileDescription: description
    });

    // If we have both extracted text and description, process with backend
    if (triggerInput.content && description.trim() && triggerInput.fileName) {
      setIsProcessingFile(true);
      try {
        const { data, error } = await supabase.functions.invoke('process-file-for-gtm-ideas', {
          body: {
            extractedText: triggerInput.content,
            fileDescription: description,
            businessContext: {} // We'll pass empty for auto-mapping flow
          }
        });

        if (error) {
          throw new Error(error.message || 'Failed to process file with AI');
        }

        if (data?.processedTrigger) {
          onTriggerInputChange({
            ...triggerInput,
            content: data.processedTrigger,
            fileDescription: description
          });
          toast.success('File content processed with AI for GTM ideas generation');
        }
      } catch (error) {
        console.error('Error processing file with AI:', error);
        toast.error(`Failed to process file with AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setIsProcessingFile(false);
      }
    }
  };

  const clearFile = () => {
    onTriggerInputChange({
      ...triggerInput,
      content: '',
      fileName: undefined,
      fileDescription: undefined
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Lightbulb className="h-5 w-5" />
          <span>Idea Trigger</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Saved Ideas Dropdown */}
        {filteredIdeas.length > 0 && (
          <div>
            <Label className="flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Use Saved Idea as Trigger</span>
            </Label>
            <Select value={selectedIdeaId} onValueChange={handleIdeaSelection} disabled={isProcessingIdea}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Select a saved idea to use as trigger..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None - Create custom trigger</SelectItem>
                {filteredIdeas.map((idea) => (
                  <SelectItem key={idea.id} value={idea.id}>
                    {idea.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {isProcessingIdea && (
              <p className="text-sm text-gray-500 mt-1">
                Processing idea and generating summary...
              </p>
            )}
          </div>
        )}

        <div>
          <Label>Input Type</Label>
          <div className="flex space-x-2 mt-2">
            <Button
              variant={triggerInput.type === 'text' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'text' })}
            >
              <FileText className="h-4 w-4 mr-1" />
              Text
            </Button>
            <Button
              variant={triggerInput.type === 'file' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTriggerInputChange({ ...triggerInput, type: 'file' })}
            >
              <Upload className="h-4 w-4 mr-1" />
              Document/File
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        {triggerInput.type === 'file' && (
          <div className="space-y-4">
            <div>
              <Label>Upload Document</Label>
              <div className="mt-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                  onChange={handleFileUpload}
                  disabled={isProcessingFile}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/80"
                />
                {isProcessingFile && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Extracting text from file...
                  </div>
                )}
              </div>
            </div>

            {triggerInput.fileName && (
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex items-center space-x-2">
                  <File className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{triggerInput.fileName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFile}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}

            {triggerInput.fileName && (
              <div>
                <Label>Describe this file's context for GTM ideas</Label>
                <Textarea
                  placeholder="Describe what this file contains and how it relates to minting fresh GTM asset ideas. Be specific about insights, themes, or angles you want to explore..."
                  value={triggerInput.fileDescription || ''}
                  onChange={(e) => handleFileDescriptionChange(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Help us understand how to use this file's content to generate relevant GTM ideas for your business context.
                </p>
              </div>
            )}
          </div>
        )}

        {triggerInput.type !== 'file' && (
          <div>
            <Label>Trigger/Thesis/Anti-thesis</Label>
            <Textarea
              placeholder={selectedIdeaId !== 'none'
                ? "Your saved idea summary will appear here..." 
                : "Type or paste text on what triggered you to mint new GTM asset ideas"
              }
              value={triggerInput.content}
              onChange={(e) => onTriggerInputChange({ ...triggerInput, content: e.target.value })}
              className="min-h-[200px] mt-2"
              disabled={isProcessingIdea || isProcessingFile}
            />
            {selectedIdeaId !== 'none' && (
              <p className="text-sm text-gray-500 mt-1">
                Trigger generated from saved idea. You can edit it above if needed.
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TriggerInputSection;
