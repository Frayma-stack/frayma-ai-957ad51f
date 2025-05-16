
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import ExportOptions from './ExportOptions';
import { Eye, EyeOff, Pencil, Save } from 'lucide-react';
import { ICPStoryScript, StoryBrief, Author, ProductContext } from '@/types/storytelling';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

interface EnhancedStoryPreviewProps {
  selectedBrief: StoryBrief | null;
  scripts: ICPStoryScript[];
  authors?: Author[];
  productContext?: ProductContext | null;
}

const EnhancedStoryPreview: FC<EnhancedStoryPreviewProps> = ({ 
  selectedBrief, 
  scripts,
  authors = [],
  productContext = null
}) => {
  const [content, setContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [isDraftGenerated, setIsDraftGenerated] = useState<boolean>(false);
  const { toast } = useToast();
  const [selectedAuthor, setSelectedAuthor] = useState<string>('');
  const [selectedWritingTone, setSelectedWritingTone] = useState<string>('');
  const [selectedExperience, setSelectedExperience] = useState<string>('');
  const [selectedBelief, setSelectedBelief] = useState<string>('');
  const [showAuthorSelection, setShowAuthorSelection] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  // Get the full ICP script object based on the brief's targetAudience ID
  const getTargetScript = () => {
    if (!selectedBrief) return null;
    return scripts.find(script => script.id === selectedBrief.targetAudience) || null;
  };

  const targetScript = getTargetScript();

  useEffect(() => {
    // When a new brief is selected, reset states
    if (selectedBrief) {
      setIsDraftGenerated(false);
      setShowAuthorSelection(false);
      setSelectedAuthor('');
      setSelectedWritingTone('');
      setSelectedExperience('');
      setSelectedBelief('');
      
      // Generate outline content if outline is complete
      if (selectedBrief.outlineSteps && selectedBrief.outlineSteps.some(step => step.trim() !== '')) {
        setContent(''); // Reset current content
      } else {
        setContent(''); // Reset current content if no outline
      }
    }
  }, [selectedBrief]);

  // Get anchoring element details from the selected elements
  const getAnchoringDetails = () => {
    if (!selectedBrief || !targetScript || !selectedBrief.anchoringElements || selectedBrief.anchoringElements.length === 0) {
      return "the unique challenges in my role";
    }

    // Get details from the first anchoring element for simplicity
    const element = selectedBrief.anchoringElements[0];
    
    let anchoringItem = null;
    switch(element.type) {
      case 'belief': 
        anchoringItem = targetScript.coreBeliefs.find(item => item.id === element.itemId);
        break;
      case 'pain': 
        anchoringItem = targetScript.internalPains.find(item => item.id === element.itemId);
        break;
      case 'struggle': 
        anchoringItem = targetScript.externalStruggles.find(item => item.id === element.itemId);
        break;
      case 'transformation': 
        anchoringItem = targetScript.desiredTransformations.find(item => item.id === element.itemId);
        break;
    }
    
    return anchoringItem ? anchoringItem.content : "the unique challenges in my role";
  };

  const selectedAuthorData = authors.find(author => author.id === selectedAuthor);

  // Generate a full draft based on the outline
  const generateFullDraft = () => {
    if (!selectedBrief || !targetScript) return;
    
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
    
    // Simulate generation process with a delay
    setTimeout(() => {
      setIsDraftGenerated(true);
      setIsGenerating(false);
      setShowAuthorSelection(false);
      
      const audienceName = targetScript.name;
      const anchoringDetail = getAnchoringDetails();
      const targetKeyword = selectedBrief.targetKeyword || 'your main topic';
      const problemStatement = selectedBrief.problemStatements && selectedBrief.problemStatements.length > 0 
        ? selectedBrief.problemStatements[0] 
        : 'common challenges in the industry';
      const successStory = selectedBrief.successStory || 'a compelling case study';
      const callToAction = selectedBrief.callToAction || 'Take the next step today';
      
      // Extract step titles for main points
      const getStepTitle = (step: string) => {
        if (!step) return '';
        // Extract text between [H1], [H2], [H3], etc. and the end of that part
        const match = step.match(/\[(H\d)\](.*?)(?=\[|$)/i);
        return match ? match[2].trim() : step;
      };
      
      // Start with the title and author byline
      let fullDraft = `# ${targetKeyword} for ${audienceName}: How to overcome ${anchoringDetail}`;
      
      // Add author byline if author is selected
      if (selectedAuthorData) {
        fullDraft += `\n\nBy ${selectedAuthorData.name}, ${selectedAuthorData.role} at ${selectedAuthorData.organization}`;
        
        // Add selected writing tone if available
        if (selectedWritingTone) {
          const tone = selectedAuthorData.tones.find(t => t.id === selectedWritingTone);
          if (tone) {
            fullDraft += `\n\n_Written in ${tone.tone} style with ${tone.description}_`;
          }
        }
      }
      
      // Introduction section
      fullDraft += `\n\n## Introduction: Why This Matters

As someone who works directly with ${audienceName}, I understand the challenges you face with ${anchoringDetail}. 
${selectedBrief.purposeStatement || ''}

${selectedBrief.successStory ? `${selectedBrief.successStory}\n\n` : ''}`;

      // Add selected experience if available
      if (selectedAuthorData && selectedExperience) {
        const experience = selectedAuthorData.experiences.find(e => e.id === selectedExperience);
        if (experience) {
          fullDraft += `\nDuring my time as a ${experience.title}, ${experience.description} This perspective has shaped how I approach these challenges.\n\n`;
        }
      }

      // Problem statement section
      fullDraft += `## Why ${audienceName} struggles with ${targetKeyword}

The reality is that ${problemStatement}. This creates significant challenges for professionals like you, including:

* Lost productivity and wasted resources
* Missed opportunities for growth and optimization
* Increasing pressure from stakeholders and competitors

${getStepTitle(selectedBrief.outlineSteps[2] || '')}`;

      // Framework section
      fullDraft += `\n\n## The ${targetKeyword} Framework: A systematic approach

To address these challenges effectively, I've developed a framework specifically for ${audienceName} that directly tackles ${anchoringDetail}:

### Key Components:

1. **Assessment**: Understand where you currently stand
2. **Strategy**: Develop a tailored approach for your specific situation
3. **Implementation**: Put the solutions into practice with minimal disruption

[THIS IS WHERE A DIAGRAM/SCREENSHOT WOULD BE ADDED to visually demonstrate the framework]

${getStepTitle(selectedBrief.outlineSteps[4] || '')}`;

      // Product context section if available
      if (productContext) {
        if (productContext.features.length > 0) {
          fullDraft += `\n\n### Key Features That Make The Difference:`;
          productContext.features.slice(0, 3).forEach((feature, index) => {
            fullDraft += `\n\n${index + 1}. **${feature.name}**: ${feature.benefits.join('; ')}`;
          });
        }
        
        // Add a differentiator if available
        if (productContext.differentiators.length > 0) {
          const differentiator = productContext.differentiators[0];
          fullDraft += `\n\n### What Makes Us Different\n\n${differentiator.name}: ${differentiator.description}`;
          
          if (differentiator.competitorComparison) {
            fullDraft += `\n\nUnlike competitors, ${differentiator.competitorComparison}`;
          }
        }
      }
      
      // Add product belief if selected
      if (selectedAuthorData && selectedBelief) {
        const belief = selectedAuthorData.beliefs.find(b => b.id === selectedBelief);
        if (belief) {
          fullDraft += `\n\n## My Professional Perspective\n\n${belief.belief}. ${belief.description}`;
        }
      }

      // Case study section
      fullDraft += `\n\nAs you review this framework, consider how these solutions might apply to your specific circumstances. We've helped numerous ${audienceName} implement these strategies with remarkable success.

## Case Study: Real Results for ${audienceName}

${successStory}

The results speak for themselves:
* [Specific metric improvement]
* [Specific metric improvement]
* [Specific metric improvement]

### Addressing Common Concerns

You might be wondering:

**"Is this too complex to implement in my organization?"**
Not at all. The framework is designed to be adaptable to organizations of all sizes and complexity levels.

**"How long until we see results?"**
While every situation is different, most of our clients begin seeing measurable improvements within [timeframe].

**"What if we've tried similar approaches before?"**
Our framework differs by [specific differentiator]. Unlike other solutions, we focus on [unique approach].`;

      // Closing section with call to action
      fullDraft += `\n\n## Next Steps: Implementing ${targetKeyword} in Your Organization

Now that you understand the power of this approach, here's how you can get started:

1. Begin with a comprehensive assessment of your current challenges
2. Identify the highest-impact opportunities for improvement
3. Develop an implementation roadmap tailored to your organization

${callToAction}

---

*This article was crafted specifically for ${audienceName} looking to overcome challenges related to ${anchoringDetail}. If you found this valuable, consider sharing it with colleagues who might benefit.*`;

      setContent(fullDraft);
      
      toast({
        title: "Full Draft Generated",
        description: "Complete article draft has been created based on your story brief, outline, and author perspective.",
      });
    }, 1800);
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

  const getPlaceholderText = () => {
    if (!selectedBrief || !targetScript) {
      return "Select a Story Brief to preview your narrative framework...";
    }

    // Create a cohesive narrative based on the brief and ICP script
    return `[Title suggestion: Address ${selectedBrief.targetKeyword || 'Your Main Topic'} for ${targetScript.name}]

As ${targetScript.name}, ${getAnchoringDetails()}.

${selectedBrief.successStory || 'Here I would share a specific story about how this challenge affected me or my organization.'}

PRODUCT-LED STORYTELLING OUTLINE:
${selectedBrief.outlineSteps ? selectedBrief.outlineSteps.map((step, index) => step.trim() !== '' ? `${index + 1}. ${step}` : '').filter(Boolean).join('\n\n') : ''}

${selectedBrief.callToAction ? `Call to Action: ${selectedBrief.callToAction}` : 'I recommend taking action now to address these challenges.'}

[Click "Generate Full Draft" to expand this outline into a complete article]`;
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-story-blue">Your Story Preview</CardTitle>
            <CardDescription>
              {selectedBrief 
                ? `Story brief: ${selectedBrief.title}` 
                : "Select a brief to preview your story framework"}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {!isDraftGenerated && selectedBrief && (
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
              disabled={!selectedBrief}
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleExportToggle}
              disabled={!selectedBrief}
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
            className="min-h-[400px] story-paper p-4 text-gray-700"
          />
        ) : (
          <div className="min-h-[400px] story-paper p-4 text-gray-700 whitespace-pre-wrap">
            {content || getPlaceholderText()}
          </div>
        )}
      </CardContent>
      {showExportOptions && selectedBrief && (
        <CardFooter className="border-t pt-4 pb-2">
          <ExportOptions storyContent={content || getPlaceholderText()} />
        </CardFooter>
      )}
    </Card>
  );
};

export default EnhancedStoryPreview;
