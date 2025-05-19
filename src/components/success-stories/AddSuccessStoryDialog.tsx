import { FC, useState } from 'react';
import { CustomerSuccessStory } from '@/types/storytelling';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Link, Loader2, Trash } from 'lucide-react';
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

interface AddSuccessStoryDialogProps {
  onSuccessStoryAdded: (successStory: CustomerSuccessStory) => void;
}

const AddSuccessStoryDialog: FC<AddSuccessStoryDialogProps> = ({ onSuccessStoryAdded }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessingUrl, setIsProcessingUrl] = useState(false);
  const [urlToProcess, setUrlToProcess] = useState("");
  const [addMode, setAddMode] = useState<'manual' | 'url'>('manual');
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      url: "",
      beforeSummary: "",
      afterSummary: "",
      quotes: [{
        id: crypto.randomUUID(),
        quote: "",
        author: "",
        title: ""
      }],
      features: [{
        id: crypto.randomUUID(),
        name: "",
        description: ""
      }]
    }
  });

  const resetForm = () => {
    form.reset({
      title: '',
      beforeSummary: '',
      afterSummary: '',
      quotes: [{ 
        id: crypto.randomUUID(), 
        quote: '', 
        author: '', 
        title: '' 
      }],
      features: [{ 
        id: crypto.randomUUID(), 
        name: '', 
        description: '' 
      }]
    });
    setUrlToProcess("");
  };
  
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

  const processSuccessStoryUrl = async () => {
    if (!urlToProcess) {
      toast({
        title: "Error",
        description: "Please enter a URL to process",
        variant: "destructive"
      });
      return;
    }

    setIsProcessingUrl(true);
    
    try {
      // In a real implementation, this would call your Perplexity API integration
      // For now, we'll simulate the API call with a timeout
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Success",
        description: "Successfully processed the success story URL",
      });
      
      // Create properly typed mock data that satisfies the QuoteItem and FeatureItem types
      const mockQuotes: QuoteItem[] = [
        {
          id: crypto.randomUUID(),
          quote: "This solution transformed our daily operations. What used to take hours now happens in minutes with virtually no errors.",
          author: "Jane Smith",
          title: "COO at ABC Corporation"
        },
        {
          id: crypto.randomUUID(),
          quote: "The implementation team was exceptional. They understood our needs and customized the solution perfectly for our workflow.",
          author: "Michael Johnson",
          title: "IT Director at ABC Corporation"
        }
      ];
      
      const mockFeatures: FeatureItem[] = [
        {
          id: crypto.randomUUID(),
          name: "Automated Data Processing",
          description: "Used to eliminate manual data entry by automatically extracting information from various document formats"
        },
        {
          id: crypto.randomUUID(),
          name: "Custom Workflow Integration",
          description: "Integrated with their existing CRM system to create a seamless end-to-end process"
        },
        {
          id: crypto.randomUUID(),
          name: "Real-time Analytics Dashboard",
          description: "Provided management with visibility into operational efficiency metrics"
        }
      ];
      
      // Populate the form with correctly typed data
      form.setValue("title", "ABC Corporation Success Story");
      form.setValue("beforeSummary", "ABC Corporation was struggling with manual data entry processes that were error-prone and time-consuming. Their team was spending over 20 hours per week on data entry tasks. Customer satisfaction was declining due to delays in processing orders. They were losing potential clients to competitors with more efficient systems. The company needed a solution that could automate their workflow without requiring a complete overhaul of their existing systems.");
      form.setValue("afterSummary", "After implementing our solution, ABC Corporation reduced data entry time by 85%. Their error rate dropped from 12% to less than 1%. Customer satisfaction scores increased by 35% within three months. The company was able to reassign staff to more strategic roles, improving employee satisfaction. They've since expanded their use of our platform to three additional departments.");
      form.setValue("quotes", mockQuotes);
      form.setValue("features", mockFeatures);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the URL. Please try again or enter details manually.",
        variant: "destructive"
      });
    } finally {
      setIsProcessingUrl(false);
    }
  };

  const onSubmit = (data: FormValues) => {
    const newSuccessStory: CustomerSuccessStory = {
      id: crypto.randomUUID(),
      title: data.title,
      url: data.url,
      beforeSummary: data.beforeSummary,
      afterSummary: data.afterSummary,
      quotes: data.quotes,
      features: data.features,
      createdAt: new Date().toISOString()
    };

    onSuccessStoryAdded(newSuccessStory);
    setIsOpen(false);
    resetForm();
    toast({
      title: "Success Story Added",
      description: `"${data.title}" has been added successfully`,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-story-blue hover:bg-story-light-blue">
          <Plus className="h-4 w-4 mr-2" /> Add Success Story
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Customer Success Story</DialogTitle>
          <DialogDescription>
            Add details about your customer success story to reference in your narratives
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="manual" onValueChange={(value) => setAddMode(value as 'manual' | 'url')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Enter Manually</TabsTrigger>
            <TabsTrigger value="url">Import From URL</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4 py-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter success story URL"
                value={urlToProcess}
                onChange={(e) => setUrlToProcess(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={processSuccessStoryUrl}
                disabled={isProcessingUrl || !urlToProcess}
                className="bg-story-blue hover:bg-story-light-blue"
              >
                {isProcessingUrl ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Link className="h-4 w-4 mr-2" />
                    Process URL
                  </>
                )}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Enter the URL of a published success story and we'll extract the key information using Perplexity AI
            </p>
          </TabsContent>
          
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Success Story Title</Label>
                  <Input 
                    id="title"
                    placeholder="e.g. How Company X Achieved Y Results"
                    {...form.register("title")}
                  />
                  {form.formState.errors.title && (
                    <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                  )}
                </div>
                
                {addMode === "url" && (
                  <div className="space-y-2">
                    <Label htmlFor="url">Original URL</Label>
                    <Input 
                      id="url"
                      placeholder="https://example.com/success-story"
                      {...form.register("url")}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="beforeSummary">Before Summary</Label>
                  <Textarea 
                    id="beforeSummary"
                    placeholder="Describe the customer's situation before using your solution"
                    className="min-h-[100px]"
                    {...form.register("beforeSummary")}
                  />
                  {form.formState.errors.beforeSummary && (
                    <p className="text-sm text-red-500">{form.formState.errors.beforeSummary.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="afterSummary">After Summary</Label>
                  <Textarea 
                    id="afterSummary"
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
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveQuote(quote.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
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
                        {index > 0 && (
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveFeature(feature.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        )}
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
                onClick={() => {
                  setIsOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-story-blue hover:bg-story-light-blue">
                Add Success Story
              </Button>
            </DialogFooter>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddSuccessStoryDialog;
