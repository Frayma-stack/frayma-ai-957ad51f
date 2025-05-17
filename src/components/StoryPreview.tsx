
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StoryDetails } from './StoryForm';
import { useToast } from "@/components/ui/use-toast";
import ExportOptions from './ExportOptions';
import { Eye, EyeOff, Pencil, Save, Loader } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Author, StoryBrief } from '@/types/storytelling';

interface StoryPreviewProps {
  storyDetails: StoryDetails | null;
  authors?: Author[];
  contentType?: 'customer_success' | 'thought_leadership';
}

const StoryPreview: FC<StoryPreviewProps> = ({ 
  storyDetails, 
  authors = [],
  contentType = 'thought_leadership'
}) => {
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
  const [contentOutlineGenerated, setContentOutlineGenerated] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // When storyDetails change, reset the generation state
    if (storyDetails) {
      setIsDraftGenerated(false);
      setShowAuthorSelection(false);
      setContentOutlineGenerated(false);
    }
  }, [storyDetails]);

  const getPlaceholderText = () => {
    if (!storyDetails || !storyDetails.product) {
      return "Your story will appear here once you fill in your product details and click 'Update Story Framework'...";
    }

    if (contentType === 'customer_success') {
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

[Click "Generate Content Outline" to create the 9-step Product-Led Storytelling outline]`;
    } else {
      // Thought leadership placeholder
      return `In today's rapidly evolving ${storyDetails.targetAudience ? `${storyDetails.targetAudience} industry` : 'market'}, professionals face unprecedented challenges with ${storyDetails.problem || 'adapting to change'}.

This article explores how innovative solutions like ${storyDetails.product} are transforming the landscape by addressing these critical pain points.

${storyDetails.keyFeatures.length > 0 
  ? `We'll examine key innovations such as ${storyDetails.keyFeatures[0] || 'core functionality'}${storyDetails.keyFeatures[1] ? `, ${storyDetails.keyFeatures[1]}` : ''}${storyDetails.keyFeatures[2] ? `, and ${storyDetails.keyFeatures[2]}` : ''}.` 
  : ''}

${storyDetails.uniqueValue 
  ? `The article will highlight how ${storyDetails.uniqueValue} represents a fundamental shift in thinking about these challenges.` 
  : ''}

By the end, readers will understand the strategic implications and competitive advantages that come from embracing this new approach.

[Click "Generate Content Outline" to create the thought leadership article outline]`;
    }
  };

  const selectedAuthorData = authors.find(author => author.id === selectedAuthor);

  const generateContentOutline = () => {
    if (!storyDetails) return;
    
    setIsGenerating(true);
    
    // Simulate generation process with a short delay
    setTimeout(() => {
      setIsGenerating(false);
      setContentOutlineGenerated(true);
      
      // Generate different content outlines based on the content type
      let outlineContent = '';
      
      if (contentType === 'customer_success') {
        outlineContent = `# Content Outline for ${storyDetails.product} Customer Success Story

## 1. Frame the Challenge
[H1] The Critical Challenge: ${storyDetails.problem || 'Industry pain point'}
- Describe how ${storyDetails.targetAudience || 'professionals'} struggle with this problem
- Share specific examples from real customer experience

## 2. Establish Context
[H2] The Customer's Situation
- Background information on the customer (industry, size, challenges)
- Previous approaches they tried and why they failed

## 3. Transition to the Solution
[H3] Finding ${storyDetails.product}
- How the customer discovered your solution
- Initial expectations and concerns

## 4. Solution Implementation
[H2] The ${storyDetails.product} Implementation
${storyDetails.keyFeatures.length > 0 
  ? `- Key Feature Used: ${storyDetails.keyFeatures[0] || 'Main feature'}\n` +
    `${storyDetails.keyFeatures[1] ? `- Key Feature Used: ${storyDetails.keyFeatures[1]}\n` : ''}` +
    `${storyDetails.keyFeatures[2] ? `- Key Feature Used: ${storyDetails.keyFeatures[2]}\n` : ''}`
  : '- Key features implemented'}
- Customization and setup process

## 5. Demonstration of Results
[H3] Tangible Outcomes
- Specific metrics and improvements
- Before and after comparison

## 6. Overcoming Challenges
[H2] Addressing Implementation Hurdles
- Specific challenges faced during adoption
- How these were overcome with your support

## 7. ROI & Business Impact
[H3] Return on Investment
- Financial impact of implementing the solution
- Other business benefits realized

## 8. Future Plans
[H2] Looking Ahead
- How the customer plans to expand usage
- Future integration opportunities

## 9. Customer Testimonial
[H3] In Their Words
- Direct quote from customer
- Final recommendation to others

[Click "Generate Full Draft" to convert this outline into a complete customer success story]`;
      } else {
        // Thought leadership outline
        outlineContent = `# Content Outline for ${storyDetails.product} Thought Leadership Article

## 1. Frame the Industry Challenge
[H1] The Evolving Landscape: ${storyDetails.problem || 'Industry transformation'}
- Current state of the ${storyDetails.targetAudience || 'industry'}
- Emerging trends and disruptions

## 2. Establish Strategic Context
[H2] Market Forces at Play
- External pressures driving change
- Historical approaches and their limitations

## 3. Introduce New Perspective
[H3] Rethinking ${storyDetails.product}'s Category
- Paradigm shift in how to approach the problem
- Why conventional thinking falls short

## 4. Solution Framework
[H2] The ${storyDetails.product} Approach
${storyDetails.keyFeatures.length > 0 
  ? `- Strategic Innovation: ${storyDetails.keyFeatures[0] || 'Main innovation'}\n` +
    `${storyDetails.keyFeatures[1] ? `- Strategic Innovation: ${storyDetails.keyFeatures[1]}\n` : ''}` +
    `${storyDetails.keyFeatures[2] ? `- Strategic Innovation: ${storyDetails.keyFeatures[2]}\n` : ''}`
  : '- Key strategic innovations'}

## 5. Data-Backed Insights
[H3] Market Validation
- Research and data supporting this approach
- Case studies without directly selling

## 6. Industry Implications
[H2] ${storyDetails.uniqueValue ? storyDetails.uniqueValue : 'Competitive Advantage'}
- How this approach transforms business outcomes
- Broader industry implications

## 7. Implementation Considerations
[H3] Adopting the New Paradigm
- Key factors for successful implementation
- Common obstacles and how to overcome them

## 8. Future Outlook
[H2] The Road Ahead
- How this trend will evolve
- Preparing for the next wave of innovation

## 9. Strategic Call to Action
[H3] Positioning for Success
- Actionable recommendations
- Resources for further exploration

[Click "Generate Full Draft" to convert this outline into a complete thought leadership article]`;
      }

      setContent(outlineContent);
      
      toast({
        title: "Content Outline Generated",
        description: "Review and edit the outline, then generate the full draft.",
      });
    }, 1500);
  };

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
      
      // Generate different drafts based on the content type
      let fullDraft = '';
      
      if (contentType === 'customer_success') {
        fullDraft = `# How ${storyDetails.product} Transformed Results for ${storyDetails.targetAudience || 'Our Customer'}`;

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

        fullDraft += `\n\n## The Critical Challenge: ${storyDetails.problem || 'Industry pain point'}

Our customer, a leading ${storyDetails.targetAudience || 'company'}, faced significant challenges with ${storyDetails.problem || 'common industry challenges'}. 

These challenges were causing real business impact:
* Lost revenue opportunities
* Inefficient processes
* Competitive disadvantage`;

        // Add selected experience if available
        if (selectedAuthorData && selectedExperience) {
          const experience = selectedAuthorData.experiences.find(e => e.id === selectedExperience);
          if (experience) {
            fullDraft += `\n\nAs someone who has worked as a ${experience.title}, I've seen this challenge repeatedly. ${experience.description} This gave me unique insight into our customer's situation.`;
          }
        }

        fullDraft += `\n\n## The Customer's Situation

Before discovering ${storyDetails.product}, our customer had tried various approaches:

* Traditional solutions that were expensive and complex
* Custom-built tools that proved difficult to maintain
* Third-party services that didn't integrate well with their existing systems

None of these approaches delivered the results they needed, creating frustration and wasted resources.

## Finding ${storyDetails.product}

After researching alternatives, the customer discovered ${storyDetails.product} through [acquisition channel]. Initially skeptical due to past disappointments, they decided to evaluate the solution based on our clear understanding of their specific challenges.

## The ${storyDetails.product} Implementation

${storyDetails.keyFeatures.length > 0 
  ? `The customer implemented these key capabilities of ${storyDetails.product}:

1. **${storyDetails.keyFeatures[0] || 'Primary feature'}**: This addressed their most critical pain point.
${storyDetails.keyFeatures[1] ? `2. **${storyDetails.keyFeatures[1]}**: This provided additional workflow improvements.\n` : ''}
${storyDetails.keyFeatures[2] ? `3. **${storyDetails.keyFeatures[2]}**: This delivered unexpected benefits.\n` : ''}` 
  : ''}

${storyDetails.solution 
  ? `The implementation process focused on ${storyDetails.solution}, which ensured smooth adoption across the organization.` 
  : 'The implementation process was straightforward and took just [timeframe] with support from our customer success team.'}

## Tangible Outcomes

After implementing ${storyDetails.product}, the customer experienced:

* [Specific metric improvement]
* [Specific metric improvement]
* [Specific metric improvement]

## Addressing Implementation Hurdles

Like any meaningful change, there were challenges during implementation:

1. [Specific challenge]
2. [Specific challenge]

Our team worked closely with the customer to overcome these by [specific solution approach].

## Return on Investment

${storyDetails.uniqueValue 
  ? `The customer achieved significant ROI through ${storyDetails.uniqueValue}, specifically:` 
  : 'The customer achieved significant ROI, specifically:'}

* [Financial impact]
* [Time savings]
* [Strategic advantage]

## Looking Ahead

Based on these successful results, the customer is now:

* Expanding usage to additional teams/departments
* Exploring advanced features
* Planning integration with other systems

## In Their Words

> "${storyDetails.product} has been transformative for our business. [Customer quote]"
>
> — [Customer Name], [Customer Title]

If your organization is facing similar challenges with ${storyDetails.problem || 'this industry pain point'}, we'd welcome a conversation about how ${storyDetails.product} might help.`;

      } else {
        // Thought leadership article
        fullDraft = `# The Future of ${storyDetails.targetAudience || 'Industry'}: How ${storyDetails.product} is Redefining ${storyDetails.problem || 'the Landscape'}`;

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

        fullDraft += `\n\n## The Evolving Landscape: ${storyDetails.problem || 'Industry transformation'}

The ${storyDetails.targetAudience || 'industry'} landscape is undergoing profound transformation. Organizations face unprecedented challenges with ${storyDetails.problem || 'adapting to change'}, forcing leaders to rethink fundamental assumptions.

Three key trends are accelerating this shift:
* Digital transformation pressures
* Changing customer expectations
* Increasing competitive intensity`;

        // Add selected experience if available
        if (selectedAuthorData && selectedExperience) {
          const experience = selectedAuthorData.experiences.find(e => e.id === selectedExperience);
          if (experience) {
            fullDraft += `\n\nDuring my time as a ${experience.title}, I witnessed this evolution firsthand. ${experience.description} This perspective shapes my understanding of where the industry is headed.`;
          } else {
            fullDraft += `\n\nHaving worked in this space for years, I've witnessed this evolution firsthand, which shapes my understanding of where the industry is headed.`;
          }
        } else {
          fullDraft += `\n\nHaving worked in this space for years, I've witnessed this evolution firsthand, which shapes my understanding of where the industry is headed.`;
        }

        fullDraft += `\n\n## Market Forces at Play

Historical approaches to ${storyDetails.problem || 'this challenge'} have typically involved:

* Incremental improvements to existing systems
* Linear thinking about process optimization
* Siloed approaches that create fragmentation

These conventional methods are proving inadequate in today's complex environment.

## Rethinking ${storyDetails.product}'s Category

${storyDetails.product} represents not just a technology evolution but a fundamental paradigm shift. Rather than merely improving existing processes, it reimagines the very nature of ${storyDetails.problem || 'the challenge'}.

## The ${storyDetails.product} Approach

${storyDetails.keyFeatures.length > 0 
  ? `This new approach is built on several strategic innovations:

1. **${storyDetails.keyFeatures[0] || 'Primary innovation'}**: This fundamentally changes how organizations address the core challenge.
${storyDetails.keyFeatures[1] ? `2. **${storyDetails.keyFeatures[1]}**: This creates new strategic possibilities.\n` : ''}
${storyDetails.keyFeatures[2] ? `3. **${storyDetails.keyFeatures[2]}**: This delivers compounding advantages over time.\n` : ''}` 
  : ''}

## Market Validation

Research validates this approach:

* [Research finding]
* [Research finding]
* [Research finding]

Early adopters across industries are demonstrating that this isn't theoretical—it's happening now.

## ${storyDetails.uniqueValue ? storyDetails.uniqueValue : 'Competitive Advantage'}

${storyDetails.uniqueValue 
  ? `Organizations that embrace ${storyDetails.uniqueValue} are seeing profound advantages:` 
  : `Organizations that embrace this new approach are seeing profound advantages:`}

* Strategic differentiation in crowded markets
* Improved agility to respond to market shifts
* Enhanced ability to attract and retain top talent

## Adopting the New Paradigm

Successfully implementing this approach requires:

1. Leadership alignment around a new mental model
2. Organizational readiness for transformation
3. Strategic sequencing of implementation steps

Common obstacles include legacy thinking, organizational inertia, and misaligned incentives.`;

        // Add product belief if selected
        if (selectedAuthorData && selectedBelief) {
          const belief = selectedAuthorData.beliefs.find(b => b.id === selectedBelief);
          if (belief) {
            fullDraft += `\n\n## A Strategic Perspective\n\n${belief.belief}. ${belief.description} This perspective is essential when considering how to position your organization for future success.`;
          }
        }

        fullDraft += `\n\n## The Road Ahead

Looking forward, we anticipate:

* Accelerated adoption of these approaches across industries
* Emergence of new capabilities built on this foundation
* Increasing differentiation between leaders and laggards

Organizations that delay action risk falling irreparably behind.

## Positioning for Success

To prepare your organization:

1. Assess your current capabilities against this new paradigm
2. Develop a strategic roadmap for transformation
3. Identify quick wins to build momentum while planning for long-term change

The future belongs to organizations that recognize this shift and act decisively.`;
      }

      setContent(fullDraft);
      
      toast({
        title: "Full Draft Generated",
        description: `Complete ${contentType === 'customer_success' ? 'customer success story' : 'thought leadership article'} has been created.`,
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
            <CardTitle className="text-story-blue">
              {contentType === 'customer_success' ? 'Customer Success Story' : 'Thought Leadership Article'}
            </CardTitle>
            <CardDescription>Edit or export your narrative</CardDescription>
          </div>
          <div className="flex gap-2">
            {!contentOutlineGenerated && storyDetails && (
              <Button
                variant="default"
                className="bg-story-blue hover:bg-story-light-blue text-white"
                onClick={generateContentOutline}
                size="sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : "Generate Content Outline"}
              </Button>
            )}
            {contentOutlineGenerated && !isDraftGenerated && storyDetails && (
              <Button
                variant="default"
                className="bg-story-blue hover:bg-story-light-blue text-white"
                onClick={generateFullDraft}
                size="sm"
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : showAuthorSelection ? "Generate with Author" : "Generate Full Draft"}
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
