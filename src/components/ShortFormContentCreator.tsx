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
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ICPStoryScript, 
  Author, 
  CustomerSuccessStory,
  NarrativeSelection,
  ContentGenerationOptions
} from '@/types/storytelling';
import { 
  Loader, 
  Users, 
  Info, 
  List, 
  TextCursor, 
  MailPlus, 
  Mic, 
  User, 
  Star 
} from "lucide-react";

type NarrativeAnchor = 'belief' | 'pain' | 'struggle' | 'transformation';
type ContentGoal = 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';

interface ShortFormContentCreatorProps {
  contentType: 'email' | 'linkedin' | 'custom';
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  onBack: () => void;
}

const ShortFormContentCreator: FC<ShortFormContentCreatorProps> = ({ 
  contentType, 
  scripts,
  authors,
  successStories,
  onBack
}) => {
  const [selectedICP, setSelectedICP] = useState<string>("");
  const [selectedAuthor, setSelectedAuthor] = useState<string>("");
  const [selectedAuthorTone, setSelectedAuthorTone] = useState<string>("");
  const [selectedAuthorExperience, setSelectedAuthorExperience] = useState<string>("");
  const [narrativeSelections, setNarrativeSelections] = useState<NarrativeSelection[]>([]);
  const [contentGoal, setContentGoal] = useState<ContentGoal>("learn_more");
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [clientName, setClientName] = useState<string | null>(null);
  const [additionalContext, setAdditionalContext] = useState<string>("");
  const [selectedSuccessStory, setSelectedSuccessStory] = useState<string>("none");
  const [wordCount, setWordCount] = useState<number>(300);
  const [emailCount, setEmailCount] = useState<number>(3);
  const [availableAnchors, setAvailableAnchors] = useState<{value: string, label: string}[]>([]);
  
  const { toast } = useToast();

  // Determine if we're using client-specific assets
  useEffect(() => {
    if (scripts.length > 0 || authors.length > 0 || successStories.length > 0) {
      const scriptClientId = scripts.length > 0 ? scripts[0].clientId : undefined;
      const authorClientId = authors.length > 0 ? authors[0].clientId : undefined;
      const storyClientId = successStories.length > 0 ? successStories[0].clientId : undefined;
      
      const clientId = scriptClientId || authorClientId || storyClientId;
      if (clientId) {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
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
  }, [scripts, authors, successStories]);

  // Update available narrative anchors when ICP changes
  useEffect(() => {
    if (selectedICP) {
      const script = getSelectedICPScript();
      if (script) {
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
        
        setAvailableAnchors(options);
        
        if (narrativeSelections.length === 0) {
          const firstOption = options[0]?.value as NarrativeAnchor;
          if (firstOption) {
            setNarrativeSelections([{ type: firstOption, items: [] }]);
          }
        }
      }
    }
  }, [selectedICP]);
  
  // Reset author tone and experience when author changes
  useEffect(() => {
    setSelectedAuthorTone("");
    setSelectedAuthorExperience("");
  }, [selectedAuthor]);

  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  const getSelectedICPScript = () => {
    return scripts.find(script => script.id === selectedICP);
  };

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };
  
  const getSelectedSuccessStory = () => {
    if (selectedSuccessStory === "none") return undefined;
    return successStories.find(story => story.id === selectedSuccessStory);
  };

  // Get available tones for the selected author
  const getAuthorTones = () => {
    const author = getSelectedAuthor();
    return author?.tones || [];
  };

  // Get available experiences for the selected author
  const getAuthorExperiences = () => {
    const author = getSelectedAuthor();
    return author?.experiences || [];
  };

  // Check if a narrative anchor type is selected
  const isAnchorTypeSelected = (type: NarrativeAnchor) => {
    return narrativeSelections.some(selection => selection.type === type);
  };
  
  // Add or remove a narrative anchor type
  const toggleAnchorType = (type: NarrativeAnchor) => {
    if (isAnchorTypeSelected(type)) {
      setNarrativeSelections(narrativeSelections.filter(selection => selection.type !== type));
    } else {
      setNarrativeSelections([...narrativeSelections, { type, items: [] }]);
    }
  };

  // Get available items for a specific narrative anchor type
  const getNarrativeItems = (type: NarrativeAnchor) => {
    const script = getSelectedICPScript();
    if (!script) return [];

    switch (type) {
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

  // Check if a narrative item is selected
  const isItemSelected = (type: NarrativeAnchor, itemId: string) => {
    const selection = narrativeSelections.find(s => s.type === type);
    return selection ? selection.items.includes(itemId) : false;
  };
  
  // Toggle an item selection for a specific narrative anchor type
  const toggleItemSelection = (type: NarrativeAnchor, itemId: string) => {
    setNarrativeSelections(narrativeSelections.map(selection => {
      if (selection.type === type) {
        if (selection.items.includes(itemId)) {
          return { ...selection, items: selection.items.filter(id => id !== itemId) };
        } else {
          return { ...selection, items: [...selection.items, itemId] };
        }
      }
      return selection;
    }));
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
  
  // Check if form is valid for generation
  const isFormValid = () => {
    if (!selectedICP || !selectedAuthor) return false;
    
    const hasSelectedItems = narrativeSelections.some(
      selection => selection.items.length > 0
    );
    
    return hasSelectedItems;
  };

  const generateContent = () => {
    if (!isFormValid()) {
      toast({
        title: "Missing information",
        description: "Please select an ICP, author, and at least one narrative item to generate content.",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);

    // Simulate content generation
    setTimeout(() => {
      const script = getSelectedICPScript();
      const author = getSelectedAuthor();
      const successStory = getSelectedSuccessStory();
      
      if (!script || !author) {
        setIsGenerating(false);
        return;
      }
      
      let content = "";
      
      if (contentType === 'email') {
        content = generateEmailContent(script, author, successStory);
      } else if (contentType === 'linkedin') {
        content = generateLinkedInContent(script, author, successStory);
      } else if (contentType === 'custom') {
        content = generateCustomContent(script, author, successStory);
      }
      
      setGeneratedContent(content);
      setIsGenerating(false);
      
      toast({
        title: `${getContentTypeLabel()} generated`,
        description: "Your content has been created. Feel free to edit it as needed."
      });
    }, 1500);
  };

  const generateEmailContent = (script: ICPStoryScript, author: Author, successStory?: CustomerSuccessStory | undefined) => {
    const narrativeContent = getSelectedNarrativeContents();
    
    let content = `Subject: Quick question about ${narrativeSelections[0]?.type === 'struggle' ? 'handling' : 'addressing'} ${script.name} challenges\n\n`;
    content += `Hi {{First Name}},\n\n`;
    content += `I was looking at your recent work at {{Company}} and noticed you're focused on improving your team's ${script.name.toLowerCase()} operations.\n\n`;
    
    if (selectedAuthorTone || selectedAuthorExperience) {
      content += "As someone ";
      
      if (selectedAuthorExperience) {
        const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
        if (experience) {
          content += `with experience in ${experience.title}, `;
        }
      }
      
      if (selectedAuthorTone) {
        const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
        if (tone) {
          content += `who communicates in a ${tone.tone} manner, `;
        }
      }
      
      content += "I wanted to reach out personally.\n\n";
    }
    
    if (narrativeContent.length > 0) {
      content += `${narrativeContent[0]}\n\n`;
    }

    if (successStory) {
      content += `We've helped companies like ${successStory.title} overcome this exact challenge. ${successStory.afterSummary}\n\n`;
    } else {
      content += `We've helped dozens of ${script.name} teams overcome this exact challenge. In fact, one client recently [specific result they achieved].\n\n`;
    }

    if (additionalContext) {
      content += `${additionalContext}\n\n`;
    }

    content += `Would you be open to a quick 15-minute call to explore how we might be able to help your team too?\n\n`;
    content += `Best regards,\n${author.name}\n`;
    content += `${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}\n\n`;
    content += `P.S. If you'd prefer to learn more before chatting, here's a case study that might be helpful: [LINK]`;
    
    if (emailCount > 1) {
      for (let i = 1; i < emailCount; i++) {
        content += `\n\n------- FOLLOW-UP EMAIL ${i} -------\n\n`;
        
        content += `Subject: Following up: ${script.name} challenges\n\n`;
        content += `Hi {{First Name}},\n\n`;
        
        if (i === 1) {
          content += `I wanted to follow up on my previous email about addressing ${script.name.toLowerCase()} challenges.\n\n`;
          
          if (narrativeContent.length > i) {
            content += `${narrativeContent[i]}\n\n`;
          }
          
          content += `I'd love to share how we've helped similar companies overcome these challenges.\n\n`;
        } else {
          content += `I hope you've been well since my last message.\n\n`;
          content += `I understand you're busy, but I wanted to quickly share ${narrativeContent.length > i ? narrativeContent[i] : "another insight that might be valuable for you"}.\n\n`;
          content += `If any of this resonates with you, I'd be happy to schedule a brief call at your convenience.\n\n`;
        }
        
        content += `Best regards,\n${author.name}\n`;
        content += `${author.role ? `${author.role}${author.organization ? `, ${author.organization}` : ''}` : ''}`;
      }
    }
    
    return content;
  };

  const generateLinkedInContent = (script: ICPStoryScript, author: Author, successStory?: CustomerSuccessStory | undefined) => {
    const narrativeContent = getSelectedNarrativeContents();
    
    let content = `# The ${script.name} Challenge No One's Talking About\n\n`;
    
    if (selectedAuthorTone || selectedAuthorExperience) {
      content += "As someone ";
      
      if (selectedAuthorExperience) {
        const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
        if (experience) {
          content += `with ${experience.title}, `;
        }
      }
      
      if (selectedAuthorTone) {
        const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
        if (tone) {
          content += `who approaches these topics in a ${tone.tone} way, `;
        }
      }
      
      content += "I want to highlight an important issue.\n\n";
    }
    
    if (narrativeContent.length > 0) {
      content += `${narrativeContent[0]}\n\n`;
      
      if (narrativeContent.length > 1) {
        content += `And that's not all. ${narrativeContent[1]}\n\n`;
      }
    }

    content += `But what if there was a better way?\n\n`;

    if (successStory) {
      content += `We recently worked with ${successStory.title} who was facing this exact challenge.\n\n`;
      content += `Before: ${successStory.beforeSummary}\n\n`;
      content += `After: ${successStory.afterSummary}\n\n`;
      
      if (successStory.quotes.length > 0) {
        content += `"${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
      }
    }

    if (additionalContext) {
      content += `${additionalContext}\n\n`;
    } else {
      content += `After working with dozens of ${script.name}s, we've discovered that the most successful teams approach this differently:\n\n`;
    }

    content += `1. They focus on [key insight]\n`;
    content += `2. They implement [key process]\n`;
    content += `3. They measure [key metric]\n\n`;
    
    content += `The results?\n`;
    content += `• [Result 1]\n`;
    content += `• [Result 2]\n`;
    content += `• [Result 3]\n\n`;

    content += `Want to learn how your team can achieve similar results?\n\n`;

    content += `${contentGoal === 'book_call' ? 'DM me to set up a quick call.' : 
    contentGoal === 'learn_more' ? 'Check out our latest guide (link in comments).' : 
    contentGoal === 'try_product' ? 'Try our free assessment tool (link in comments).' : 
    'Comment below with your biggest challenge in this area.'}\n\n`;

    content += `#${script.name.replace(/\s+/g, '')} #Leadership #Innovation`;
    
    return content;
  };

  const generateCustomContent = (script: ICPStoryScript, author: Author, successStory?: CustomerSuccessStory | undefined) => {
    const narrativeContent = getSelectedNarrativeContents();
    
    let content = `# ${script.name}: Overcoming Key Challenges in Today's Market\n\n`;
    
    content += `By ${author.name}, ${author.role}${author.organization ? ` at ${author.organization}` : ''}\n\n`;
    
    if (selectedAuthorTone || selectedAuthorExperience) {
      content += "*About the author: ";
      
      if (selectedAuthorExperience) {
        const experience = getAuthorExperiences().find(exp => exp.id === selectedAuthorExperience);
        if (experience) {
          content += `With expertise in ${experience.title}`;
        }
      }
      
      if (selectedAuthorTone && selectedAuthorExperience) {
        content += ", ";
      }
      
      if (selectedAuthorTone) {
        const tone = getAuthorTones().find(t => t.id === selectedAuthorTone);
        if (tone) {
          content += `known for a ${tone.tone} perspective`;
        }
      }
      
      content += `.*\n\n`;
    }
    
    content += `## Introduction\n\n`;
    content += `In today's rapidly evolving landscape for ${script.name}, professionals face numerous challenges that can impact their effectiveness and results.\n\n`;
    
    content += `## Key Challenges\n\n`;
    
    narrativeContent.forEach((item, index) => {
      if (index < 3) {
        content += `### Challenge ${index + 1}\n\n`;
        content += `${item}\n\n`;
      }
    });

    if (successStory) {
      content += `## Customer Spotlight: ${successStory.title}\n\n`;
      content += `### Before\n${successStory.beforeSummary}\n\n`;
      content += `### After\n${successStory.afterSummary}\n\n`;
      
      if (successStory.quotes.length > 0) {
        content += `> "${successStory.quotes[0].quote}"\n>\n> — ${successStory.quotes[0].author}, ${successStory.quotes[0].title}\n\n`;
      }
      
      if (successStory.features.length > 0) {
        content += `### Key Solutions Implemented\n\n`;
        successStory.features.forEach((feature, index) => {
          content += `${index + 1}. **${feature.name}**: ${feature.description}\n`;
        });
        content += `\n`;
      }
    }
    
    if (additionalContext) {
      content += `## Additional Insights\n\n${additionalContext}\n\n`;
    }

    content += `## Solutions and Best Practices\n\n`;
    content += `Based on our experience working with leading ${script.name}s, here are the approaches that consistently deliver results:\n\n`;
    content += `1. **Strategic Alignment**: Ensure your [specific approach] aligns with business objectives.\n`;
    content += `2. **Process Optimization**: Implement [specific process] to streamline operations.\n`;
    content += `3. **Measurement Framework**: Track [specific metrics] to quantify success.\n\n`;
    
    content += `## Next Steps\n\n`;
    
    content += `${contentGoal === 'book_call' ? 'Ready to transform your approach? Schedule a consultation with our team to discuss your specific challenges.' : 
    contentGoal === 'learn_more' ? 'Want to learn more? Download our comprehensive guide on this topic.' : 
    contentGoal === 'try_product' ? 'Experience the difference firsthand. Start your free trial today.' : 
    contentGoal === 'visit_article' ? 'For more insights, check out our related article on this topic.' :
    'Connect with us to discuss how these strategies can be applied to your specific situation.'}\n\n`;
    
    return content;
  };

  const getSelectedNarrativeContents = () => {
    const result: string[] = [];
    
    narrativeSelections.forEach(selection => {
      const items = getNarrativeItems(selection.type);
      selection.items.forEach(itemId => {
        const item = items.find(i => i.id === itemId);
        if (item) {
          result.push(item.content);
        }
      });
    });
    
    return result;
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
        
        {selectedAuthor && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Author Writing Tone</label>
                <Mic className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              <Select 
                value={selectedAuthorTone} 
                onValueChange={setSelectedAuthorTone}
                disabled={!selectedAuthor || getAuthorTones().length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select tone (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {getAuthorTones().map(tone => (
                    <SelectItem key={tone.id} value={tone.id}>
                      {tone.tone}
                    </SelectItem>
                  ))}
                  {getAuthorTones().length === 0 && (
                    <SelectItem value="no-tones" disabled>
                      No tones available for this author
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Author Experience</label>
                <User className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              <Select 
                value={selectedAuthorExperience} 
                onValueChange={setSelectedAuthorExperience}
                disabled={!selectedAuthor || getAuthorExperiences().length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {getAuthorExperiences().map(exp => (
                    <SelectItem key={exp.id} value={exp.id}>
                      {exp.title}
                    </SelectItem>
                  ))}
                  {getAuthorExperiences().length === 0 && (
                    <SelectItem value="no-experiences" disabled>
                      No experiences available for this author
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="text-sm font-medium">Narrative Anchors</label>
            <List className="ml-2 h-4 w-4 text-gray-400" />
          </div>
          
          {selectedICP ? (
            <>
              <div className="flex flex-wrap gap-2 mb-3">
                {availableAnchors.map(anchor => (
                  <Button
                    key={anchor.value}
                    variant={isAnchorTypeSelected(anchor.value as NarrativeAnchor) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAnchorType(anchor.value as NarrativeAnchor)}
                    className={isAnchorTypeSelected(anchor.value as NarrativeAnchor) ? "bg-story-blue hover:bg-story-light-blue" : ""}
                  >
                    {anchor.label}
                  </Button>
                ))}
              </div>
              
              {narrativeSelections.length > 0 ? (
                <div className="space-y-4">
                  {narrativeSelections.map(selection => (
                    <div key={selection.type} className="border rounded-md p-3 bg-gray-50">
                      <h4 className="font-medium mb-2">{
                        selection.type === 'belief' ? 'Core Beliefs' :
                        selection.type === 'pain' ? 'Internal Pains' :
                        selection.type === 'struggle' ? 'External Struggles' :
                        'Desired Transformations'
                      }</h4>
                      <div className="space-y-2 max-h-[200px] overflow-y-auto">
                        {getNarrativeItems(selection.type).map(item => (
                          <div key={item.id} className="flex items-start gap-2">
                            <Checkbox 
                              id={`item-${item.id}`}
                              checked={isItemSelected(selection.type, item.id)}
                              onCheckedChange={() => toggleItemSelection(selection.type, item.id)}
                            />
                            <label 
                              htmlFor={`item-${item.id}`}
                              className="text-sm cursor-pointer"
                            >
                              {item.content}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-500">
                  Select at least one narrative anchor type
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-4 text-gray-500">
              Select an ICP to see available narrative anchors
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <label className="text-sm font-medium">Success Story (Optional)</label>
            <Star className="ml-2 h-4 w-4 text-gray-400" />
          </div>
          <Select 
            value={selectedSuccessStory} 
            onValueChange={setSelectedSuccessStory}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a success story (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {successStories.map(story => (
                <SelectItem key={story.id} value={story.id}>
                  {story.title}
                </SelectItem>
              ))}
              {successStories.length === 0 && (
                <SelectItem value="no-stories" disabled>
                  No success stories available. Add stories in Assets tab.
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
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
          
          {contentType === 'email' ? (
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Number of Emails</label>
                <MailPlus className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              <Select 
                value={emailCount.toString()} 
                onValueChange={(value) => setEmailCount(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 email</SelectItem>
                  <SelectItem value="2">2 emails</SelectItem>
                  <SelectItem value="3">3 emails</SelectItem>
                  <SelectItem value="4">4 emails</SelectItem>
                  <SelectItem value="5">5 emails</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                <label className="text-sm font-medium">Word Count</label>
                <TextCursor className="ml-2 h-4 w-4 text-gray-400" />
              </div>
              <Select 
                value={wordCount.toString()} 
                onValueChange={(value) => setWordCount(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="150">Short (~150 words)</SelectItem>
                  <SelectItem value="300">Medium (~300 words)</SelectItem>
                  <SelectItem value="500">Long (~500 words)</SelectItem>
                  <SelectItem value="1000">Extra long (~1000 words)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
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
          disabled={isGenerating || !isFormValid()}
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
          <Button 
            className="flex-1 bg-story-blue hover:bg-story-light-blue"
            onClick={() => {
              navigator.clipboard.writeText(generatedContent);
              toast({
                title: "Copied to clipboard",
                description: `${getContentTypeLabel()} content has been copied to your clipboard.`
              });
            }}
          >
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
