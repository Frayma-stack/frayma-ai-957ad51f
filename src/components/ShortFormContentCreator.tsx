
import { FC, useState, useEffect } from 'react';
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
import { ICPStoryScript, Author } from '@/types/storytelling';
import { Loader, Users, Info } from "lucide-react";

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface ShortFormContentCreatorProps {
  contentType: 'email' | 'linkedin' | 'newsletter';
  scripts: ICPStoryScript[];
  authors: Author[];
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  onBack
}) => {
  const [selectedICP, setSelectedICP] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [narrativeAnchorType, setNarrativeAnchorType] = useState<NarrativeAnchor>("pain");
  const [selectedNarrativeItem, setSelectedNarrativeItem] = useState<string>("");
  const [contentGoal, setContentGoal] = useState<ContentGoal>("learn_more");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState<string>("");
  
  const { toast } = useToast();

  // Determine if we're using client-specific assets
  useEffect(() => {
    if (scripts.length > 0 || authors.length > 0) {
      // Check if all assets have the same clientId
      const scriptClientId = scripts.length > 0 ? scripts[0].clientId : undefined;
      const authorClientId = authors.length > 0 ? authors[0].clientId : undefined;
      
      // Get client name from localStorage if available
      if (scriptClientId || authorClientId) {
        const clientId = scriptClientId || authorClientId;
        const savedClients = localStorage.getItem('clients');
        if (savedClients && clientId) {
          const clients = JSON.parse(savedClients);
          const client = clients.find((c: any) => c.id === clientId);
          if (client) {
            setClientName(client.name);
          }
        }
      } else {
        setClientName("All Clients");
      }
    } else {
      setClientName(null);
    }
  }, [scripts, authors]);

  // Reset selected narrative item when ICP or narrative anchor type changes
  useEffect(() => {
    setSelectedNarrativeItem("");
  }, [selectedICP, narrativeAnchorType]);

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

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  // Get available narrative anchor types based on the selected ICP
  const getAnchorTypeOptions = () => {
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

  // Get available items for the selected narrative anchor type
  const getNarrativeItems = () => {
    const script = getSelectedICPScript();
    if (!script) return [];

    switch (narrativeAnchorType) {
      case 'belief':
        return script.coreBeliefs.map(item => ({ id: item.id, content: item.content }));
      case 'pain':
        return script.internalPains.map(item => ({ id: item.id, content: item.content }));
      case 'struggle':
        return script.externalStruggles.map(item => ({ id: item.id, content: item.content }));
      case 'transformation':
        return script.desiredTransformations.map(item => ({ id: item.id, content: item.content }));
      default:
        return [];
    }
  };

  // Get the selected narrative item's content
  const getSelectedNarrativeContent = () => {
    if (!selectedNarrativeItem) return "";
    
    const items = getNarrativeItems();
    const selectedItem = items.find(item => item.id === selectedNarrativeItem);
    return selectedItem ? selectedItem.content : "";
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
    if (!selectedICP || !selectedAuthor || !selectedNarrativeItem) {
      toast({
        title: "Missing information",
        description: "Please select an ICP, author, and narrative item to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = getSelectedAuthor();
      
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
    const narrativeContent = getSelectedNarrativeContent();
    
    let content = `Subject: Quick question about ${narrativeAnchorType === 'struggle' ? 'handling' : 'addressing'} ${script.name} challenges

Hi {{First Name}},

I was looking at your recent work at {{Company}} and noticed you're focused on improving your team's ${script.name.toLowerCase()} operations.

${narrativeContent}

We've helped dozens of ${script.name} teams overcome this exact challenge. In fact, one client recently [specific result they achieved].`;

    // Incorporate additional context if provided
    if (additionalContext) {
      content += `\n\n${additionalContext}`;
    }

    content += `\n\nWould you be open to a quick 15-minute call to explore how we might be able to help your team too?

Best regards,
${author.name}
${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}

P.S. If you'd prefer to learn more before chatting, here's a case study that might be helpful: [LINK]`;
    
    return content;
  };

  const generateLinkedInContent = (script: ICPStoryScript, author: Author) => {
    const narrativeContent = getSelectedNarrativeContent();
    
    let content = `# The ${script.name} Challenge No One's Talking About

${narrativeContent}

But what if there was a better way?`;

    // Incorporate additional context if provided
    if (additionalContext) {
      content += `\n\n${additionalContext}\n`;
    } else {
      content += `\n\nAfter working with dozens of ${script.name}s, we've discovered that the most successful teams approach this differently:`;
    }

    content += `\n\n1. They focus on [key insight]
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
    
    return content;
  };

  const generateNewsletterContent = (script: ICPStoryScript, author: Author) => {
    const narrativeContent = getSelectedNarrativeContent();
    
    let content = `# This Week's Insights for ${script.name}s

Hey there,

I hope this newsletter finds you well. This week, I wanted to address something I've been hearing from many ${script.name}s in our community:

**${narrativeContent}**

It's a common challenge, and one that deserves more attention.`;

    // Incorporate additional context if provided
    if (additionalContext) {
      content += `\n\n${additionalContext}`;
    }

    content += `\n\n## What's Working Now

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
contentGoal === 'learn_more' ? "I've put together a detailed guide on this topic - click here to download it." : 
contentGoal === 'try_product' ? "We've just released a new tool that addresses this directly - click here to try it free for 14 days." : 
"Reply to this email with your biggest question, and I'll address it in next week's newsletter."}

Until next time,
${author.name}
${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}`;
    
    return content;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-story-blue">Create {getContentTypeLabel()}</CardTitle>
            <CardDescription>
              Quick-generate high-performing content
              {clientName && (
                <span className="ml-1 bg-story-blue/10 px-2 py-0.5 rounded-full text-xs text-story-blue">
                  <Users className="inline h-3 w-3 mr-1" />
                  {clientName}
                </span>
              )}
            </CardDescription>
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
                  <SelectItem key={author.id} value={author.id}>
                    {author.name}
                    {author.role ? ` (${author.role})` : ''}
                  </SelectItem>
                ))}
                {authors.length === 0 && (
                  <SelectItem value="no-authors" disabled>
                    No authors available. Add authors in Assets tab.
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Narrative Anchor Type</label>
            <Select 
              value={narrativeAnchorType} 
              onValueChange={(value) => setNarrativeAnchorType(value as NarrativeAnchor)}
              disabled={!selectedICP}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select anchor type" />
              </SelectTrigger>
              <SelectContent>
                {getAnchorTypeOptions().map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Narrative Item</label>
            <Select 
              value={selectedNarrativeItem} 
              onValueChange={setSelectedNarrativeItem}
              disabled={!selectedICP || !narrativeAnchorType}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select specific item" />
              </SelectTrigger>
              <SelectContent>
                {getNarrativeItems().map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    <div className="truncate max-w-[300px]">{item.content}</div>
                  </SelectItem>
                ))}
                {getNarrativeItems().length === 0 && narrativeAnchorType && (
                  <SelectItem value="no-items" disabled>
                    No items available for this anchor type
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {selectedICP && (
              <p className="text-xs text-gray-500 mt-1">
                Based on your selected ICP's story script
              </p>
            )}
          </div>
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
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Additional Context (Optional)</label>
            <span className="text-xs text-gray-500 flex items-center">
              <Info className="h-3 w-3 mr-1" />
              Add specific details to guide generation
            </span>
          </div>
          <Textarea 
            placeholder="Add any additional context, market insights, or specific points you want to highlight in the generated content..."
            value={additionalContext}
            onChange={(e) => setAdditionalContext(e.target.value)}
            className="min-h-[80px]"
          />
        </div>
        
        <Button 
          className="w-full bg-story-blue hover:bg-story-light-blue"
          onClick={generateContent}
          disabled={isGenerating || !selectedICP || !selectedAuthor || !selectedNarrativeItem}
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
