import { FC, useState } from 'react';
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

  // For simplicity, we'll use a temporary state for anchoring element type and detail
  const [anchoringType, setAnchoringType] = useState<'belief' | 'pain' | 'struggle' | 'transformation'>('belief');
  const [anchoringItemId, setAnchoringItemId] = useState('');

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

        <Tabs defaultValue="strategic" className="w-full">
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
            <p className="text-sm text-gray-600 mb-4">
              Create a 9-step outline to guide the narrative flow of your article, incorporating elements from the previous sections.
            </p>
            
            {brief.outlineSteps.map((step, index) => (
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
