
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StoryDetails } from './StoryForm';
import { useToast } from "@/components/ui/use-toast";
import ExportOptions from './ExportOptions';
import { Eye, EyeOff, Pencil, Save } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Author } from '@/types/storytelling';

interface StoryPreviewProps {
  storyDetails: StoryDetails | null;
  authors?: Author[];
}

const StoryPreview: FC<StoryPreviewProps> = ({ storyDetails, authors = [] }) => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [isDraftGenerated, setIsDraftGenerated] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedWritingTone, setSelectedWritingTone] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedBelief, setSelectedBelief] = useState<string>('');
  const [showAuthorSelection, setShowAuthorSelection] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // When storyDetails change, reset the generation state
    if (storyDetails) {
      setIsDraftGenerated(false);
      setShowAuthorSelection(false);
    }
  }, [storyDetails]);

  const getPlaceholderText = () => {
    if (!storyDetails || !storyDetails.product) {
      return "Your story will appear here once you fill in your product details and click 'Update Story Framework'...";
    }

    return `As someone who ${storyDetails.targetAudience ? `works with ${storyDetails.targetAudience}` : 'has been in this field'}, I've always struggled with ${storyDetails.problem || 'common industry challenges'}.

I remember the frustration of trying different solutions that just didn't quite work. That's when I discovered ${storyDetails.product}.

${storyDetails.keyFeatures.length > 0 
  ? `What impressed me most was how it ${storyDetails.keyFeatures[0] || 'solved my main pain point'}${storyDetails.keyFeatures[1] ? `, ${storyDetails.keyFeatures[1]}` : ''}${storyDetails.keyFeatures[2] ? `, and even ${storyDetails.keyFeatures[2]}` : ''}.` 
  : ''}

${storyDetails.solution 
  ? `The way ${storyDetails.product} ${storyDetails.solution} completely changed my workflow.` 
  : ''}

${storyDetails.uniqueValue 
  ? `What makes ${storyDetails.product} truly special is that ${storyDetails.uniqueValue}.` 
  : ''}

If you've been facing similar challenges, I'd highly recommend giving ${storyDetails.product} a try. It made all the difference for me, and I'm confident it will for you too.

[Click "Generate Full Draft" to expand this framework into a complete article]`;
  };

  const selectedAuthorData = authors.find(author => author.id === selectedAuthor);

  const generateFullDraft = () => {
    if (!storyDetails) return;
    
    if (authors.length > 0 && !showAuthorSelection) {
      setShowAuthorSelection(true);
      return;
    }

    if (authors.length > 0 && !selectedAuthor) {
      toast({
        title: "Author selection required",
        description: "Please select an author to generate the full draft.",
        variant: "destructive"
      });
      return;
    }
    
    setIsGenerating(true);
    
    // Simulate generation process with a short delay
    setTimeout(() => {
      setIsDraftGenerated(true);
      setIsGenerating(false);
      setShowAuthorSelection(false);
      
      // Generate a more detailed draft based on the story details and author info
      let fullDraft = `# How ${storyDetails.product} Transformed My Work as ${storyDetails.targetAudience || 'a Professional'}`;

      // Add author byline if author is selected
      if (selectedAuthorData) {
        fullDraft += `\n\nBy ${selectedAuthorData.name}, ${selectedAuthorData.role} at ${selectedAuthorData.organization}`;
        
        // Add selected writing tone if available
        if (selectedWritingTone) {
          const tone = selectedAuthorData.tones.find(t => t.id === selectedWritingTone);
          if (tone) {
            // Adjust tone in the introduction
            fullDraft += `\n\n_Written in ${tone.tone} style._`;
          }
        }
      }

      fullDraft += `\n\n## The Challenge

As someone who ${storyDetails.targetAudience ? `works with ${storyDetails.targetAudience}` : 'has been in this field'} for years, I've consistently faced one major challenge: ${storyDetails.problem || 'common industry challenges'}. 

This problem wasn't just an annoyance – it had real consequences:
* Wasted time and resources
* Decreased productivity
* Frustration and burnout`;

      // Add selected experience if available
      if (selectedAuthorData && selectedExperience) {
        const experience = selectedAuthorData.experiences.find(e => e.id === selectedExperience);
        if (experience) {
          fullDraft += `\n\nI remember specifically when I was working as a ${experience.title}. ${experience.description} It was at that moment I realized I needed a better solution.`;
        } else {
          fullDraft += `\n\nI remember specifically when [insert specific challenging situation]. It was at that moment I realized I needed a better solution.`;
        }
      } else {
        fullDraft += `\n\nI remember specifically when [insert specific challenging situation]. It was at that moment I realized I needed a better solution.`;
      }

      fullDraft += `\n\n## The Discovery

After trying numerous approaches that fell short, I discovered ${storyDetails.product}. Initially skeptical, I decided to give it a try based on a colleague's recommendation.

## What Made the Difference

${storyDetails.keyFeatures.length > 0 
  ? `What truly impressed me about ${storyDetails.product} was:

1. **${storyDetails.keyFeatures[0] || 'Its main feature'}**: This addressed my primary pain point directly.
${storyDetails.keyFeatures[1] ? `2. **${storyDetails.keyFeatures[1]}**: This additional capability exceeded my expectations.\n` : ''}
${storyDetails.keyFeatures[2] ? `3. **${storyDetails.keyFeatures[2]}**: This was the unexpected bonus that sealed the deal.\n` : ''}` 
  : ''}

${storyDetails.solution 
  ? `## The Solution in Action

The way ${storyDetails.product} ${storyDetails.solution} revolutionized my workflow. Let me explain how it works:

1. First, it [explain first step]
2. Then, it [explain second step]
3. Finally, it [explain third step]

This approach eliminated the problems I'd been struggling with for so long.` 
  : ''}

${storyDetails.uniqueValue 
  ? `## What Makes ${storyDetails.product} Different

In a market full of similar solutions, ${storyDetails.product} stands out because ${storyDetails.uniqueValue}. This unique advantage has made all the difference in my experience.` 
  : ''}`;

      // Add product belief if selected
      if (selectedAuthorData && selectedBelief) {
        const belief = selectedAuthorData.beliefs.find(b => b.id === selectedBelief);
        if (belief) {
          fullDraft += `\n\n## My Professional Perspective\n\n${belief.belief}. ${belief.description}`;
        }
      }

      fullDraft += `\n\n## The Results

Since implementing ${storyDetails.product}, I've experienced:

* [Specific positive outcome]
* [Specific positive outcome]
* [Specific positive outcome]

## Recommendation

If you've been facing ${storyDetails.problem || 'similar challenges'}, I can't recommend ${storyDetails.product} enough. It's not just another tool – it's a complete solution that addresses the unique needs of ${storyDetails.targetAudience || 'professionals like us'}.

Take the first step toward transforming your workflow today. Your future self will thank you.`;

      setContent(fullDraft);
      
      toast({
        title: "Full Draft Generated",
        description: "Complete article draft has been created based on your story details.",
      });
    }, 1500);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      toast({
        title: "Story saved",
        description: "Your narrative has been saved.",
      });
    }
    setIsEditing(!isEditing);
  };

  const handleExportToggle = () => {
    setShowExportOptions(!showExportOptions);
  };

  const getAvailableTones = () => {
    const author = authors.find(a => a.id === selectedAuthor);
    return author?.tones || [];
  };

  const getAvailableExperiences = () => {
    const author = authors.find(a => a.id === selectedAuthor);
    return author?.experiences || [];
  };

  const getAvailableBeliefs = () => {
    const author = authors.find(a => a.id === selectedAuthor);
    return author?.beliefs || [];
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-story-blue">Your Story Preview</CardTitle>
            <CardDescription>Edit or export your narrative</CardDescription>
          </div>
          <div className="flex gap-2">
            {!isDraftGenerated && storyDetails && (
              <Button
                variant="default"
                className="bg-story-blue hover:bg-story-light-blue text-white"
                onClick={generateFullDraft}
                size="sm"
                disabled={isGenerating}
              >
                {isGenerating ? "Generating..." : showAuthorSelection ? "Generate with Author" : "Generate Full Draft"}
              </Button>
            )}
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleEditToggle}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportToggle}
            >
              {showExportOptions ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {showAuthorSelection && authors.length > 0 ? (
          <div className="space-y-4 mb-4 p-4 border rounded-md bg-gray-50">
            <h3 className="font-medium text-story-blue">Personalize Your Content</h3>
            <p className="text-sm text-gray-600 mb-4">Select an author and tone to personalize your content</p>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Author</label>
              <Select value={selectedAuthor} onValueChange={setSelectedAuthor}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an author" />
                </SelectTrigger>
                <SelectContent>
                  {authors.map(author => (
                    <SelectItem key={author.id} value={author.id}>{author.name} - {author.role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {selectedAuthor && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Writing Tone</label>
                  <Select value={selectedWritingTone} onValueChange={setSelectedWritingTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a writing tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableTones().map(tone => (
                        <SelectItem key={tone.id} value={tone.id}>{tone.tone}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Relevant Experience</label>
                  <Select value={selectedExperience} onValueChange={setSelectedExperience}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a relevant experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableExperiences().map(exp => (
                        <SelectItem key={exp.id} value={exp.id}>{exp.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Product Belief</label>
                  <Select value={selectedBelief} onValueChange={setSelectedBelief}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a product belief" />
                    </SelectTrigger>
                    <SelectContent>
                      {getAvailableBeliefs().map(belief => (
                        <SelectItem key={belief.id} value={belief.id}>{belief.belief}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
        ) : isEditing ? (
          <Textarea 
            value={content || getPlaceholderText()}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[300px] story-paper p-4 text-gray-700"
          />
        ) : (
          <div className="min-h-[300px] story-paper p-4 text-gray-700 whitespace-pre-wrap">
            {content || getPlaceholderText()}
          </div>
        )}
      </CardContent>
      {showExportOptions && (
        <CardFooter className="border-t pt-4 pb-2">
          <ExportOptions storyContent={content || getPlaceholderText()} />
        </CardFooter>
      )}
    </Card>
  );
};

export default StoryPreview;
