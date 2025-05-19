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
import { Plus } from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { CustomerSuccessStory } from "@/types/storytelling"
import { v4 as uuidv4 } from 'uuid';
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  url: z.string().optional(),
  beforeSummary: z.string().min(10, {
    message: "Before summary must be at least 10 characters.",
  }),
  afterSummary: z.string().min(10, {
    message: "After summary must be at least 10 characters.",
  }),
})

interface AddSuccessStoryDialogProps {
  onStoryAdded: (story: CustomerSuccessStory) => void;
}

export function AddSuccessStoryDialog({ onStoryAdded }: AddSuccessStoryDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
      url: "",
      beforeSummary: "",
      afterSummary: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newStory: CustomerSuccessStory = {
      id: uuidv4(),
      title: values.title,
      url: values.url,
      beforeSummary: values.beforeSummary,
      afterSummary: values.afterSummary,
      quotes: [],
      features: [],
      createdAt: new Date().toISOString(),
    };
    onStoryAdded(newStory);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          Add Success Story
          <Plus className="ml-2 h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add New Success Story</AlertDialogTitle>
          <AlertDialogDescription>
            Add a new customer success story to showcase your product's impact.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title of the success story" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the title of the success story.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="URL of the success story" {...field} />
                  </FormControl>
                  <FormDescription>
                    If the story is from a web page, enter the URL here.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="beforeSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Before Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary of the situation before using the product"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the customer's situation before using the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="afterSummary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>After Summary</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Summary of the situation after using the product"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Describe the customer's situation after using the product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type="submit">Add Story</AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  )
}
