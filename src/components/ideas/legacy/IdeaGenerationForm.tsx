
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb } from 'lucide-react';
import { ICPStoryScript, CustomerSuccessStory, ProductContext, Author } from '@/types/storytelling';
import { IdeaGenerationPrompt } from '@/types/ideas';

interface IdeaGenerationFormProps {
  prompt: IdeaGenerationPrompt;
  isLoading: boolean;
  icpScripts: ICPStoryScript[];
  successStories: CustomerSuccessStory[];
  productContexts: ProductContext[];
  authors: Author[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSelectChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onGenerateIdeas: () => void;
}

const IdeaGenerationForm: FC<IdeaGenerationFormProps> = ({
  prompt,
  isLoading,
  icpScripts,
  successStories,
  productContexts,
  authors,
  onInputChange,
  onSelectChange,
  onGenerateIdeas,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue">Legacy Idea Generator</CardTitle>
        <CardDescription>
          This is the legacy idea generation interface. Use the new Product-Led Storytelling generator for better results.
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
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
              onChange={onInputChange}
              placeholder="e.g., 'Article, Blog Post'"
            />
          </div>
          <div>
            <Label htmlFor="authorId">Author (Style)</Label>
            <select
              id="authorId"
              name="authorId"
              onChange={onSelectChange}
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
              onChange={onSelectChange}
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
              onChange={onSelectChange}
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
            onChange={onSelectChange}
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
          onClick={onGenerateIdeas}
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
  );
};

export default IdeaGenerationForm;
