
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Plus, FileText, Link, Quote, Columns3 } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CustomerSuccessStory } from "@/types/storytelling"
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { usePerplexity } from "@/contexts/PerplexityContext"
import { useToast } from "@/hooks/use-toast"

const manualFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  beforeSummary: z.string().min(10, {
    message: "Before summary must be at least 10 characters.",
  }),
  afterSummary: z.string().min(10, {
    message: "After summary must be at least 10 characters.",
  }),
})

const urlFormSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string().url({
    message: "Please enter a valid URL.",
  }),
})

interface AddSuccessStoryDialogProps {
  onStoryAdded: (story: CustomerSuccessStory) => void;
}

export function AddSuccessStoryDialog({ onStoryAdded }: AddSuccessStoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("manual");
  const { toast } = useToast();
  const { apiKey, isConfigured } = usePerplexity();
  
  // For manual entry
  const manualForm = useForm<z.infer<typeof manualFormSchema>>({
    defaultValues: {
      title: "",
      beforeSummary: "",
      afterSummary: "",
    },
  })
  
  // For URL extraction
  const urlForm = useForm<z.infer<typeof urlFormSchema>>({
    defaultValues: {
      title: "",
      url: "",
    },
  })
  
  // For managing quotes
  const [quotes, setQuotes] = useState<Array<{id: string, quote: string, author: string, title: string}>>([]);
  
  // For managing features
  const [features, setFeatures] = useState<Array<{id: string, name: string, description: string}>>([]);
  
  // Add a new quote
  const addQuote = () => {
    setQuotes([...quotes, { id: uuidv4(), quote: "", author: "", title: "" }]);
  };
  
  // Update a quote
  const updateQuote = (id: string, field: string, value: string) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, [field]: value } : q));
  };
  
  // Remove a quote
  const removeQuote = (id: string) => {
    setQuotes(quotes.filter(q => q.id !== id));
  };
  
  // Add a new feature
  const addFeature = () => {
    setFeatures([...features, { id: uuidv4(), name: "", description: "" }]);
  };
  
  // Update a feature
  const updateFeature = (id: string, field: string, value: string) => {
    setFeatures(features.map(f => f.id === id ? { ...f, [field]: value } : f));
  };
  
  // Remove a feature
  const removeFeature = (id: string) => {
    setFeatures(features.filter(f => f.id !== id));
  };
  
  // Reset all form data
  const resetFormData = () => {
    manualForm.reset();
    urlForm.reset();
    setQuotes([]);
    setFeatures([]);
    setCurrentTab("manual");
  };

  // Extract success story details from URL using Perplexity API
  const extractFromUrl = async (url: string) => {
    if (!isConfigured) {
      toast({
        title: "API Key Not Configured",
        description: "Please configure your Perplexity API key in the settings.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const prompt = `Extract details of the success story in this url: ${url} into a before and after succinct summary of blocks of five sentences or more. Also extract all the quotes by the profiled customer along with their names and titles, and a feature-by-feature summary of how each feature helped the profiled customer in the url. Format the response as JSON with the following structure: {"beforeSummary": "...", "afterSummary": "...", "quotes": [{"quote": "...", "author": "...", "title": "..."}], "features": [{"name": "...", "description": "..."}]}`;
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that extracts success story information from URLs and formats it as JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.2,
          max_tokens: 2000
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to extract information');
      }
      
      const data = await response.json();
      const extractedText = data.choices[0].message.content;
      
      // Try to parse the JSON from the response
      try {
        // Find JSON content between backticks or just parse the content directly
        let jsonContent = extractedText;
        const jsonMatch = extractedText.match(/```json([\s\S]*?)```/) || extractedText.match(/```([\s\S]*?)```/);
        if (jsonMatch && jsonMatch[1]) {
          jsonContent = jsonMatch[1].trim();
        }
        
        const extractedData = JSON.parse(jsonContent);
        
        // Populate the manual form with extracted data
        if (extractedData.beforeSummary) {
          manualForm.setValue('beforeSummary', extractedData.beforeSummary);
        }
        
        if (extractedData.afterSummary) {
          manualForm.setValue('afterSummary', extractedData.afterSummary);
        }
        
        // Set extracted quotes
        if (extractedData.quotes && Array.isArray(extractedData.quotes)) {
          const formattedQuotes = extractedData.quotes.map(q => ({
            id: uuidv4(),
            quote: q.quote || "",
            author: q.author || "",
            title: q.title || ""
          }));
          setQuotes(formattedQuotes);
        }
        
        // Set extracted features
        if (extractedData.features && Array.isArray(extractedData.features)) {
          const formattedFeatures = extractedData.features.map(f => ({
            id: uuidv4(),
            name: f.name || "",
            description: f.description || ""
          }));
          setFeatures(formattedFeatures);
        }
        
        // Switch to manual tab to edit the extracted data
        setCurrentTab("manual");
        toast({
          title: "Success",
          description: "Information extracted successfully. Please review and edit if needed.",
        });
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        toast({
          title: "Extraction Error",
          description: "Failed to parse the extracted information. Please enter details manually.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API call failed:", error);
      toast({
        title: "Extraction Failed",
        description: "Failed to extract information from the URL. Please enter details manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle manual form submission
  function onManualSubmit(values: z.infer<typeof manualFormSchema>) {
    // Create the new success story with form values and collected quotes/features
    const newStory: CustomerSuccessStory = {
      id: uuidv4(),
      title: values.title,
      beforeSummary: values.beforeSummary,
      afterSummary: values.afterSummary,
      quotes: quotes,
      features: features,
      createdAt: new Date().toISOString(),
    };
    
    onStoryAdded(newStory);
    setOpen(false);
    resetFormData();
    
    toast({
      title: "Success Story Added",
      description: `"${values.title}" has been added to your success stories.`,
    });
  }

  // Handle URL form submission
  function onUrlSubmit(values: z.infer<typeof urlFormSchema>) {
    extractFromUrl(values.url);
    // Set the title from the URL form to the manual form for continuity
    manualForm.setValue('title', values.title);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          Add Success Story
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Success Story</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new customer success story to showcase your product's impact.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="manual">Add Manually</TabsTrigger>
            <TabsTrigger value="url">Add from URL</TabsTrigger>
          </TabsList>
          
          {/* Manual Entry Tab */}
          <TabsContent value="manual">
            <Form {...manualForm}>
              <form onSubmit={manualForm.handleSubmit(onManualSubmit)} className="space-y-4">
                <FormField
                  control={manualForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title of the success story" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-2 mt-6 mb-2">
                  <FileText className="h-5 w-5 text-story-blue" />
                  <h3 className="text-lg font-medium">Before Summary</h3>
                </div>
                
                <FormField
                  control={manualForm.control}
                  name="beforeSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        Summarize the situation before using your product/service
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the customer's situation before using the product"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center gap-2 mt-6 mb-2">
                  <FileText className="h-5 w-5 text-story-blue" />
                  <h3 className="text-lg font-medium">After Summary</h3>
                </div>
                
                <FormField
                  control={manualForm.control}
                  name="afterSummary"
                  render={({ field }) => (
                    <FormItem>
                      <FormDescription>
                        Summarize the transformation after using your product/service
                      </FormDescription>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the customer's transformation after using the product"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-between mt-6 mb-2">
                  <div className="flex items-center gap-2">
                    <Quote className="h-5 w-5 text-story-blue" />
                    <h3 className="text-lg font-medium">Customer Quotes</h3>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addQuote}>
                    Add Quote
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {quotes.length === 0 && (
                    <div className="text-center py-4 text-gray-500 border border-dashed rounded-md">
                      No quotes added yet. Click "Add Quote" to include customer testimonials.
                    </div>
                  )}
                  
                  {quotes.map((quote, index) => (
                    <div key={quote.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Quote #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeQuote(quote.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Quote Text</label>
                          <Textarea
                            placeholder="Enter the exact quote from the customer"
                            value={quote.quote}
                            onChange={(e) => updateQuote(quote.id, 'quote', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-sm font-medium">Author</label>
                            <Input
                              placeholder="Name of person quoted"
                              value={quote.author}
                              onChange={(e) => updateQuote(quote.id, 'author', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium">Title/Role</label>
                            <Input
                              placeholder="Job title or role"
                              value={quote.title}
                              onChange={(e) => updateQuote(quote.id, 'title', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between mt-6 mb-2">
                  <div className="flex items-center gap-2">
                    <Columns3 className="h-5 w-5 text-story-blue" />
                    <h3 className="text-lg font-medium">Feature-by-Feature Breakdown</h3>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                    Add Feature
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {features.length === 0 && (
                    <div className="text-center py-4 text-gray-500 border border-dashed rounded-md">
                      No features added yet. Click "Add Feature" to include product features that helped.
                    </div>
                  )}
                  
                  {features.map((feature, index) => (
                    <div key={feature.id} className="border rounded-md p-4 space-y-3">
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">Feature #{index + 1}</h4>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeFeature(feature.id)}
                          className="text-destructive hover:text-destructive/90"
                        >
                          Remove
                        </Button>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium">Feature Name</label>
                          <Input
                            placeholder="Name of the feature"
                            value={feature.name}
                            onChange={(e) => updateFeature(feature.id, 'name', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium">How It Helped</label>
                          <Textarea
                            placeholder="Describe how this feature helped the customer"
                            value={feature.description}
                            onChange={(e) => updateFeature(feature.id, 'description', e.target.value)}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <AlertDialogFooter className="pt-4">
                  <AlertDialogCancel onClick={resetFormData}>Cancel</AlertDialogCancel>
                  <AlertDialogAction type="submit">Add Success Story</AlertDialogAction>
                </AlertDialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          {/* URL Extraction Tab */}
          <TabsContent value="url">
            <Form {...urlForm}>
              <form onSubmit={urlForm.handleSubmit(onUrlSubmit)} className="space-y-4">
                <FormField
                  control={urlForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Title of the success story" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={urlForm.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Success Story URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-2">
                          <Input placeholder="https://example.com/success-story" {...field} className="flex-1" />
                          <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Extracting..." : "Extract"}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Enter the URL of a published success story to automatically extract its details
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {!isConfigured && (
                  <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-amber-800 text-sm">
                    <p className="font-medium">Perplexity API Key Not Configured</p>
                    <p className="mt-1">URL extraction requires a valid Perplexity API key.</p>
                  </div>
                )}
                
                <AlertDialogFooter className="mt-6">
                  <AlertDialogCancel onClick={resetFormData}>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </AlertDialogContent>
    </AlertDialog>
  )
}
