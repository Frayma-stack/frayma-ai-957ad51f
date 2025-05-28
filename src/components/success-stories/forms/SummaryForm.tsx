
import { FC, useState } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, FileText, Eye, EyeOff } from 'lucide-react';
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { useToast } from "@/components/ui/use-toast";

interface SummaryFormProps {
  beforeSummary: string;
  afterSummary: string;
  onBeforeSummaryChange: (summary: string) => void;
  onAfterSummaryChange: (summary: string) => void;
}

const SummaryForm: FC<SummaryFormProps> = ({
  beforeSummary,
  afterSummary,
  onBeforeSummaryChange,
  onAfterSummaryChange,
}) => {
  const [showBeforePreview, setShowBeforePreview] = useState(false);
  const [showAfterPreview, setShowAfterPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { generateText } = useChatGPT();
  const { toast } = useToast();

  const handleGenerateBeforeSummary = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a short 'before' summary for a customer success story, highlighting the problems or challenges the customer faced before using our product. Focus on the pain points and the situation before the transformation.`;
      const generatedText = await generateText(prompt);
      if (generatedText) {
        onBeforeSummaryChange(generatedText);
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate before summary.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating before summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate before summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateAfterSummary = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a short 'after' summary for a customer success story, highlighting the positive outcomes and benefits the customer experienced after using our product. Focus on the transformation and the results achieved.`;
      const generatedText = await generateText(prompt);
      if (generatedText) {
        onAfterSummaryChange(generatedText);
      } else {
        toast({
          title: "Generation Failed",
          description: "Failed to generate after summary.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating after summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate after summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        <Label htmlFor="manual-before" className="text-right">
          Before Summary
        </Label>
        <div className="col-span-3 space-y-2">
          <div className="relative">
            <Textarea
              id="manual-before"
              value={beforeSummary}
              onChange={(e) => onBeforeSummaryChange(e.target.value)}
              placeholder="Describe the situation before the customer used the product."
              className="peer resize-none"
            />
            <div className="absolute right-2 top-2 flex space-x-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowBeforePreview(!showBeforePreview)}
                type="button"
              >
                {showBeforePreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleGenerateBeforeSummary}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showBeforePreview && (
            <div className="rounded-md border bg-muted p-4 text-sm">
              {beforeSummary}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <Label htmlFor="manual-after" className="text-right">
          After Summary
        </Label>
        <div className="col-span-3 space-y-2">
          <div className="relative">
            <Textarea
              id="manual-after"
              value={afterSummary}
              onChange={(e) => onAfterSummaryChange(e.target.value)}
              placeholder="Describe the positive outcomes after the customer used the product."
              className="peer resize-none"
            />
            <div className="absolute right-2 top-2 flex space-x-1.5">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setShowAfterPreview(!showAfterPreview)}
                type="button"
              >
                {showAfterPreview ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleGenerateAfterSummary}
                disabled={isLoading}
                type="button"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          {showAfterPreview && (
            <div className="rounded-md border bg-muted p-4 text-sm">
              {afterSummary}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SummaryForm;
