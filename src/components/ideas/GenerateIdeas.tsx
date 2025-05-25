
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lightbulb, Copy, Check, Trash2, Edit } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { StoryBrief, ICPStoryScript, CustomerSuccessStory, ProductContext, Author } from '@/types/storytelling';
import { ContentIdea, IdeaGenerationPrompt } from '@/types/ideas';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface IdeaItemProps {
  idea: string;
  onDelete: (idea: string) => void;
  onEdit: (idea: string) => void;
  onCopyToClipboard: (idea: string) => void;
}

const IdeaItem: FC<IdeaItemProps> = ({ idea, onDelete, onEdit, onCopyToClipboard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIdea, setEditedIdea] = useState(idea);

  const handleSave = () => {
    onEdit(editedIdea);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-200">
      {isEditing ? (
        <Textarea
          value={editedIdea}
          onChange={(e) => setEditedIdea(e.target.value)}
          className="w-full mr-2"
        />
      ) : (
        <p className="text-sm text-gray-800">{idea}</p>
      )}
      <div>
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={() => onCopyToClipboard(idea)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(idea)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

interface GenerateIdeasProps {
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  authors: Author[];
  onIdeaAdded: (idea: ContentIdea) => void;
  selectedClientId?: string;
}

const GenerateIdeas: FC<GenerateIdeasProps> = ({ 
  icpScripts, 
  successStories, 
  productContexts, 
  authors, 
  onIdeaAdded,
  selectedClientId
}) => {
  const [prompt, setPrompt] = useState<IdeaGenerationPrompt>({
    topic: '',
    targetAudience: '',
    keywords: '',
    tone: '',
    style: '',
    successStoryId: '',
    icpScriptId: '',
    productContextId: '',
    authorId: '',
  });
  const [generatedIdeas, setGeneratedIdeas] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { generateContent } = useChatGPT();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrompt(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateIdeas = async () => {
    if (!prompt.topic) {
      toast({
        title: "Missing Topic",
        description: "Please enter a topic to generate ideas.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      let fullPrompt = `Generate 5 content ideas about ${prompt.topic}.`;

      if (prompt.targetAudience) {
        fullPrompt += ` Target audience: ${prompt.targetAudience}.`;
      }
      if (prompt.keywords) {
        fullPrompt += ` Keywords: ${prompt.keywords}.`;
      }
      if (prompt.tone) {
        fullPrompt += ` Tone: ${prompt.tone}.`;
      }
      if (prompt.style) {
        fullPrompt += ` Style: ${prompt.style}.`;
      }

      // Add context from selected items
      if (prompt.successStoryId) {
        const story = successStories.find(s => s.id === prompt.successStoryId);
        if (story) {
          fullPrompt += ` Incorporate elements from the success story: ${story.title} - ${story.beforeSummary} to ${story.afterSummary}.`;
        }
      }
      if (prompt.icpScriptId) {
        const icp = icpScripts.find(icp => icp.id === prompt.icpScriptId);
        if (icp) {
          fullPrompt += ` Align with the ideal customer profile: ${icp.name} - Core Beliefs: ${icp.coreBeliefs.map(b => b.content).join(', ')}.`;
        }
      }
      if (prompt.productContextId) {
        const product = productContexts.find(p => p.id === prompt.productContextId);
        if (product) {
          fullPrompt += ` Highlight aspects of the product context: ${product.categoryPOV} - ${product.companyMission}.`;
        }
      }
      if (prompt.authorId) {
        const author = authors.find(a => a.id === prompt.authorId);
        if (author) {
          fullPrompt += ` Write in the style of ${author.name} - ${author.backstory}.`;
        }
      }

      const response = await generateContent(fullPrompt);
      if (response) {
        const ideas = response.split('\n').filter(idea => idea.trim() !== '');
        setGeneratedIdeas(ideas);
      } else {
        toast({
          title: "Idea Generation Failed",
          description: "Failed to generate ideas. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error generating ideas:", error);
      toast({
        title: "Idea Generation Error",
        description: "An error occurred while generating ideas.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIdea = (idea: string) => {
    const newIdea: ContentIdea = {
      id: crypto.randomUUID(),
      title: idea,
      description: '',
      contentType: 'thought_leadership', // Default value
      articleSubtype: 'blog_post', // Default value
      status: 'draft', // Default value
      clientId: selectedClientId,
      createdAt: new Date().toISOString(),
    };
    onIdeaAdded(newIdea);
    setGeneratedIdeas(prev => prev.filter(i => i !== idea));
    toast({
      title: "Idea Added",
      description: "Idea added to your list.",
    });
  };

  const handleDeleteIdea = (ideaToDelete: string) => {
    setGeneratedIdeas(prev => prev.filter(idea => idea !== ideaToDelete));
  };

  const handleEditIdea = (editedIdea: string) => {
    setGeneratedIdeas(prev =>
      prev.map(idea => (idea === editedIdea ? editedIdea : idea))
    );
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to Clipboard",
      description: "The idea has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-story-blue">Generate Content Ideas</CardTitle>
          <CardDescription>
            Use AI to brainstorm new content ideas based on your inputs.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="topic">Topic</Label>
              <Input
                type="text"
                id="topic"
                name="topic"
                value={prompt.topic}
                onChange={handleInputChange}
                placeholder="e.g., 'Future of AI in Marketing'"
              />
            </div>
            <div>
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                type="text"
                id="targetAudience"
                name="targetAudience"
                value={prompt.targetAudience}
                onChange={handleInputChange}
                placeholder="e.g., 'Marketing Professionals'"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                type="text"
                id="keywords"
                name="keywords"
                value={prompt.keywords}
                onChange={handleInputChange}
                placeholder="e.g., 'AI, Marketing, Automation'"
              />
            </div>
            <div>
              <Label htmlFor="tone">Tone</Label>
              <Input
                type="text"
                id="tone"
                name="tone"
                value={prompt.tone}
                onChange={handleInputChange}
                placeholder="e.g., 'Professional, Informative'"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="style">Style</Label>
              <Input
                type="text"
                id="style"
                name="style"
                value={prompt.style}
                onChange={handleInputChange}
                placeholder="e.g., 'Article, Blog Post'"
              />
            </div>
            <div>
              <Label htmlFor="authorId">Author (Style)</Label>
              <select
                id="authorId"
                name="authorId"
                onChange={handleSelectChange}
                value={prompt.authorId}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Author</option>
                {authors.map(author => (
                  <option key={author.id} value={author.id}>{author.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="successStoryId">Success Story (Context)</Label>
              <select
                id="successStoryId"
                name="successStoryId"
                onChange={handleSelectChange}
                value={prompt.successStoryId}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Success Story</option>
                {successStories.map(story => (
                  <option key={story.id} value={story.id}>{story.title}</option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="icpScriptId">ICP Script (Audience)</Label>
              <select
                id="icpScriptId"
                name="icpScriptId"
                onChange={handleSelectChange}
                value={prompt.icpScriptId}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select ICP Script</option>
                {icpScripts.map(icp => (
                  <option key={icp.id} value={icp.id}>{icp.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <Label htmlFor="productContextId">Product Context (Relevance)</Label>
            <select
              id="productContextId"
              name="productContextId"
              onChange={handleSelectChange}
              value={prompt.productContextId}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Select Product Context</option>
              {productContexts.map(product => (
                <option key={product.id} value={product.id}>{product.categoryPOV}</option>
              ))}
            </select>
          </div>
          <Button
            className="w-full bg-story-blue hover:bg-story-light-blue"
            onClick={handleGenerateIdeas}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Ideas...
              </>
            ) : (
              <>
                <Lightbulb className="mr-2 h-4 w-4" />
                Generate Ideas
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {generatedIdeas.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-800">Generated Ideas</h3>
          <div className="space-y-2">
            {generatedIdeas.map((idea, index) => (
              <IdeaItem
                key={index}
                idea={idea}
                onDelete={handleDeleteIdea}
                onEdit={handleEditIdea}
                onCopyToClipboard={handleCopyToClipboard}
              />
            ))}
          </div>
          <Button className="bg-green-500 hover:bg-green-700 text-white" onClick={() => {
            generatedIdeas.forEach(idea => {
              const newIdea: ContentIdea = {
                id: crypto.randomUUID(),
                title: idea,
                description: '',
                contentType: 'thought_leadership', // Default value
                articleSubtype: 'blog_post', // Default value
                status: 'draft', // Default value
                clientId: selectedClientId,
                createdAt: new Date().toISOString(),
              };
              onIdeaAdded(newIdea);
            });
            setGeneratedIdeas([]);
            toast({
              title: "Ideas Added",
              description: "All ideas added to your list.",
            });
          }}>Add All Ideas</Button>
        </div>
      )}
    </div>
  );
};

export default GenerateIdeas;
