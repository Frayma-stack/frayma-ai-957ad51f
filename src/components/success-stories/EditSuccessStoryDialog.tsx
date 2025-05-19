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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Plus, Trash } from "lucide-react"
import { FC, useState } from "react"

interface EditSuccessStoryDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  story: {
    id: string
    title: string
    url?: string
    beforeSummary: string
    afterSummary: string
    quotes: Array<{
      id: string
      quote: string
      author: string
      title: string
    }>
    features: Array<{
      id: string
      name: string
      description: string
    }>
    clientId?: string
    createdAt: string
  }
  onUpdate: (story: any) => void
  onDelete: (id: string) => void
}

const EditSuccessStoryDialog: FC<EditSuccessStoryDialogProps> = ({
  open,
  setOpen,
  story,
  onUpdate,
  onDelete,
}) => {
  const { toast } = useToast()
  const [title, setTitle] = useState(story.title)
  const [url, setUrl] = useState(story.url || "")
  const [beforeSummary, setBeforeSummary] = useState(story.beforeSummary)
  const [afterSummary, setAfterSummary] = useState(story.afterSummary)
  const [quotes, setQuotes] = useState(story.quotes)
  const [features, setFeatures] = useState(story.features)

  const handleQuoteAdd = () => {
    setQuotes([
      ...quotes,
      { id: crypto.randomUUID(), quote: "", author: "", title: "" },
    ])
  }

  const handleQuoteUpdate = (
    id: string,
    field: string,
    value: string
  ) => {
    setQuotes(
      quotes.map((quote) =>
        quote.id === id ? { ...quote, [field]: value } : quote
      )
    )
  }

  const handleQuoteDelete = (id: string) => {
    setQuotes(quotes.filter((quote) => quote.id !== id))
  }

  const handleFeatureAdd = () => {
    setFeatures([
      ...features,
      { id: crypto.randomUUID(), name: "", description: "" },
    ])
  }

  const handleFeatureUpdate = (
    id: string,
    field: string,
    value: string
  ) => {
    setFeatures(
      features.map((feature) =>
        feature.id === id ? { ...feature, [field]: value } : feature
      )
    )
  }

  const handleFeatureDelete = (id: string) => {
    setFeatures(features.filter((feature) => feature.id !== id))
  }

  const handleSubmit = () => {
    if (!title || !beforeSummary || !afterSummary) {
      toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    const updatedStory = {
      ...story,
      title,
      url,
      beforeSummary,
      afterSummary,
      quotes,
      features,
    }

    onUpdate(updatedStory)
    setOpen(false)
    toast({
      title: "Success",
      description: "Story updated.",
    })
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Edit</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Success Story</AlertDialogTitle>
          <AlertDialogDescription>
            Make changes to your success story here. Click save when you're
            done.
          </AlertDialogDescription>
        </AlertDialogHeader>
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
              URL
            </Label>
            <Input
              type="text"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="beforeSummary" className="text-right mt-2">
              Before Summary
            </Label>
            <Textarea
              id="beforeSummary"
              value={beforeSummary}
              onChange={(e) => setBeforeSummary(e.target.value)}
              className="col-span-3 min-h-[80px]"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="afterSummary" className="text-right mt-2">
              After Summary
            </Label>
            <Textarea
              id="afterSummary"
              value={afterSummary}
              onChange={(e) => setAfterSummary(e.target.value)}
              className="col-span-3 min-h-[80px]"
            />
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quotes</CardTitle>
                <CardDescription>
                  Add quotes to your success story.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {quotes.map((quote) => (
                  <div key={quote.id} className="space-y-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`quote-${quote.id}`} className="text-right">
                        Quote
                      </Label>
                      <Textarea
                        id={`quote-${quote.id}`}
                        value={quote.quote}
                        onChange={(e) =>
                          handleQuoteUpdate(quote.id, "quote", e.target.value)
                        }
                        className="col-span-2 min-h-[50px]"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`author-${quote.id}`} className="text-right">
                        Author
                      </Label>
                      <Input
                        type="text"
                        id={`author-${quote.id}`}
                        value={quote.author}
                        onChange={(e) =>
                          handleQuoteUpdate(quote.id, "author", e.target.value)
                        }
                        className="col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`title-${quote.id}`} className="text-right">
                        Title
                      </Label>
                      <Input
                        type="text"
                        id={`title-${quote.id}`}
                        value={quote.title}
                        onChange={(e) =>
                          handleQuoteUpdate(quote.id, "title", e.target.value)
                        }
                        className="col-span-2"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuoteDelete(quote.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleQuoteAdd}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quote
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Features</CardTitle>
                <CardDescription>
                  Add features to your success story.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {features.map((feature) => (
                  <div key={feature.id} className="space-y-2">
                    <div className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={`name-${feature.id}`} className="text-right">
                        Name
                      </Label>
                      <Input
                        type="text"
                        id={`name-${feature.id}`}
                        value={feature.name}
                        onChange={(e) =>
                          handleFeatureUpdate(feature.id, "name", e.target.value)
                        }
                        className="col-span-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 items-start gap-4">
                      <Label htmlFor={`description-${feature.id}`} className="text-right mt-2">
                        Description
                      </Label>
                      <Textarea
                        id={`description-${feature.id}`}
                        value={feature.description}
                        onChange={(e) =>
                          handleFeatureUpdate(
                            feature.id,
                            "description",
                            e.target.value
                          )
                        }
                        className="col-span-2 min-h-[50px]"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleFeatureDelete(feature.id)}
                      >
                        <Trash className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    <Separator />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleFeatureAdd}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Feature
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button onClick={handleSubmit}>Save</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default EditSuccessStoryDialog
