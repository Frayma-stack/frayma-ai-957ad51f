
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from 'lucide-react';
import { CustomerSuccessStory } from '@/types/storytelling';
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AutoAnalysisForm from './forms/AutoAnalysisForm';
import ExtractedContentDisplay from './forms/ExtractedContentDisplay';
import ManualEntryForm from './forms/ManualEntryForm';

interface AddSuccessStoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
  selectedClientId?: string;
}

interface Quote {
  id: string;
  quote: string;
  author: string;
  title: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  usageDescription?: string;
}

interface LocalUseCase {
  id: string;
  name: string;
  description: string;
  beneficiaryDescription?: string;
}

const AddSuccessStoryDialog: FC<AddSuccessStoryDialogProps> = ({ 
  open, 
  onOpenChange, 
  onSuccessStoryAdded,
  selectedClientId
}) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [beforeSummary, setBeforeSummary] = useState('');
  const [afterSummary, setAfterSummary] = useState('');
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [useCases, setUseCases] = useState<LocalUseCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAnalysisComplete = (data: {
    title: string;
    beforeSummary: string;
    afterSummary: string;
    quotes: Quote[];
    features: Feature[];
    useCases?: LocalUseCase[];
  }) => {
    setTitle(data.title);
    setBeforeSummary(data.beforeSummary);
    setAfterSummary(data.afterSummary);
    setQuotes(data.quotes);
    setFeatures(data.features);
    if (data.useCases) {
      setUseCases(data.useCases);
    }
  };

  const handleAddQuote = (newQuote: Omit<Quote, 'id'>) => {
    setQuotes([...quotes, { ...newQuote, id: crypto.randomUUID() }]);
  };
  
  const handleRemoveQuote = (id: string) => {
    setQuotes(quotes.filter(quote => quote.id !== id));
  };
  
  const handleAddFeature = (newFeature: Omit<Feature, 'id'>) => {
    setFeatures([...features, { ...newFeature, id: crypto.randomUUID() }]);
  };
  
  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
  };

  const handleAddUseCase = (newUseCase: Omit<LocalUseCase, 'id'>) => {
    setUseCases([...useCases, { ...newUseCase, id: crypto.randomUUID() }]);
  };
  
  const handleRemoveUseCase = (id: string) => {
    setUseCases(useCases.filter(useCase => useCase.id !== id));
  };
  
  const handleSubmit = async () => {
    if (!title || !beforeSummary || !afterSummary) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newStory: CustomerSuccessStory = {
        id: crypto.randomUUID(),
        title,
        url,
        beforeSummary,
        afterSummary,
        quotes,
        features: features.map(f => ({
          id: f.id,
          name: f.name,
          description: f.description
        })),
        useCases: useCases.map(uc => ({
          id: uc.id,
          useCase: uc.name,
          description: uc.description
        })),
        clientId: selectedClientId,
        createdAt: new Date().toISOString(),
      };
      
      onSuccessStoryAdded(newStory);
      onOpenChange(false);
      
      // Reset form
      setTitle('');
      setUrl('');
      setBeforeSummary('');
      setAfterSummary('');
      setQuotes([]);
      setFeatures([]);
      setUseCases([]);
      
      toast({
        title: "Success Story Added",
        description: "Your success story has been created by the Frayma AI Narrative Engine.",
      });
    } catch (error) {
      console.error("Error adding success story:", error);
      toast({
        title: "Error",
        description: "Failed to add success story. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Create Success Story</DialogTitle>
          <DialogDescription>
            Let the Frayma AI Narrative Engine analyze and create a compelling customer success story to showcase your product's impact.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="auto-add" className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
            <TabsTrigger value="auto-add">Frayma AI Analysis</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          
          <TabsContent value="auto-add" className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Frayma AI Narrative Engine</h4>
                  <p className="text-sm text-blue-700">
                    Our advanced narrative engine will analyze the customer success story from your URL and automatically extract key insights, quotes, and product features to create a compelling narrative.
                  </p>
                </div>
                
                <AutoAnalysisForm
                  url={url}
                  onUrlChange={setUrl}
                  onAnalysisComplete={handleAnalysisComplete}
                />

                <ExtractedContentDisplay
                  title={title}
                  beforeSummary={beforeSummary}
                  afterSummary={afterSummary}
                  quotes={quotes}
                  features={features}
                  useCases={useCases}
                  onTitleChange={setTitle}
                  onBeforeSummaryChange={setBeforeSummary}
                  onAfterSummaryChange={setAfterSummary}
                  onRemoveQuote={handleRemoveQuote}
                  onRemoveFeature={handleRemoveFeature}
                  onRemoveUseCase={handleRemoveUseCase}
                />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="manual" className="flex-1 min-h-0">
            <ScrollArea className="h-full pr-4">
              <ManualEntryForm
                title={title}
                url={url}
                beforeSummary={beforeSummary}
                afterSummary={afterSummary}
                quotes={quotes}
                features={features}
                useCases={useCases}
                onTitleChange={setTitle}
                onUrlChange={setUrl}
                onBeforeSummaryChange={setBeforeSummary}
                onAfterSummaryChange={setAfterSummary}
                onAddQuote={handleAddQuote}
                onRemoveQuote={handleRemoveQuote}
                onAddFeature={handleAddFeature}
                onRemoveFeature={handleRemoveFeature}
                onAddUseCase={handleAddUseCase}
                onRemoveUseCase={handleRemoveUseCase}
              />
            </ScrollArea>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex-shrink-0">
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Success Story"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSuccessStoryDialog;
