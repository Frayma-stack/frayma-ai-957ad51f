import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ICPStoryScript, StoryBrief } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface StoryBriefFormProps {
  onSave: (brief: StoryBrief) => void;
  availableScripts: ICPStoryScript[];
  initialBrief?: StoryBrief;
}

const StoryBriefForm: FC<StoryBriefFormProps> = ({ onSave, availableScripts, initialBrief }) => {
  const { toast } = useToast();
  const [brief, setBrief] = useState<StoryBrief>(
    initialBrief || {
      id: crypto.randomUUID(),
      title: '',
      contentType: 'thought_leadership', // Adding the required contentType property with a default value
      
      // Strategic Alignment
      goal: '',
      targetKeyword: '',
      purposeStatement: '',
      businessObjectives: '',
      callToAction: '',
      
      // Target Reader Resonance
      targetAudience: '',
      journeyStage: '',
      broaderAudience: '',
      readingMotivation: '',
      anchoringElements: [],
      successStory: '',
      
      // Content Discovery Triggers
      relatedKeywords: [''],
      searchQueries: [''],
      problemStatements: [''],
      
      // Content Outline
      outlineSteps: ['', '', '', '', '', '', '', '', ''] // 9-step outline
    }
  );
  const [activeTab, setActiveTab] = useState("strategic");
  const [isOutlineGenerated, setIsOutlineGenerated] = useState(false);
  const [isDraftApproved, setIsDraftApproved] = useState(false);

  // For simplicity, we'll use a temporary state for anchoring element type and detail
  const [anchoringType, setAnchoringType] = useState<'belief' | 'pain' | 'struggle' | 'transformation'>('belief');
  const [anchoringItemId, setAnchoringItemId] = useState('');

  // Monitor tab changes to potentially generate outline
  useEffect(() => {
    // Check if we're moving to the outline tab for the first time
    if (activeTab === 'outline') {
      // Check if outline steps are empty and other sections have data
      const hasStrategicData = brief.goal && brief.targetKeyword;
      const hasReaderData = brief.targetAudience && brief.anchoringElements.length > 0;
      const hasDiscoveryData = brief.problemStatements.some(ps => ps.trim() !== '');
      
      // Check if outline is empty
      const outlineIsEmpty = brief.outlineSteps.every(step => step.trim() === '') || !isOutlineGenerated;
      
      if (outlineIsEmpty && hasStrategicData && hasReaderData && hasDiscoveryData) {
        generateProductLedOutline();
        setIsOutlineGenerated(true);
      }
    }
  }, [activeTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleInputChange = (field: keyof StoryBrief, value: string | string[]) => {
    setBrief(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayItemChange = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements' | 'outlineSteps', index: number, value: string) => {
    const newArray = [...brief[field]];
    newArray[index] = value;
    
    setBrief(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayItem = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements') => {
    setBrief(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'relatedKeywords' | 'searchQueries' | 'problemStatements', index: number) => {
    const newArray = [...brief[field]];
    newArray.splice(index, 1);
    
    setBrief(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const updateAnchoringElements = () => {
    if (anchoringType && anchoringItemId) {
      setBrief(prev => ({
        ...prev,
        anchoringElements: [
          ...prev.anchoringElements,
          { type: anchoringType, itemId: anchoringItemId }
        ]
      }));
      // Reset after adding
      setAnchoringItemId('');
    }
  };

  const removeAnchoringElement = (index: number) => {
    setBrief(prev => ({
      ...prev,
      anchoringElements: prev.anchoringElements.filter((_, i) => i !== index)
    }));
  };
  
  // Generate a 9-step Product-Led Storytelling outline following the 3Rs Formula
  const generateProductLedOutline = () => {
    // Get the selected ICP script
    const selectedScript = availableScripts.find(script => script.id === brief.targetAudience);
    if (!selectedScript) return;
    
    // Get anchoring content for reference
    const getAnchoringContent = () => {
      if (brief.anchoringElements.length === 0) return "";
      
      const element = brief.anchoringElements[0];
      let content = "";
      
      if (element.type === 'belief') {
        const item = selectedScript.coreBeliefs.find(i => i.id === element.itemId);
        content = item?.content || '';
      } else if (element.type === 'pain') {
        const item = selectedScript.internalPains.find(i => i.id === element.itemId);
        content = item?.content || '';
      } else if (element.type === 'struggle') {
        const item = selectedScript.externalStruggles.find(i => i.id === element.itemId);
        content = item?.content || '';
      } else if (element.type === 'transformation') {
        const item = selectedScript.desiredTransformations.find(i => i.id === element.itemId);
        content = item?.content || '';
      }
      
      return content;
    };
    
    // Get problem statement for reference
    const problemStatement = brief.problemStatements.find(ps => ps.trim() !== '') || "";
    const targetKeyword = brief.targetKeyword || "your target topic";
    const mainGoal = brief.goal || "solving this problem";
    const anchoringContent = getAnchoringContent() || problemStatement;
    const audienceName = selectedScript.name;
    const callToAction = brief.callToAction || "Take the next step today";
    
    // Create the 9-step outline following the 3Rs Formula structure
    const newOutline = [
      // 3Rs: RESONANCE - Attract & Filter the right reader
      // Step 1: Attract - Headline/Hook based on the problem statement (H1)
      `[H1] ATTRACT & FILTER (Resonance): "${targetKeyword} for ${audienceName}": How to overcome ${anchoringContent} and achieve ${mainGoal}`,
      
      // Step 2: Filter - Introduction that resonates with the specific audience
      `[Intro] FILTER (Resonance): Establish relevance for ${audienceName} - highlight why ${anchoringContent} is a significant challenge that deserves attention right now`,
      
      // Step 3: Filter - Set up the problem and transition to the first main point
      `[H2] FILTER (Resonance): Why ${audienceName} struggles with ${targetKeyword} - The hidden costs and consequences of ${anchoringContent}`,
      
      // 3Rs: RELEVANCE - Engage & Show how to solve the problem
      // Step 4: Engage - Main query/problem addressed with evidence
      `[H2] ENGAGE (Relevance): The ${targetKeyword} Framework: A systematic approach to solving ${anchoringContent} for ${audienceName}`,
      
      // Step 5: Show - Supporting details with visual evidence (H3s)
      `[H3] SHOW (Relevance): Key components of the framework with [PLACEHOLDER FOR SCREENSHOT/DIAGRAM] showing how this directly addresses ${problemStatement}`,
      
      // Step 6: First subtle CTA within the content
      `[Soft CTA] SHOW (Relevance): Consider how these solutions apply to your specific situation. [OPTIONAL LINK: Learn more about our approach to ${targetKeyword}]`,
      
      // 3Rs: RESULTS - Persuade & Convert to action
      // Step 7: Persuade - Address objections with success story
      `[H2] PERSUADE (Results): Case Study: How ${audienceName} overcame ${anchoringContent} using this approach - ${brief.successStory || "[Success story placeholder]"}`,
      
      // Step 8: Convert - Additional supporting evidence and objection handling
      `[H3] CONVERT (Results): Addressing common concerns about implementing ${mainGoal} - How to overcome [specific objection] with minimal disruption`,
      
      // Step 9: Final CTA
      `[H2] CONVERT (Results): Next Steps: How to implement ${mainGoal} in your organization - ${callToAction}`
    ];
    
    // Update the brief with the new outline
    setBrief(prev => ({
      ...prev,
      outlineSteps: newOutline
    }));
    
    toast({
      title: "3Rs Outline Generated",
      description: "A Product-Led Storytelling outline following the 3Rs Formula has been created based on your inputs."
    });
  };

  // Generate first draft based on approved outline
  const generateFirstDraft = () => {
    // This would be a much more complex function in a real implementation
    // For now, we'll just show a toast message
    setIsDraftApproved(true);
    
    toast({
      title: "First Draft Generated",
      description: "Your first draft based on the approved outline is now available in the Story Preview.",
      duration: 5000
    });
  };

  const handleSubmit = () => {
    // Basic validation
    if (!brief.title || !brief.targetAudience) {
      toast({
        title: "Missing information",
        description: "Please provide a title and select a target audience.",
        variant: "destructive"
      });
      return;
    }

    // Clean up empty array items
    const cleanedBrief = {
      ...brief,
      relatedKeywords: brief.relatedKeywords.filter(k => k.trim() !== ''),
      searchQueries: brief.searchQueries.filter(q => q.trim() !== ''),
      problemStatements: brief.problemStatements.filter(p => p.trim() !== '')
    };

    onSave(cleanedBrief);
    toast({
      title: "Story Brief saved",
      description: `"${brief.title}" has been saved successfully.`
    });
  };

  // Get the selected ICP script
  const selectedScript = availableScripts.find(script => script.id === brief.targetAudience);

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">Story Brief & Outline</CardTitle>
        <CardDescription>Create a structured framework for your story</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          <label className="text-sm font-medium">Brief Title*</label>
          <Input 
            placeholder="Give this brief a descriptive title"
            value={brief.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
          />
        </div>
        
        <div className="space-y-4 mb-4">
          <label className="text-sm font-medium">Content Type*</label>
          <Select 
            value={brief.contentType} 
            onValueChange={(value: 'customer_success' | 'thought_leadership') => handleInputChange('contentType', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select content type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="customer_success">Customer Success Story</SelectItem>
              <SelectItem value="thought_leadership">Thought Leadership</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="strategic">Strategic Alignment</TabsTrigger>
            <TabsTrigger value="reader">Reader Resonance</TabsTrigger>
            <TabsTrigger value="discovery">Discovery Triggers</TabsTrigger>
            <TabsTrigger value="outline">Content Outline</TabsTrigger>
          </TabsList>
          
          {/* Strategic Alignment Tab */}
          <TabsContent value="strategic" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Content Goal</label>
              <Textarea 
                placeholder="What is the goal for this content piece?"
                value={brief.goal}
                onChange={(e) => handleInputChange('goal', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Keyword/Query</label>
              <Input 
                placeholder="What is the primary keyword or search query?"
                value={brief.targetKeyword}
                onChange={(e) => handleInputChange('targetKeyword', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Purpose Statement</label>
              <Textarea 
                placeholder="Why should this content exist?"
                value={brief.purposeStatement}
                onChange={(e) => handleInputChange('purposeStatement', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Business Objectives</label>
              <Textarea 
                placeholder="How does this support business objectives?"
                value={brief.businessObjectives}
                onChange={(e) => handleInputChange('businessObjectives', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Call to Action</label>
              <Input 
                placeholder="What action should readers take?"
                value={brief.callToAction}
                onChange={(e) => handleInputChange('callToAction', e.target.value)}
              />
            </div>
          </TabsContent>
          
          {/* Target Reader Resonance Tab */}
          <TabsContent value="reader" className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Target Audience (ICP)*</label>
              <Select 
                value={brief.targetAudience} 
                onValueChange={(value) => handleInputChange('targetAudience', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an ICP StoryScript" />
                </SelectTrigger>
                <SelectContent>
                  {availableScripts.map(script => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Journey Stage</label>
              <Input 
                placeholder="Which stage of the buyer's journey?"
                value={brief.journeyStage}
                onChange={(e) => handleInputChange('journeyStage', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Broader Audience</label>
              <Input 
                placeholder="Who else might read this content?"
                value={brief.broaderAudience}
                onChange={(e) => handleInputChange('broaderAudience', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Reading Motivation</label>
              <Textarea 
                placeholder="Why will they read this content?"
                value={brief.readingMotivation}
                onChange={(e) => handleInputChange('readingMotivation', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Anchoring Elements</label>
              {selectedScript && (
                <div className="space-y-4 border p-4 rounded-md bg-gray-50">
                  <div className="flex gap-2">
                    <Select
                      value={anchoringType}
                      onValueChange={(value: 'belief' | 'pain' | 'struggle' | 'transformation') => setAnchoringType(value)}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select element type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="belief">Core Belief</SelectItem>
                        <SelectItem value="pain">Internal Pain</SelectItem>
                        <SelectItem value="struggle">External Struggle</SelectItem>
                        <SelectItem value="transformation">Desired Transformation</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button 
                      onClick={updateAnchoringElements} 
                      disabled={!anchoringItemId}
                      className="bg-story-blue hover:bg-story-light-blue"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <Select
                    value={anchoringItemId}
                    onValueChange={setAnchoringItemId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Select a ${anchoringType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {anchoringType === 'belief' && selectedScript.coreBeliefs.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.content}
                        </SelectItem>
                      ))}
                      {anchoringType === 'pain' && selectedScript.internalPains.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.content}
                        </SelectItem>
                      ))}
                      {anchoringType === 'struggle' && selectedScript.externalStruggles.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.content}
                        </SelectItem>
                      ))}
                      {anchoringType === 'transformation' && selectedScript.desiredTransformations.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.content}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* List of selected anchoring elements */}
              {brief.anchoringElements.length > 0 && (
                <div className="mt-4 space-y-2">
                  <h4 className="text-sm font-medium">Selected Elements:</h4>
                  <div className="space-y-2">
                    {brief.anchoringElements.map((element, index) => {
                      // Find the corresponding item from the selected script
                      let content = '';
                      if (selectedScript) {
                        if (element.type === 'belief') {
                          const item = selectedScript.coreBeliefs.find(i => i.id === element.itemId);
                          content = item?.content || '';
                        } else if (element.type === 'pain') {
                          const item = selectedScript.internalPains.find(i => i.id === element.itemId);
                          content = item?.content || '';
                        } else if (element.type === 'struggle') {
                          const item = selectedScript.externalStruggles.find(i => i.id === element.itemId);
                          content = item?.content || '';
                        } else if (element.type === 'transformation') {
                          const item = selectedScript.desiredTransformations.find(i => i.id === element.itemId);
                          content = item?.content || '';
                        }
                      }
                      
                      return (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded">
                          <div>
                            <span className="text-xs font-semibold capitalize">{element.type}: </span>
                            <span className="text-sm">{content}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeAnchoringElement(index)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Success Story</label>
              <Textarea 
                placeholder="Share a success story that answers 'Why now, why you?'"
                value={brief.successStory}
                onChange={(e) => handleInputChange('successStory', e.target.value)}
                rows={3}
              />
            </div>
          </TabsContent>
          
          {/* Content Discovery Triggers Tab */}
          <TabsContent value="discovery" className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Related Keywords</label>
              {brief.relatedKeywords.map((keyword, index) => (
                <div key={`keyword-${index}`} className="flex gap-2 mb-2">
                  <Input 
                    placeholder={`Related keyword ${index + 1}`}
                    value={keyword}
                    onChange={(e) => handleArrayItemChange('relatedKeywords', index, e.target.value)}
                    className="flex-1"
                  />
                  {index > 0 && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeArrayItem('relatedKeywords', index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addArrayItem('relatedKeywords')}
              >
                Add Keyword
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Queries</label>
              {brief.searchQueries.map((query, index) => (
                <div key={`query-${index}`} className="flex gap-2 mb-2">
                  <Input 
                    placeholder={`Search query ${index + 1}`}
                    value={query}
                    onChange={(e) => handleArrayItemChange('searchQueries', index, e.target.value)}
                    className="flex-1"
                  />
                  {index > 0 && (
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => removeArrayItem('searchQueries', index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addArrayItem('searchQueries')}
              >
                Add Query
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Problem Statements</label>
              {brief.problemStatements.map((statement, index) => (
                <div key={`statement-${index}`} className="flex gap-2 mb-2">
                  <Textarea 
                    placeholder={`Problem statement ${index + 1}`}
                    value={statement}
                    onChange={(e) => handleArrayItemChange('problemStatements', index, e.target.value)}
                    className="flex-1"
                    rows={2}
                  />
                  {index > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => removeArrayItem('problemStatements', index)}
                    >
                      -
                    </Button>
                  )}
                </div>
              ))}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => addArrayItem('problemStatements')}
              >
                Add Problem Statement
              </Button>
            </div>
          </TabsContent>
          
          {/* Content Outline Tab */}
          <TabsContent value="outline" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <h3 className="font-medium text-story-blue">3Rs Formula Content Outline</h3>
                <p className="text-sm text-gray-600">
                  9-step outline structured around the 3Rs: Resonance (steps 1-3), Relevance (steps 4-6), and Results (steps 7-9).
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <Button 
                  onClick={generateProductLedOutline}
                  variant="outline"
                  size="sm"
                  className="text-story-blue border-story-blue hover:bg-story-blue/10"
                >
                  Regenerate Outline
                </Button>
                {isOutlineGenerated && !isDraftApproved && (
                  <Button 
                    onClick={generateFirstDraft}
                    variant="default"
                    size="sm"
                    className="bg-story-blue hover:bg-story-light-blue"
                  >
                    Generate First Draft
                  </Button>
                )}
              </div>
            </div>
            
            <div className="space-y-4 border p-3 rounded-md bg-gray-50 mb-4">
              <h4 className="text-sm font-medium">3Rs: RESONANCE - Attract & Filter the right reader</h4>
              <div className="space-y-3 pl-2">
                {brief.outlineSteps.slice(0, 3).map((step, index) => (
                  <div key={`outline-${index}`} className="space-y-1">
                    <label className="text-sm font-medium">Step {index + 1}</label>
                    <Textarea 
                      placeholder={`Outline step ${index + 1}`}
                      value={step}
                      onChange={(e) => handleArrayItemChange('outlineSteps', index, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 border p-3 rounded-md bg-gray-50 mb-4">
              <h4 className="text-sm font-medium">3Rs: RELEVANCE - Engage & Show how to solve the problem</h4>
              <div className="space-y-3 pl-2">
                {brief.outlineSteps.slice(3, 6).map((step, index) => (
                  <div key={`outline-${index + 3}`} className="space-y-1">
                    <label className="text-sm font-medium">Step {index + 4}</label>
                    <Textarea 
                      placeholder={`Outline step ${index + 4}`}
                      value={step}
                      onChange={(e) => handleArrayItemChange('outlineSteps', index + 3, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4 border p-3 rounded-md bg-gray-50">
              <h4 className="text-sm font-medium">3Rs: RESULTS - Persuade & Convert to action</h4>
              <div className="space-y-3 pl-2">
                {brief.outlineSteps.slice(6, 9).map((step, index) => (
                  <div key={`outline-${index + 6}`} className="space-y-1">
                    <label className="text-sm font-medium">Step {index + 7}</label>
                    <Textarea 
                      placeholder={`Outline step ${index + 7}`}
                      value={step}
                      onChange={(e) => handleArrayItemChange('outlineSteps', index + 6, e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <Button 
          className="mt-6 w-full bg-story-blue hover:bg-story-light-blue"
          onClick={handleSubmit}
        >
          Save Story Brief & Outline
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoryBriefForm;
