
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePerplexity } from '@/contexts/PerplexityContext';
import { ICPStoryScript, ICPStoryScriptItem } from '@/types/storytelling';
import { toast } from 'sonner';
import { FileText, Link2, Loader2, Plus, Save, Upload } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';

interface GenerateIdeasProps {
  scripts: ICPStoryScript[];
  productContext: any;
  onIdeaSaved: (idea: GeneratedIdea) => void;
}

const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: '0 - Not useful' },
  { value: 1, label: '1 - Somewhat useful' },
  { value: 2, label: '2 - Very useful' },
  { value: 3, label: '3 - Exceptional' },
];

interface IdeaCandidate {
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  score: IdeaScore | null;
}

const GenerateIdeas = ({
  scripts,
  productContext,
  onIdeaSaved
}: GenerateIdeasProps) => {
  const { apiKey, isConfigured } = usePerplexity();
  const [inputType, setInputType] = useState<'text' | 'file' | 'url'>('text');
  const [inputContent, setInputContent] = useState('');
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [selectedIcpId, setSelectedIcpId] = useState('');
  const [narrativeAnchor, setNarrativeAnchor] = useState<'belief' | 'pain' | 'struggle' | 'transformation'>('belief');
  const [narrativeItemId, setNarrativeItemId] = useState('');
  const [productFeatures, setProductFeatures] = useState<string[]>([]);
  const [perspective, setPerspective] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedIdeas, setGeneratedIdeas] = useState<IdeaCandidate[]>([]);
  
  const selectedIcp = scripts.find(script => script.id === selectedIcpId);
  
  const getAnchorItems = () => {
    if (!selectedIcp) return [];
    
    switch (narrativeAnchor) {
      case 'belief':
        return selectedIcp.coreBeliefs;
      case 'pain':
        return selectedIcp.internalPains;
      case 'struggle':
        return selectedIcp.externalStruggles;
      case 'transformation':
        return selectedIcp.desiredTransformations;
      default:
        return [];
    }
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      toast.success(`File "${file.name}" loaded successfully`);
    };
    reader.onerror = () => {
      toast.error('Error reading file');
    };
    reader.readAsText(file);
  };
  
  const fetchUrlContent = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }
    
    try {
      toast.info('Fetching content from URL...');
      // In a real implementation, this would use a proxy or backend service
      // to fetch the content from the URL. For this demo, we'll simulate it.
      // setInputContent(`Content from ${url}`);
      toast.error('URL content fetching is not implemented in this demo. Please copy and paste the content instead.');
    } catch (error) {
      toast.error('Error fetching URL content');
    }
  };
  
  const generateIdeas = async () => {
    if (!isConfigured) {
      toast.error('Please configure your Perplexity API key first');
      return;
    }
    
    // Validate inputs
    const content = inputType === 'text' ? inputContent : 
                    inputType === 'file' ? fileContent : 
                    url;
                    
    if (!content) {
      toast.error(`Please provide ${inputType === 'text' ? 'text' : inputType === 'file' ? 'a file' : 'a URL'}`);
      return;
    }
    
    if (!selectedIcpId) {
      toast.error('Please select a target ICP');
      return;
    }
    
    if (!narrativeItemId) {
      toast.error('Please select a narrative item');
      return;
    }
    
    if (productFeatures.length === 0) {
      toast.error('Please select at least one product feature/benefit/use case');
      return;
    }
    
    const selectedItem = getAnchorItems().find(item => item.id === narrativeItemId);
    if (!selectedItem) {
      toast.error('Selected narrative item not found');
      return;
    }
    
    setIsGenerating(true);
    setGeneratedIdeas([]);
    
    try {
      const promptTemplate = `
Using information from ${inputType === 'text' ? 'the text' : inputType === 'file' ? 'the file' : 'the URL'} above, generate 15 new ideas for crafting resonant, compelling GTM narrative pieces and/or social posts, using the Product-Led Storytelling approach that's focused on subtly weaving a product into resonant, compelling pieces without coming off as salesy. Don't generate generic ideas. Each idea must speak to ${selectedIcp?.name} and address their ${narrativeAnchor}, which is to ${selectedItem.content}. The ideas generated should also subtly sell ${productFeatures.join(', ')}. ${perspective ? `The point of view and unique perspective I have for each generated idea is ${perspective}` : ''}

For each generated idea, provide a:
Title
Narrative
Product tie-in
Compelling CTA.
      `;
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a product marketing expert who specializes in helping B2B companies create compelling marketing ideas that resonate with their target audience.'
            },
            {
              role: 'user',
              content: `${content}\n\n${promptTemplate}`
            }
          ],
          temperature: 0.7,
          max_tokens: 4000,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      const ideas = parseIdeasFromResponse(data.choices[0].message.content);
      setGeneratedIdeas(ideas);
      
      toast.success(`Generated ${ideas.length} ideas successfully`);
    } catch (error) {
      console.error('Error generating ideas:', error);
      toast.error('Failed to generate ideas. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  const parseIdeasFromResponse = (text: string): IdeaCandidate[] => {
    // For demonstration purposes, this is a simplified parser
    // In a real implementation, this would be more robust
    const ideas: IdeaCandidate[] = [];
    
    // Mock implementation for demo purposes
    for (let i = 1; i <= 5; i++) {
      ideas.push({
        title: `Sample Idea ${i}`,
        narrative: `This is a narrative for idea ${i} that would resonate with ${selectedIcp?.name}. It addresses their ${narrativeAnchor} and provides value.`,
        productTieIn: `Our product helps with this by providing ${productFeatures[0]} which directly addresses this pain point.`,
        cta: `Learn how our solution can transform your ${selectedIcp?.name}'s experience today.`,
        score: null
      });
    }
    
    return ideas;
  };
  
  const handleScoreChange = (index: number, scoreValue: string) => {
    const numericValue = parseInt(scoreValue);
    const score = SCORE_OPTIONS.find(s => s.value === numericValue);
    
    const updatedIdeas = [...generatedIdeas];
    updatedIdeas[index] = {
      ...updatedIdeas[index],
      score: score || null
    };
    
    setGeneratedIdeas(updatedIdeas);
  };
  
  const saveIdea = (idea: IdeaCandidate) => {
    if (!idea.score) {
      toast.error('Please score the idea before saving');
      return;
    }
    
    const savedIdea: GeneratedIdea = {
      id: uuidv4(),
      title: idea.title,
      narrative: idea.narrative,
      productTieIn: idea.productTieIn,
      cta: idea.cta,
      createdAt: new Date().toISOString(),
      score: idea.score,
      source: {
        type: inputType,
        content: inputType === 'text' ? inputContent : 
                inputType === 'file' ? (fileContent || '') : url
      },
      icpId: selectedIcpId,
      narrativeAnchor,
      narrativeItemId,
      productFeatures,
      perspective: perspective || undefined
    };
    
    onIdeaSaved(savedIdea);
    toast.success('Idea saved successfully');
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Input Source</CardTitle>
            <CardDescription>
              Provide text, upload a file, or enter a URL
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={inputType} onValueChange={(value) => setInputType(value as 'text' | 'file' | 'url')}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="text">
                  <FileText className="h-4 w-4 mr-2" />
                  Text
                </TabsTrigger>
                <TabsTrigger value="file">
                  <Upload className="h-4 w-4 mr-2" />
                  File
                </TabsTrigger>
                <TabsTrigger value="url">
                  <Link2 className="h-4 w-4 mr-2" />
                  URL
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="text" className="pt-4">
                <Textarea 
                  placeholder="Type or paste your text here..."
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  rows={8}
                />
              </TabsContent>
              
              <TabsContent value="file" className="pt-4">
                <div className="border border-dashed rounded-md p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="mb-2 text-sm text-gray-600">Upload a text file</p>
                  <input
                    type="file"
                    accept=".txt,.md,.doc,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                  />
                  <label htmlFor="file-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Choose File
                    </Button>
                  </label>
                  {fileContent && (
                    <p className="mt-2 text-sm text-green-600">File loaded successfully</p>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="url" className="pt-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter URL..."
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                  <Button onClick={fetchUrlContent}>Fetch</Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>2. Target Audience & Product</CardTitle>
            <CardDescription>
              Select ICP, narrative anchor, and product features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Select ICP</label>
              <Select 
                value={selectedIcpId} 
                onValueChange={setSelectedIcpId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose an ICP" />
                </SelectTrigger>
                <SelectContent>
                  {scripts.map((script) => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Narrative Anchor</label>
              <Select 
                value={narrativeAnchor} 
                onValueChange={(value) => {
                  setNarrativeAnchor(value as 'belief' | 'pain' | 'struggle' | 'transformation');
                  setNarrativeItemId(''); // Reset selection when anchor changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select anchor type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="belief">Core Belief</SelectItem>
                  <SelectItem value="pain">Internal Pain</SelectItem>
                  <SelectItem value="struggle">External Struggle</SelectItem>
                  <SelectItem value="transformation">Desired Transformation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Narrative Item</label>
              <Select 
                value={narrativeItemId} 
                onValueChange={setNarrativeItemId}
                disabled={!selectedIcpId || getAnchorItems().length === 0}
              >
                <SelectTrigger>
                  <SelectValue placeholder={
                    !selectedIcpId ? "Select an ICP first" : 
                    getAnchorItems().length === 0 ? `No ${narrativeAnchor}s available` :
                    "Select an item"
                  } />
                </SelectTrigger>
                <SelectContent>
                  {getAnchorItems().map((item: ICPStoryScriptItem) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.content}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Product Features/Benefits (Select at least one)</label>
              <Select 
                value="placeholder"
                onValueChange={(value) => {
                  if (value === "placeholder") return;
                  if (!productFeatures.includes(value)) {
                    setProductFeatures([...productFeatures, value]);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Add product features" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder" disabled>Select features to add</SelectItem>
                  {productContext?.features?.map((feature: any) => (
                    <SelectItem key={feature.id} value={feature.name}>
                      {feature.name}
                    </SelectItem>
                  ))}
                  {productContext?.useCases?.map((useCase: any) => (
                    <SelectItem key={useCase.id} value={useCase.useCase}>
                      {useCase.useCase}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-2 flex flex-wrap gap-2">
                {productFeatures.map((feature, index) => (
                  <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center">
                    {feature}
                    <button 
                      className="ml-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setProductFeatures(productFeatures.filter((_, i) => i !== index))}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">Your Perspective (Optional)</label>
              <Textarea 
                placeholder="Add your unique point of view or guidance..."
                value={perspective}
                onChange={(e) => setPerspective(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={generateIdeas} 
              disabled={isGenerating || !isConfigured}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating Ideas...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Generate Ideas
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      {generatedIdeas.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Generated Ideas</h2>
          <p className="mb-4 text-gray-600">Score and save the ideas you like.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {generatedIdeas.map((idea, index) => (
              <Card key={index} className="h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{idea.title}</CardTitle>
                    <Select
                      value={idea.score?.value.toString() || ''}
                      onValueChange={(value) => handleScoreChange(index, value)}
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Score" />
                      </SelectTrigger>
                      <SelectContent>
                        {SCORE_OPTIONS.map((score) => (
                          <SelectItem key={score.value} value={score.value.toString()}>
                            {score.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <h4 className="font-medium text-sm mb-1">Narrative:</h4>
                  <p className="text-sm mb-3">{idea.narrative}</p>
                  
                  <h4 className="font-medium text-sm mb-1">Product Tie-In:</h4>
                  <p className="text-sm mb-3">{idea.productTieIn}</p>
                  
                  <h4 className="font-medium text-sm mb-1">Call to Action:</h4>
                  <p className="text-sm">{idea.cta}</p>
                </CardContent>
                <CardFooter className="border-t pt-3">
                  <Button 
                    className="w-full"
                    onClick={() => saveIdea(idea)}
                    disabled={!idea.score}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {idea.score ? 'Save Idea' : 'Score to Save'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateIdeas;
