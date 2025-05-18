import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { CustomerSuccessStory } from '@/types/storytelling';
import { FileText, Plus, Pencil, Trash, BookMarked, Link, Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface CustomerSuccessManagerProps {
  successStories: CustomerSuccessStory[];
  onSuccessStoryAdded: (successStory: CustomerSuccessStory) => void;
  onSuccessStoryUpdated: (successStory: CustomerSuccessStory) => void;
  onSuccessStoryDeleted: (successStoryId: string) => void;
}

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

type FormValues = z.infer<typeof formSchema>;
type QuoteItem = z.infer<typeof quoteItemSchema>;
type FeatureItem = z.infer<typeof featureItemSchema>;

const CustomerSuccessManager: FC<CustomerSuccessManagerProps> = ({
  successStories,
  onSuccessStoryAdded,
  onSuccessStoryUpdated,
  onSuccessStoryDeleted
}) => {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedStory, setSelectedStory] = useState<CustomerSuccessStory | null>(null);
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
      quotes: [{ id: crypto.randomUUID(), quote: "", author: "", title: "" }],
      features: [{ id: crypto.randomUUID(), name: "", description: "" }]
    }
  });

  const editForm = useForm<FormValues>({
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

  const resetForm = () => {
    form.reset({
      title: "",
      url: "",
      beforeSummary: "",
      afterSummary: "",
      quotes: [{ id: crypto.randomUUID(), quote: "", author: "", title: "" }],
      features: [{ id: crypto.randomUUID(), name: "", description: "" }]
    });
    setUrlToProcess("");
  };

  const handleOpenEditDialog = (story: CustomerSuccessStory) => {
    setSelectedStory(story);
    editForm.reset({
      title: story.title,
      url: story.url || "",
      beforeSummary: story.beforeSummary,
      afterSummary: story.afterSummary,
      quotes: story.quotes,
      features: story.features
    });
    setIsEditDialogOpen(true);
  };

  const handleAddQuote = () => {
    const currentQuotes = form.getValues("quotes") || [];
    form.setValue("quotes", [
      ...currentQuotes, 
      { id: crypto.randomUUID(), quote: "", author: "", title: "" }
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
      { id: crypto.randomUUID(), name: "", description: "" }
    ]);
  };

  const handleRemoveFeature = (id: string) => {
    const currentFeatures = form.getValues("features");
    form.setValue("features", currentFeatures.filter(feature => feature.id !== id));
  };

  const handleAddEditQuote = () => {
    const currentQuotes = editForm.getValues("quotes") || [];
    editForm.setValue("quotes", [
      ...currentQuotes, 
      { id: crypto.randomUUID(), quote: "", author: "", title: "" }
    ]);
  };

  const handleRemoveEditQuote = (id: string) => {
    const currentQuotes = editForm.getValues("quotes");
    editForm.setValue("quotes", currentQuotes.filter(quote => quote.id !== id));
  };

  const handleAddEditFeature = () => {
    const currentFeatures = editForm.getValues("features") || [];
    editForm.setValue("features", [
      ...currentFeatures, 
      { id: crypto.randomUUID(), name: "", description: "" }
    ]);
  };

  const handleRemoveEditFeature = (id: string) => {
    const currentFeatures = editForm.getValues("features");
    editForm.setValue("features", currentFeatures.filter(feature => feature.id !== id));
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
      
      // Simulate success with mock data
      toast({
        title: "Success",
        description: "Successfully processed the success story URL",
      });
      
      // Populate the form with mock data - ensure all required fields have values
      form.setValue("title", "ABC Corporation Success Story");
      form.setValue("beforeSummary", "ABC Corporation was struggling with manual data entry processes that were error-prone and time-consuming. Their team was spending over 20 hours per week on data entry tasks. Customer satisfaction was declining due to delays in processing orders. They were losing potential clients to competitors with more efficient systems. The company needed a solution that could automate their workflow without requiring a complete overhaul of their existing systems.");
      form.setValue("afterSummary", "After implementing our solution, ABC Corporation reduced data entry time by 85%. Their error rate dropped from 12% to less than 1%. Customer satisfaction scores increased by 35% within three months. The company was able to reassign staff to more strategic roles, improving employee satisfaction. They've since expanded their use of our platform to three additional departments.");
      
      // Create properly typed arrays for quotes and features
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
      
      // Set the values with the properly typed arrays
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

  const onAddSubmit = (data: FormValues) => {
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
    setIsAddDialogOpen(false);
    resetForm();
    toast({
      title: "Success Story Added",
      description: `"${data.title}" has been added successfully`,
    });
  };

  const onEditSubmit = (data: FormValues) => {
    if (!selectedStory) return;

    const updatedSuccessStory: CustomerSuccessStory = {
      ...selectedStory,
      title: data.title,
      url: data.url,
      beforeSummary: data.beforeSummary,
      afterSummary: data.afterSummary,
      quotes: data.quotes,
      features: data.features
    };

    onSuccessStoryUpdated(updatedSuccessStory);
    setIsEditDialogOpen(false);
    setSelectedStory(null);
    toast({
      title: "Success Story Updated",
      description: `"${data.title}" has been updated successfully`,
    });
  };

  const handleDeleteStory = (story: CustomerSuccessStory) => {
    if (confirm(`Are you sure you want to delete "${story.title}"?`)) {
      onSuccessStoryDeleted(story.id);
      toast({
        title: "Success Story Deleted",
        description: `"${story.title}" has been deleted`,
      });
    }
  };

  // Get the client name if we're in a client-specific view
  const getClientInfo = () => {
    const selectedClientId = successStories[0]?.clientId;
    
    if (selectedClientId) {
      const savedClients = localStorage.getItem('clients');
      if (savedClients) {
        const clients = JSON.parse(savedClients);
        return clients.find((client: any) => client.id === selectedClientId);
      }
    }
    return null;
  };
  
  const clientInfo = getClientInfo();

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-story-blue">Customer Success Stories</CardTitle>
          <CardDescription>
            Manage your customer success stories
            {clientInfo && (
              <span className="ml-2 bg-story-blue/10 px-2 py-0.5 rounded-full text-xs text-story-blue">
                For client: {clientInfo.name}
              </span>
            )}
          </CardDescription>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
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
              
              <form onSubmit={form.handleSubmit(onAddSubmit)}>
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
                      setIsAddDialogOpen(false);
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
      </CardHeader>
      
      <CardContent>
        {successStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <BookMarked className="mx-auto h-12 w-12 opacity-30 mb-2" />
            <p>No customer success stories yet</p>
            <p className="text-sm mt-1">
              Add your first customer success story to reference in your narratives
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {successStories.map((story) => (
              <Card key={story.id} className="overflow-hidden">
                <CardHeader className="bg-gray-50 p-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{story.title}</CardTitle>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleOpenEditDialog(story)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteStory(story)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-semibold">Before:</span>
                      <p className="text-gray-700 line-clamp-3">{story.beforeSummary}</p>
                    </div>
                    <div>
                      <span className="font-semibold">After:</span>
                      <p className="text-gray-700 line-clamp-3">{story.afterSummary}</p>
                    </div>
                    <div>
                      <span className="font-semibold">Features Used:</span>
                      <p className="text-gray-700 line-clamp-2">
                        {story.features.map(f => f.name).join(', ')}
                      </p>
                    </div>
                    <div>
                      <span className="font-semibold">Quotes:</span>
                      <p className="text-gray-700 line-clamp-2">
                        {story.quotes.length} quote{story.quotes.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                    {story.url && (
                      <div>
                        <a 
                          href={story.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-story-blue hover:underline flex items-center"
                        >
                          <Link className="h-3.5 w-3.5 mr-1" />
                          View original
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit Customer Success Story</DialogTitle>
              <DialogDescription>
                Update the details of your customer success story
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={editForm.handleSubmit(onEditSubmit)}>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-title">Success Story Title</Label>
                    <Input 
                      id="edit-title"
                      placeholder="e.g. How Company X Achieved Y Results"
                      {...editForm.register("title")}
                    />
                    {editForm.formState.errors.title && (
                      <p className="text-sm text-red-500">{editForm.formState.errors.title.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-url">Original URL (Optional)</Label>
                    <Input 
                      id="edit-url"
                      placeholder="https://example.com/success-story"
                      {...editForm.register("url")}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-beforeSummary">Before Summary</Label>
                    <Textarea 
                      id="edit-beforeSummary"
                      placeholder="Describe the customer's situation before using your solution"
                      className="min-h-[100px]"
                      {...editForm.register("beforeSummary")}
                    />
                    {editForm.formState.errors.beforeSummary && (
                      <p className="text-sm text-red-500">{editForm.formState.errors.beforeSummary.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="edit-afterSummary">After Summary</Label>
                    <Textarea 
                      id="edit-afterSummary"
                      placeholder="Describe the results after implementing your solution"
                      className="min-h-[100px]"
                      {...editForm.register("afterSummary")}
                    />
                    {editForm.formState.errors.afterSummary && (
                      <p className="text-sm text-red-500">{editForm.formState.errors.afterSummary.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label>Customer Quotes</Label>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm" 
                        onClick={handleAddEditQuote}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Quote
                      </Button>
                    </div>
                    
                    {editForm.watch("quotes").map((quote, index) => (
                      <div key={quote.id} className="space-y-3 p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Quote {index + 1}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveEditQuote(quote.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Quote Text</Label>
                          <Textarea 
                            placeholder="Enter the customer's quote"
                            {...editForm.register(`quotes.${index}.quote`)}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-2">
                            <Label>Author Name</Label>
                            <Input 
                              placeholder="e.g. John Smith"
                              {...editForm.register(`quotes.${index}.author`)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Author Title</Label>
                            <Input 
                              placeholder="e.g. CTO at ABC Corp"
                              {...editForm.register(`quotes.${index}.title`)}
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
                        onClick={handleAddEditFeature}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Feature
                      </Button>
                    </div>
                    
                    {editForm.watch("features").map((feature, index) => (
                      <div key={feature.id} className="space-y-3 p-3 border rounded-md">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Feature {index + 1}</span>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleRemoveEditFeature(feature.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                        <div className="space-y-2">
                          <Label>Feature Name</Label>
                          <Input 
                            placeholder="e.g. Automated Reporting"
                            {...editForm.register(`features.${index}.name`)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>How It Was Used</Label>
                          <Textarea 
                            placeholder="Describe how the customer used this feature"
                            {...editForm.register(`features.${index}.description`)}
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
                  onClick={() => setIsEditDialogOpen(false)}
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
      </CardContent>
    </Card>
  );
};

export default CustomerSuccessManager;
