import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Upload, FileAudio, FileText, Mic, Loader2 } from "lucide-react";
import { ICPStoryScript } from '@/types/storytelling';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ICPAudioUploadFormProps {
  onScriptGenerated: (script: ICPStoryScript) => void;
  selectedClientId?: string;
}

type CallType = 'sales' | 'onboarding' | 'support' | 'discovery';

const callTypes: { value: CallType; label: string; description: string }[] = [
  { value: 'sales', label: 'Sales Call', description: 'Prospecting, demo, or sales conversation' },
  { value: 'onboarding', label: 'Onboarding Call', description: 'Customer setup or welcome session' },
  { value: 'support', label: 'Customer Success/Support', description: 'Support ticket or success check-in' },
  { value: 'discovery', label: 'Discovery/Feedback Call', description: 'User research or feedback session' }
];

const ICPAudioUploadForm: FC<ICPAudioUploadFormProps> = ({
  onScriptGenerated,
  selectedClientId
}) => {
  const [uploadMethod, setUploadMethod] = useState<'text' | 'document' | 'audio'>('text');
  const [callType, setCallType] = useState<CallType>('sales');
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const processTranscript = async (transcriptText: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('generate-icp-from-transcript', {
        body: {
          transcript: transcriptText,
          callType: callType
        }
      });

      if (error) throw error;

      const generatedScript: ICPStoryScript = {
        id: crypto.randomUUID(),
        name: data.ICPName,
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
      toast.success('ICP StoryScript generated successfully from transcript!');
    } catch (error) {
      console.error('Error generating ICP from transcript:', error);
      toast.error('Failed to generate ICP StoryScript. Please try again.');
    }
  };

  const handleSubmit = async () => {
    if (!transcript && !file) {
      toast.error('Please provide a transcript or upload a file');
      return;
    }

    setIsProcessing(true);

    try {
      let finalTranscript = transcript;

      if (file && uploadMethod === 'audio') {
        // Transcribe audio using Whisper
        const formData = new FormData();
        formData.append('audio', file);

        const { data, error } = await supabase.functions.invoke('transcribe-audio', {
          body: formData
        });

        if (error) throw error;
        finalTranscript = data.transcript;
      } else if (file && uploadMethod === 'document') {
        // Extract text from document
        const formData = new FormData();
        formData.append('document', file);

        const { data, error } = await supabase.functions.invoke('extract-document-text', {
          body: formData
        });

        if (error) throw error;
        finalTranscript = data.text;
      }

      await processTranscript(finalTranscript);
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Failed to process the uploaded file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getAcceptedFileTypes = () => {
    switch (uploadMethod) {
      case 'audio':
        return '.mp3,.m4a,.wav,.flac,.ogg';
      case 'document':
        return '.txt,.pdf,.docx';
      default:
        return '';
    }
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center gap-2">
          <Mic className="h-5 w-5" />
          Create ICP StoryScript from Call Analysis
        </CardTitle>
        <CardDescription>
          Upload audio, documents, or paste transcript from customer conversations to auto-generate your ICP StoryScript
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Method Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">How would you like to provide the conversation?</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              variant={uploadMethod === 'text' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('text')}
              className="flex items-center gap-2 h-auto p-4"
            >
              <FileText className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Paste Transcript</div>
                <div className="text-xs opacity-70">Copy and paste text</div>
              </div>
            </Button>
            <Button
              variant={uploadMethod === 'document' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('document')}
              className="flex items-center gap-2 h-auto p-4"
            >
              <Upload className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Upload Document</div>
                <div className="text-xs opacity-70">.txt, .pdf, .docx</div>
              </div>
            </Button>
            <Button
              variant={uploadMethod === 'audio' ? 'default' : 'outline'}
              onClick={() => setUploadMethod('audio')}
              className="flex items-center gap-2 h-auto p-4"
            >
              <FileAudio className="h-4 w-4" />
              <div className="text-left">
                <div className="font-medium">Upload Audio</div>
                <div className="text-xs opacity-70">.mp3, .m4a, .wav</div>
              </div>
            </Button>
          </div>
        </div>

        {/* Call Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium">What type of call is this?</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {callTypes.map((type) => (
              <Button
                key={type.value}
                variant={callType === type.value ? 'default' : 'outline'}
                onClick={() => setCallType(type.value)}
                className="flex flex-col items-start gap-1 h-auto p-4 text-left"
              >
                <div className="font-medium">{type.label}</div>
                <div className="text-xs opacity-70">{type.description}</div>
              </Button>
            ))}
          </div>
        </div>

        {/* Content Input */}
        {uploadMethod === 'text' && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Paste your transcript</label>
            <Textarea
              placeholder="Paste the conversation transcript here..."
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              rows={8}
              className="resize-none"
            />
          </div>
        )}

        {(uploadMethod === 'document' || uploadMethod === 'audio') && (
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Upload {uploadMethod === 'audio' ? 'audio file' : 'document'}
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Input
                type="file"
                accept={getAcceptedFileTypes()}
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {uploadMethod === 'audio' ? (
                  <FileAudio className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                ) : (
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                )}
                <div className="text-sm text-gray-600">
                  {file ? (
                    <div className="space-y-1">
                      <div className="font-medium">{file.name}</div>
                      <Badge variant="secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</Badge>
                    </div>
                  ) : (
                    <div>
                      <div className="font-medium">Click to upload or drag and drop</div>
                      <div className="text-xs">
                        {uploadMethod === 'audio' 
                          ? 'MP3, M4A, WAV, FLAC, OGG (max 25MB)'
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

        {/* Submit Button */}
        <Button
          onClick={handleSubmit}
          disabled={isProcessing || (!transcript && !file)}
          className="w-full bg-story-blue hover:bg-story-light-blue"
          size="lg"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {uploadMethod === 'audio' ? 'Transcribing & Analyzing...' : 'Analyzing Conversation...'}
            </>
          ) : (
            'Generate ICP StoryScript'
          )}
        </Button>

        {/* Help Text */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="text-sm text-blue-800">
            <div className="font-medium mb-1">💡 AI will extract:</div>
            <ul className="text-xs space-y-1 ml-4">
              <li>• Customer demographics and role</li>
              <li>• Internal pains and frustrations</li>
              <li>• External challenges and struggles</li>
              <li>• Desired outcomes and transformations</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ICPAudioUploadForm;