
import { FC, useEffect } from 'react';
import { CustomerSuccessStory } from '@/types/storytelling';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// Define strict schemas for the items
const quoteItemSchema = z.object({
  id: z.string(),
  quote: z.string(),
  author: z.string(),
  title: z.string()
});

const featureItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string()
});

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  url: z.string().optional(),
  beforeSummary: z.string().min(1, "Before summary is required"),
  afterSummary: z.string().min(1, "After summary is required"),
  quotes: z.array(quoteItemSchema),
  features: z.array(featureItemSchema)
});

// Define strongly typed interfaces that exactly match the schema
type FormValues = z.infer<typeof formSchema>;
type QuoteItem = z.infer<typeof quoteItemSchema>;
type FeatureItem = z.infer<typeof featureItemSchema>;

interface EditSuccessStoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  story: CustomerSuccessStory | null;
  onSuccessStoryUpdated: (successStory: CustomerSuccessStory) => void;
}

const EditSuccessStoryDialog: FC<EditSuccessStoryDialogProps> = ({ 
  isOpen, 
  onClose, 
  story, 
  onSuccessStoryUpdated 
}) => {
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      beforeSummary: "",
      afterSummary: "",
      quotes: [],
      features: []
    }
  });
  
  // Reset form when the dialog opens with a new story
  useEffect(() => {
    if (story) {
      form.reset({
        title: story.title,
        url: story.url || "",
        beforeSummary: story.beforeSummary,
        afterSummary: story.afterSummary,
        quotes: story.quotes,
        features: story.features
      });
    }
  }, [story, form]);

  const handleAddQuote = () => {
    const currentQuotes = form.getValues("quotes") || [];
    form.setValue("quotes", [
      ...currentQuotes, 
      { 
        id: crypto.randomUUID(), 
        quote: "", 
        author: "", 
        title: "" 
      }
    ]);
  };

  const handleRemoveQuote = (id: string) => {
    const currentQuotes = form.getValues("quotes");
    form.setValue("quotes", currentQuotes.filter(quote => quote.id !== id));
  };

  const handleAddFeature = () => {
    const currentFeatures = form.getValues("features") || [];
    form.setValue("features", [
      ...currentFeatures, 
      { 
        id: crypto.randomUUID(), 
        name: "", 
        description: "" 
      }
    ]);
  };

  const handleRemoveFeature = (id: string) => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", currentFeatures.filter(feature => feature.id !== id));
  };

  const onSubmit = (data: FormValues) => {
    if (!story) return;

    const updatedSuccessStory: CustomerSuccessStory = {
      ...story,
      title: data.title,
      url: data.url,
      beforeSummary: data.beforeSummary,
      afterSummary: data.afterSummary,
      quotes: data.quotes,
      features: data.features
    };

    onSuccessStoryUpdated(updatedSuccessStory);
    onClose();
    toast({
      title: "Success Story Updated",
      description: `"${data.title}" has been updated successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Customer Success Story</DialogTitle>
          <DialogDescription>
            Update the details of your customer success story
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Success Story Title</Label>
                <Input 
                  id="edit-title"
                  placeholder="e.g. How Company X Achieved Y Results"
                  {...form.register("title")}
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-url">Original URL (Optional)</Label>
                <Input 
                  id="edit-url"
                  placeholder="https://example.com/success-story"
                  {...form.register("url")}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-beforeSummary">Before Summary</Label>
                <Textarea 
                  id="edit-beforeSummary"
                  placeholder="Describe the customer's situation before using your solution"
                  className="min-h-[100px]"
                  {...form.register("beforeSummary")}
                />
                {form.formState.errors.beforeSummary && (
                  <p className="text-sm text-red-500">{form.formState.errors.beforeSummary.message}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-afterSummary">After Summary</Label>
                <Textarea 
                  id="edit-afterSummary"
                  placeholder="Describe the results after implementing your solution"
                  className="min-h-[100px]"
                  {...form.register("afterSummary")}
                />
                {form.formState.errors.afterSummary && (
                  <p className="text-sm text-red-500">{form.formState.errors.afterSummary.message}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Customer Quotes</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddQuote}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Quote
                  </Button>
                </div>
                
                {form.watch("quotes").map((quote, index) => (
                  <div key={quote.id} className="space-y-3 p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Quote {index + 1}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveQuote(quote.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Quote Text</Label>
                      <Textarea 
                        placeholder="Enter the customer's quote"
                        {...form.register(`quotes.${index}.quote`)}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Author Name</Label>
                        <Input 
                          placeholder="e.g. John Smith"
                          {...form.register(`quotes.${index}.author`)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Author Title</Label>
                        <Input 
                          placeholder="e.g. CTO at ABC Corp"
                          {...form.register(`quotes.${index}.title`)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label>Features Used</Label>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    onClick={handleAddFeature}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Feature
                  </Button>
                </div>
                
                {form.watch("features").map((feature, index) => (
                  <div key={feature.id} className="space-y-3 p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Feature {index + 1}</span>
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveFeature(feature.id)}
                      >
                        <Trash className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <Label>Feature Name</Label>
                      <Input 
                        placeholder="e.g. Automated Reporting"
                        {...form.register(`features.${index}.name`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>How It Was Used</Label>
                      <Textarea 
                        placeholder="Describe how the customer used this feature"
                        {...form.register(`features.${index}.description`)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-story-blue hover:bg-story-light-blue">
              Update Success Story
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditSuccessStoryDialog;
