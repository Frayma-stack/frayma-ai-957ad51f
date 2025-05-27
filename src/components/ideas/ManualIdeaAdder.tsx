
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save } from 'lucide-react';
import { ICPStoryScript } from '@/types/storytelling';
import { GeneratedIdea, IdeaScore } from '@/types/ideas';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface ManualIdeaAdderProps {
  icpScripts: ICPStoryScript[];
  onIdeaAdded: (idea: GeneratedIdea) => void;
  selectedClientId?: string;
}

const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: '0 - Not useful' },
  { value: 1, label: '1 - Somewhat useful' },
  { value: 2, label: '2 - Very useful' },
  { value: 3, label: '3 - Exceptional' },
];

const ManualIdeaAdder: FC<ManualIdeaAdderProps> = ({
  icpScripts,
  onIdeaAdded,
  selectedClientId
}) => {
  const [formData, setFormData] = useState({
    title: '',
    narrative: '',
    productTieIn: '',
    cta: '',
    icpId: '',
    score: SCORE_OPTIONS[2] // Default to score of 2
  });

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title.trim() || !formData.narrative.trim()) {
      toast.error('Please provide at least a title and narrative for the idea');
      return;
    }

    const newIdea: GeneratedIdea = {
      id: uuidv4(),
      title: formData.title,
      narrative: formData.narrative,
      productTieIn: formData.productTieIn,
      cta: formData.cta,
      createdAt: new Date().toISOString(),
      score: formData.score,
      source: {
        type: 'manual',
        content: 'Manually added idea'
      },
      icpId: formData.icpId,
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: [],
      clientId: selectedClientId
    };

    onIdeaAdded(newIdea);
    
    // Reset form
    setFormData({
      title: '',
      narrative: '',
      productTieIn: '',
      cta: '',
      icpId: '',
      score: SCORE_OPTIONS[2]
    });

    toast.success('Idea added successfully!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-story-blue flex items-center space-x-2">
          <Plus className="h-5 w-5" />
          <span>Add Manual Idea</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter a compelling title for your idea"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="narrative">Narrative *</Label>
          <Textarea
            id="narrative"
            placeholder="Describe the core narrative or story behind this idea"
            value={formData.narrative}
            onChange={(e) => handleInputChange('narrative', e.target.value)}
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="productTieIn">Product Tie-In</Label>
          <Textarea
            id="productTieIn"
            placeholder="How does this idea connect to your product or service?"
            value={formData.productTieIn}
            onChange={(e) => handleInputChange('productTieIn', e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="cta">Call to Action</Label>
          <Input
            id="cta"
            placeholder="What action should readers take after engaging with this idea?"
            value={formData.cta}
            onChange={(e) => handleInputChange('cta', e.target.value)}
            className="mt-1"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="icp">Target ICP (Optional)</Label>
            <Select value={formData.icpId} onValueChange={(value) => handleInputChange('icpId', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select target ICP" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None specified</SelectItem>
                {icpScripts.map((script) => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="score">Initial Score</Label>
            <Select 
              value={formData.score.value.toString()} 
              onValueChange={(value) => {
                const score = SCORE_OPTIONS.find(s => s.value === Number(value));
                handleInputChange('score', score || SCORE_OPTIONS[2]);
              }}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
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
        </div>

        <Button onClick={handleSubmit} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          Save Idea
        </Button>
      </CardContent>
    </Card>
  );
};

export default ManualIdeaAdder;
