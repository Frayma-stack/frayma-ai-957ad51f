
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { ICPStoryScript } from '@/types/storytelling';
import { Loader } from "lucide-react";

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface Author {
  id: string;
  name: string;
}

interface ShortFormContentCreatorProps {
  contentType: 'email' | 'linkedin' | 'newsletter';
  scripts: ICPStoryScript[];
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  onBack
}) => {
  const [selectedICP, setSelectedICP] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [narrativeAnchor, setNarrativeAnchor] = useState<NarrativeAnchor>("pain");
  const [contentGoal, setContentGoal] = useState<ContentGoal>("learn_more");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Mock authors for demo purposes
  const authors: Author[] = [
    { id: "1", name: "Jordan Smith" },
    { id: "2", name: "Alex Johnson" },
    { id: "3", name: "Taylor Wilson" }
  ];

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'newsletter': return 'Newsletter';
      default: return 'Content';
    }
  };

  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getAnchorOptions = () => {
    const script = getSelectedICPScript();
    if (!script) return [];

    const options = [];
    
    if (script.coreBeliefs.some(item => item.content.trim())) {
      options.push({value: 'belief', label: 'Core Belief'});
    }
    
    if (script.internalPains.some(item => item.content.trim())) {
      options.push({value: 'pain', label: 'Internal Pain'});
    }
    
    if (script.externalStruggles.some(item => item.content.trim())) {
      options.push({value: 'struggle', label: 'External Struggle'});
    }
    
    if (script.desiredTransformations.some(item => item.content.trim())) {
      options.push({value: 'transformation', label: 'Desired Transformation'});
    }
    
    return options;
  };

  const getGoalLabel = (goal: ContentGoal) => {
    switch (goal) {
      case 'book_call': return 'Book a call';
      case 'learn_more': return 'Learn more';
      case 'try_product': return 'Try product';
      case 'reply': return 'Reply to email';
      case 'visit_article': return 'Visit article';
      default: return '';
    }
  };

  const generateContent = () => {
    if (!selectedICP || !selectedAuthor) {
      toast({
        title: "Missing information",
        description: "Please select both an ICP and an author to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = authors.find(a => a.id === selectedAuthor);
      
      if (!script || !author) {
        setIsGenerating(false);
        return;
      }
      
      // Generate different content based on content type and selected options
      let content = "";
      
      if (contentType === 'email') {
        content = generateEmailContent(script, author);
      } else if (contentType === 'linkedin') {
        content = generateLinkedInContent(script, author);
      } else if (contentType === 'newsletter') {
        content = generateNewsletterContent(script, author);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: `${getContentTypeLabel()} generated`,
        description: "Your content has been created. Feel free to edit it as needed."
      });
    }, 1500);
  };

  const generateEmailContent = (script: ICPStoryScript, author: Author) => {
    let anchorText = "";
    
    switch (narrativeAnchor) {
      case 'belief':
        anchorText = script.coreBeliefs[0]?.content || '';
        break;
      case 'pain':
        anchorText = script.internalPains[0]?.content || '';
        break;
      case 'struggle':
        anchorText = script.externalStruggles[0]?.content || '';
        break;
      case 'transformation':
        anchorText = script.desiredTransformations[0]?.content || '';
        break;
    }
    
    return `Subject: Quick question about ${narrativeAnchor === 'struggle' ? 'handling' : 'addressing'} ${script.name} challenges

Hi {{First Name}},

I was looking at your recent work at {{Company}} and noticed you're focused on improving your team's ${script.name.toLowerCase()} operations.

${anchorText}

We've helped dozens of ${script.name} teams overcome this exact challenge. In fact, one client recently [specific result they achieved].

Would you be open to a quick 15-minute call to explore how we might be able to help your team too?

Best regards,
${author.name}

P.S. If you'd prefer to learn more before chatting, here's a case study that might be helpful: [LINK]`;
  };

  const generateLinkedInContent = (script: ICPStoryScript, author: Author) => {
    let anchorText = "";
    
    switch (narrativeAnchor) {
      case 'belief':
        anchorText = script.coreBeliefs[0]?.content || '';
        break;
      case 'pain':
        anchorText = script.internalPains[0]?.content || '';
        break;
      case 'struggle':
        anchorText = script.externalStruggles[0]?.content || '';
        break;
      case 'transformation':
        anchorText = script.desiredTransformations[0]?.content || '';
        break;
    }
    
    return `# The ${script.name} Challenge No One's Talking About

${anchorText}

But what if there was a better way?

After working with dozens of ${script.name}s, we've discovered that the most successful teams approach this differently:

1. They focus on [key insight]
2. They implement [key process]
3. They measure [key metric]

The results?
• [Result 1]
• [Result 2]
• [Result 3]

Want to learn how your team can achieve similar results?

${contentGoal === 'book_call' ? 'DM me to set up a quick call.' : 
contentGoal === 'learn_more' ? 'Check out our latest guide (link in comments).' : 
contentGoal === 'try_product' ? 'Try our free assessment tool (link in comments).' : 
'Comment below with your biggest challenge in this area.'}

#${script.name.replace(/\s+/g, '')} #Leadership #Innovation`;
  };

  const generateNewsletterContent = (script: ICPStoryScript, author: Author) => {
    let anchorText = "";
    
    switch (narrativeAnchor) {
      case 'belief':
        anchorText = script.coreBeliefs[0]?.content || '';
        break;
      case 'pain':
        anchorText = script.internalPains[0]?.content || '';
        break;
      case 'struggle':
        anchorText = script.externalStruggles[0]?.content || '';
        break;
      case 'transformation':
        anchorText = script.desiredTransformations[0]?.content || '';
        break;
    }
    
    return `# This Week's Insights for ${script.name}s

Hey there,

I hope this newsletter finds you well. This week, I wanted to address something I've been hearing from many ${script.name}s in our community:

**${anchorText}**

It's a common challenge, and one that deserves more attention. 

## What's Working Now

In my recent conversations with successful ${script.name}s, three strategies keep coming up:

1. **[Strategy 1]** - How this helps and why it matters
2. **[Strategy 2]** - The unexpected benefit this provides
3. **[Strategy 3]** - Why this is often overlooked but critically important

## Client Spotlight

[Client Name] was struggling with this exact issue last quarter. After implementing the approach above, they saw [specific result]. Here's what they had to say:

*"Quote from the client about their transformation..."*

## What's Next?

If you're facing this challenge in your organization, I'd love to help.

${contentGoal === 'book_call' ? 'Click here to schedule a free strategy call with me this week.' : 
contentGoal === 'learn_more' ? 'I've put together a detailed guide on this topic - click here to download it.' : 
contentGoal === 'try_product' ? 'We've just released a new tool that addresses this directly - click here to try it free for 14 days.' : 
'Reply to this email with your biggest question, and I'll address it in next week\'s newsletter.'}

Until next time,
${author.name}`;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-story-blue">Create {getContentTypeLabel()}</CardTitle>
            <CardDescription>Quick-generate high-performing content</CardDescription>
          </div>
          <Button variant="outline" onClick={onBack}>Back to Content Types</Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select ICP</label>
            <Select value={selectedICP} onValueChange={setSelectedICP}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an ICP" />
              </SelectTrigger>
              <SelectContent>
                {scripts.map(script => (
                  <SelectItem key={script.id} value={script.id}>{script.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Author</label>
            <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
              <SelectTrigger>
                <SelectValue placeholder="Choose an author" />
              </SelectTrigger>
              <SelectContent>
                {authors.map(author => (
                  <SelectItem key={author.id} value={author.id}>{author.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Narrative Anchor</label>
            <Select 
              value={narrativeAnchor} 
              onValueChange={(value) => setNarrativeAnchor(value as NarrativeAnchor)}
              disabled={!selectedICP}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select anchor" />
              </SelectTrigger>
              <SelectContent>
                {getAnchorOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedICP && (
              <p className="text-xs text-gray-500 mt-1">
                Based on your selected ICP's story script
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Content Goal / CTA</label>
            <Select 
              value={contentGoal} 
              onValueChange={(value) => setContentGoal(value as ContentGoal)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="book_call">Book a call</SelectItem>
                <SelectItem value="learn_more">Learn more</SelectItem>
                <SelectItem value="try_product">Try product</SelectItem>
                <SelectItem value="reply">Reply to email</SelectItem>
                <SelectItem value="visit_article">Visit article</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button 
          className="w-full bg-story-blue hover:bg-story-light-blue"
          onClick={generateContent}
          disabled={isGenerating || !selectedICP || !selectedAuthor}
        >
          {isGenerating ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            `Generate ${getContentTypeLabel()}`
          )}
        </Button>
        
        {generatedContent && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Generated {getContentTypeLabel()}</h3>
            <Textarea 
              className="min-h-[300px] story-paper p-4"
              value={generatedContent}
              onChange={(e) => setGeneratedContent(e.target.value)}
            />
          </div>
        )}
      </CardContent>
      {generatedContent && (
        <CardFooter className="border-t pt-4 flex flex-col sm:flex-row gap-2 w-full">
          <Button className="flex-1 bg-story-blue hover:bg-story-light-blue">
            Copy Content
          </Button>
          <Button variant="outline" className="flex-1">
            Export as Document
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default ShortFormContentCreator;
