import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, FileAudio, FileText, Mic, Loader2, X, Plus, Info } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface MultiCallICPCreatorProps {
  onScriptGenerated: (script: ICPStoryScript) => void;
  selectedClientId?: string;
}

type CallType = 'sales' | 'onboarding' | 'support' | 'feedback';
type UploadMethod = 'text' | 'document' | 'audio';

interface CallInput {
  id: string;
  callType: CallType;
  uploadMethod: UploadMethod;
  transcript: string;
  file: File | null;
  isProcessing: boolean;
}

const callTypes: { value: CallType; label: string; description: string }[] = [
  { value: 'sales', label: 'Sales Call', description: 'Prospecting, demo, or sales conversation' },
  { value: 'onboarding', label: 'Onboarding Call', description: 'Customer setup or welcome session' },
  { value: 'support', label: 'Support Call', description: 'Support ticket or success check-in' },
  { value: 'feedback', label: 'Feedback Call', description: 'User research or feedback session' }
];

const createEmptyCallInput = (): CallInput => ({
  id: crypto.randomUUID(),
  callType: 'sales',
  uploadMethod: 'text',
  transcript: '',
  file: null,
  isProcessing: false
});

const MultiCallICPCreator: FC<MultiCallICPCreatorProps> = ({
  onScriptGenerated,
  selectedClientId
}) => {
  const [icpName, setIcpName] = useState('');
  const [callInputs, setCallInputs] = useState<CallInput[]>([createEmptyCallInput()]);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateCallInput = (id: string, updates: Partial<CallInput>) => {
    setCallInputs(prev => prev.map(call => 
      call.id === id ? { ...call, ...updates } : call
    ));
  };

  const addCallInput = () => {
    if (callInputs.length < 3) {
      setCallInputs(prev => [...prev, createEmptyCallInput()]);
    }
  };

  const removeCallInput = (id: string) => {
    if (callInputs.length > 1) {
      setCallInputs(prev => prev.filter(call => call.id !== id));
    }
  };

  const handleFileUpload = (callId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      updateCallInput(callId, { file: selectedFile });
    }
  };

  const getAcceptedFileTypes = (uploadMethod: UploadMethod) => {
    switch (uploadMethod) {
      case 'audio':
        return '.mp3,.m4a,.wav,.flac,.ogg';
      case 'document':
        return '.txt,.pdf,.docx';
      default:
        return '';
    }
  };

  const processCallContent = async (call: CallInput): Promise<string> => {
    if (call.uploadMethod === 'text') {
      return call.transcript;
    }

    if (!call.file) {
      throw new Error('No file provided');
    }

    if (call.uploadMethod === 'audio') {
      // Transcribe audio using Whisper
      const formData = new FormData();
      formData.append('audio', call.file);

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: formData
      });

      if (error) throw error;
      return data.transcript;
    } else if (call.uploadMethod === 'document') {
      // Extract text from document
      const formData = new FormData();
      formData.append('document', call.file);

      const { data, error } = await supabase.functions.invoke('extract-document-text', {
        body: formData
      });

      if (error) throw error;
      return data.text;
    }

    return '';
  };

  const handleSubmit = async () => {
    // Validation
    if (!icpName.trim()) {
      toast.error('Please provide an ICP name');
      return;
    }

    const validCalls = callInputs.filter(call => 
      call.transcript.trim() || call.file
    );

    if (validCalls.length === 0) {
      toast.error('Please provide at least one call transcript or file');
      return;
    }

    setIsGenerating(true);

    try {
      // Process all call contents
      const processedCalls: { callType: CallType; transcript: string }[] = [];
      
      for (const call of validCalls) {
        updateCallInput(call.id, { isProcessing: true });
        
        try {
          const transcript = await processCallContent(call);
          processedCalls.push({
            callType: call.callType,
            transcript
          });
        } catch (error) {
          console.error(`Error processing call ${call.id}:`, error);
          toast.error(`Failed to process one of the calls. Please check your files.`);
          return;
        } finally {
          updateCallInput(call.id, { isProcessing: false });
        }
      }

      // Generate ICP from combined transcripts
      const { data, error } = await supabase.functions.invoke('generate-icp-from-transcript', {
        body: {
          calls: processedCalls,
          icpName: icpName.trim()
        }
      });

      if (error) throw error;

      const generatedScript: ICPStoryScript = {
        id: crypto.randomUUID(),
        name: data.ICPName || icpName.trim(),
        demographics: data.DemographicsSummary,
        coreBeliefs: [],
        internalPains: data.InternalPains?.map((pain: string) => ({
          id: crypto.randomUUID(),
          content: pain
        })) || [],
        externalStruggles: data.ExternalStruggles?.map((struggle: string) => ({
          id: crypto.randomUUID(),
          content: struggle
        })) || [],
        desiredTransformations: data.DesiredTransformations?.map((transformation: string) => ({
          id: crypto.randomUUID(),
          content: transformation
        })) || [],
        clientId: selectedClientId
      };

      onScriptGenerated(generatedScript);
      toast.success('ICP StoryScript generated successfully from call analysis!');
    } catch (error) {
      console.error('Error generating ICP from calls:', error);
      toast.error('Failed to generate ICP StoryScript. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <TooltipProvider>
      <Card className="w-full bg-white shadow-md">
        <CardHeader>
          <CardTitle className="text-story-blue flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Create ICP StoryScript from Call Analysis
          </CardTitle>
          <CardDescription>
            Upload up to 3 customer conversations (audio, documents, or text) for comprehensive ICP analysis. More calls = better insights.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ICP Name Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">ICP Name *</label>
            <Input
              placeholder="e.g., Growth Marketing Lead at Seed-Stage SaaS Startup"
              value={icpName}
              onChange={(e) => setIcpName(e.target.value)}
              className="w-full"
            />
            <p className="text-xs text-gray-500">
              Enter the title/role of your ideal customer profile
            </p>
          </div>

          {/* Call Inputs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Customer Conversations</label>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-4 w-4 text-gray-400 cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-sm">
                    <p>Upload 2-3 calls for best results. Mix different call types (sales, support, feedback) for comprehensive insights.</p>
                  </TooltipContent>
                </Tooltip>
                {callInputs.length < 3 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addCallInput}
                    className="flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Add Call
                  </Button>
                )}
              </div>
            </div>

            {callInputs.map((call, index) => (
              <Card key={call.id} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">
                      Call {index + 1} {index === 0 && <span className="text-red-500">*</span>}
                    </CardTitle>
                    {callInputs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCallInput(call.id)}
                        className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Call Type Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Call Type</label>
                    <Select
                      value={call.callType}
                      onValueChange={(value: CallType) => updateCallInput(call.id, { callType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {callTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Upload Method Selection */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Input Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      <Button
                        variant={call.uploadMethod === 'text' ? 'default' : 'outline'}
                        onClick={() => updateCallInput(call.id, { uploadMethod: 'text', file: null })}
                        className="h-12 flex flex-col items-center gap-1 text-xs"
                        size="sm"
                      >
                        <FileText className="h-3 w-3" />
                        Paste Text
                      </Button>
                      <Button
                        variant={call.uploadMethod === 'document' ? 'default' : 'outline'}
                        onClick={() => updateCallInput(call.id, { uploadMethod: 'document', transcript: '' })}
                        className="h-12 flex flex-col items-center gap-1 text-xs"
                        size="sm"
                      >
                        <Upload className="h-3 w-3" />
                        Document
                      </Button>
                      <Button
                        variant={call.uploadMethod === 'audio' ? 'default' : 'outline'}
                        onClick={() => updateCallInput(call.id, { uploadMethod: 'audio', transcript: '' })}
                        className="h-12 flex flex-col items-center gap-1 text-xs"
                        size="sm"
                      >
                        <FileAudio className="h-3 w-3" />
                        Audio
                      </Button>
                    </div>
                  </div>

                  {/* Content Input */}
                  {call.uploadMethod === 'text' && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium">Paste Transcript</label>
                      <Textarea
                        placeholder="Paste the conversation transcript here..."
                        value={call.transcript}
                        onChange={(e) => updateCallInput(call.id, { transcript: e.target.value })}
                        rows={4}
                        className="resize-none text-sm"
                      />
                    </div>
                  )}

                  {(call.uploadMethod === 'document' || call.uploadMethod === 'audio') && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium">
                        Upload {call.uploadMethod === 'audio' ? 'Audio File' : 'Document'}
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                        <Input
                          type="file"
                          accept={getAcceptedFileTypes(call.uploadMethod)}
                          onChange={(e) => handleFileUpload(call.id, e)}
                          className="hidden"
                          id={`file-upload-${call.id}`}
                        />
                        <label htmlFor={`file-upload-${call.id}`} className="cursor-pointer">
                          {call.uploadMethod === 'audio' ? (
                            <FileAudio className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                          ) : (
                            <Upload className="h-6 w-6 mx-auto mb-2 text-gray-400" />
                          )}
                          <div className="text-xs text-gray-600">
                            {call.file ? (
                              <div className="space-y-1">
                                <div className="font-medium">{call.file.name}</div>
                                <Badge variant="secondary" className="text-xs">
                                  {(call.file.size / 1024 / 1024).toFixed(2)} MB
                                </Badge>
                              </div>
                            ) : (
                              <div>
                                <div className="font-medium">Click to upload</div>
                                <div className="text-xs">
                                  {call.uploadMethod === 'audio' 
                                    ? 'MP3, M4A, WAV (max 25MB)'
                                    : 'TXT, PDF, DOCX (max 10MB)'
                                  }
                                </div>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  {call.isProcessing && (
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Processing call content...
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={isGenerating || !icpName.trim() || callInputs.every(call => !call.transcript && !call.file)}
            className="w-full bg-story-blue hover:bg-story-light-blue"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Conversations & Generating ICP...
              </>
            ) : (
              'Generate ICP StoryScript from Calls'
            )}
          </Button>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-800">
              <div className="font-medium mb-2">💡 AI will extract from your calls:</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                <ul className="space-y-1">
                  <li>• Customer demographics & role</li>
                  <li>• Internal pains & frustrations</li>
                </ul>
                <ul className="space-y-1">
                  <li>• External challenges & struggles</li>
                  <li>• Desired outcomes & transformations</li>
                </ul>
              </div>
              <div className="mt-2 text-xs font-medium">
                💫 Best results: Include 2-3 calls with different types (sales + support + feedback)
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default MultiCallICPCreator;