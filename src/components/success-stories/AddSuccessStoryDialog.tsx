import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Globe, Upload, FileText, Eye, EyeOff } from 'lucide-react';
import { CustomerSuccessStory } from '@/types/storytelling';
import { useToast } from "@/components/ui/use-toast";
import { useChatGPT } from '@/contexts/ChatGPTContext';

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
  const [newQuote, setNewQuote] = useState({ quote: '', author: '', title: '' });
  const [newFeature, setNewFeature] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showBeforePreview, setShowBeforePreview] = useState(false);
  const [showAfterPreview, setShowAfterPreview] = useState(false);
  const { toast } = useToast();
  const { generateText } = useChatGPT();
  
  const handleAddQuote = () => {
    if (newQuote.quote && newQuote.author && newQuote.title) {
      setQuotes([...quotes, { ...newQuote, id: crypto.randomUUID() }]);
      setNewQuote({ quote: '', author: '', title: '' });
    }
  };
  
  const handleRemoveQuote = (id: string) => {
    setQuotes(quotes.filter(quote => quote.id !== id));
  };
  
  const handleAddFeature = () => {
    if (newFeature.name && newFeature.description) {
      setFeatures([...features, { ...newFeature, id: crypto.randomUUID() }]);
      setNewFeature({ name: '', description: '' });
    }
  };
  
  const handleRemoveFeature = (id: string) => {
    setFeatures(features.filter(feature => feature.id !== id));
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
        features,
        clientId: selectedClientId,
        createdAt: new Date().toISOString(),
      };
      
      onSuccessStoryAdded(newStory);
      onOpenChange(false);
      
      setTitle('');
      setUrl('');
      setBeforeSummary('');
      setAfterSummary('');
      setQuotes([]);
      setFeatures([]);
      
      toast({
        title: "Success Story Added",
        description: "Your success story has been added successfully.",
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

  const handleGenerateBeforeSummary = async () => {
    setIsLoading(true);
    try {
      const prompt = `Generate a short 'before' summary for a customer success story, highlighting the problems or challenges the customer faced before using our product. Focus on the pain points and the situation before the transformation.`;
      const generatedText = await generateText(prompt);
      if (generatedText) {
        setBeforeSummary(generatedText);
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
        setAfterSummary(generatedText);
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Success Story</DialogTitle>
          <DialogDescription>
            Create a new customer success story to showcase the benefits of your product.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input 
              type="text" 
              id="title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              className="col-span-3" 
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="url" className="text-right">
              URL (Optional)
            </Label>
            <Input 
              type="url" 
              id="url" 
              value={url} 
              onChange={(e) => setUrl(e.target.value)} 
              className="col-span-3" 
              placeholder="https://example.com"
            />
          </div>
          
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="beforeSummary" className="text-right">
              Before Summary
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="relative">
                <Textarea
                  id="beforeSummary"
                  value={beforeSummary}
                  onChange={(e) => setBeforeSummary(e.target.value)}
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
            <Label htmlFor="afterSummary" className="text-right">
              After Summary
            </Label>
            <div className="col-span-3 space-y-2">
              <div className="relative">
                <Textarea
                  id="afterSummary"
                  value={afterSummary}
                  onChange={(e) => setAfterSummary(e.target.value)}
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
          
          <div>
            <Label className="text-right">Quotes</Label>
            <div className="col-span-3">
              {quotes.map((quote) => (
                <div key={quote.id} className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{quote.quote}</p>
                    <p className="text-sm">- {quote.author}, {quote.title}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveQuote(quote.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Quote"
                  value={newQuote.quote}
                  onChange={(e) => setNewQuote({ ...newQuote, quote: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Author"
                  value={newQuote.author}
                  onChange={(e) => setNewQuote({ ...newQuote, author: e.target.value })}
                />
                <Input
                  type="text"
                  placeholder="Author Title"
                  value={newQuote.title}
                  onChange={(e) => setNewQuote({ ...newQuote, title: e.target.value })}
                />
                <Button size="sm" onClick={handleAddQuote}>
                  Add Quote
                </Button>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="text-right">Features</Label>
            <div className="col-span-3">
              {features.map((feature) => (
                <div key={feature.id} className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold">{feature.name}</p>
                    <p className="text-sm">{feature.description}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFeature(feature.id)}>
                    Remove
                  </Button>
                </div>
              ))}
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Feature Name"
                  value={newFeature.name}
                  onChange={(e) => setNewFeature({ ...newFeature, name: e.target.value })}
                />
                <Textarea
                  placeholder="Feature Description"
                  value={newFeature.description}
                  onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                  className="resize-none"
                />
                <Button size="sm" onClick={handleAddFeature}>
                  Add Feature
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Save"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddSuccessStoryDialog;
