
import { useState } from 'react';
import { GeneratedIdea, IdeasSortOrder, IdeaScore } from '@/types/ideas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, SortDesc, Trash2, Edit } from 'lucide-react';
import { ICPStoryScript } from '@/types/storytelling';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface SavedIdeasProps {
  ideas: GeneratedIdea[];
  scripts: ICPStoryScript[];
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  onAddManualIdea: (idea: GeneratedIdea) => void;
}

const SCORE_OPTIONS: IdeaScore[] = [
  { value: 0, label: '0 - Not useful' },
  { value: 1, label: '1 - Somewhat useful' },
  { value: 2, label: '2 - Very useful' },
  { value: 3, label: '3 - Exceptional' },
];

const SavedIdeas = ({
  ideas,
  scripts,
  onIdeaUpdated,
  onIdeaDeleted,
  onAddManualIdea
}: SavedIdeasProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<IdeasSortOrder>('score-desc');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newIdea, setNewIdea] = useState<Partial<GeneratedIdea>>({
    title: '',
    narrative: '',
    productTieIn: '',
    cta: '',
    icpId: '',
    narrativeAnchor: 'belief',
    narrativeItemId: '',
    productFeatures: [],
    score: SCORE_OPTIONS[2], // Default to score of 2
  });

  // Sort and filter ideas
  const sortedAndFilteredIdeas = [...ideas]
    .filter(idea => 
      idea.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.narrative.toLowerCase().includes(searchTerm.toLowerCase()) ||
      idea.productTieIn.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'score-desc') {
        return (b.score?.value || 0) - (a.score?.value || 0);
      } else if (sortOrder === 'date-desc') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
    });

  const handleScoreChange = (ideaId: string, scoreValue: string) => {
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      const score = SCORE_OPTIONS.find(s => s.value === Number(scoreValue));
      onIdeaUpdated({ ...idea, score: score || null });
      toast.success(`Idea score updated to ${score?.label || 'unrated'}`);
    }
  };

  const handleAddManualIdea = () => {
    if (!newIdea.title || !newIdea.narrative || !newIdea.productTieIn || !newIdea.cta) {
      toast.error('Please fill in all required fields');
      return;
    }

    const idea: GeneratedIdea = {
      id: uuidv4(),
      title: newIdea.title,
      narrative: newIdea.narrative,
      productTieIn: newIdea.productTieIn,
      cta: newIdea.cta,
      createdAt: new Date().toISOString(),
      score: newIdea.score || null,
      source: {
        type: 'manual',
        content: 'Manually added'
      },
      icpId: newIdea.icpId || '',
      narrativeAnchor: newIdea.narrativeAnchor || 'belief',
      narrativeItemId: newIdea.narrativeItemId || '',
      productFeatures: newIdea.productFeatures || [],
      perspective: newIdea.perspective,
    };

    onAddManualIdea(idea);
    setNewIdea({
      title: '',
      narrative: '',
      productTieIn: '',
      cta: '',
      icpId: '',
      narrativeAnchor: 'belief',
      narrativeItemId: '',
      productFeatures: [],
      score: SCORE_OPTIONS[2],
    });
    setIsAddDialogOpen(false);
    toast.success('New idea added successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search ideas..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as IdeasSortOrder)}
          >
            <SelectTrigger className="w-[180px]">
              <SortDesc className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="score-desc">Highest Score First</SelectItem>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Idea
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Idea</DialogTitle>
                <DialogDescription>
                  Manually add a new idea to your ideas bank
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="title" className="text-sm font-medium">
                    Title
                  </label>
                  <Input 
                    id="title" 
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({...newIdea, title: e.target.value})}
                    placeholder="Enter a compelling title for your idea"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="narrative" className="text-sm font-medium">
                    Narrative
                  </label>
                  <Textarea 
                    id="narrative"
                    value={newIdea.narrative}
                    onChange={(e) => setNewIdea({...newIdea, narrative: e.target.value})}
                    placeholder="Describe your narrative"
                    rows={4}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="productTieIn" className="text-sm font-medium">
                    Product Tie-In
                  </label>
                  <Textarea 
                    id="productTieIn"
                    value={newIdea.productTieIn}
                    onChange={(e) => setNewIdea({...newIdea, productTieIn: e.target.value})}
                    placeholder="How does this idea tie in with your product?"
                    rows={3}
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="cta" className="text-sm font-medium">
                    Call to Action
                  </label>
                  <Input 
                    id="cta" 
                    value={newIdea.cta}
                    onChange={(e) => setNewIdea({...newIdea, cta: e.target.value})}
                    placeholder="What action should readers take?"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="icp" className="text-sm font-medium">
                    Target ICP (Optional)
                  </label>
                  <Select
                    value={newIdea.icpId}
                    onValueChange={(value) => setNewIdea({...newIdea, icpId: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an ICP" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">None</SelectItem>
                      {scripts.map((script) => (
                        <SelectItem key={script.id} value={script.id}>
                          {script.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  <label htmlFor="score" className="text-sm font-medium">
                    Score
                  </label>
                  <Select
                    value={newIdea.score?.value.toString()}
                    onValueChange={(value) => {
                      const score = SCORE_OPTIONS.find(s => s.value === Number(value));
                      setNewIdea({...newIdea, score: score || null});
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Rate this idea" />
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
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddManualIdea}>
                  Save Idea
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {sortedAndFilteredIdeas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No ideas found. Try adding some ideas or adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredIdeas.map((idea) => (
            <Card key={idea.id} className="h-full flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{idea.title}</CardTitle>
                  <Select
                    value={idea.score?.value.toString() || ''}
                    onValueChange={(value) => handleScoreChange(idea.id, value)}
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Rate" />
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
                <CardDescription>
                  {new Date(idea.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <h4 className="font-medium text-sm mb-1">Narrative:</h4>
                <p className="text-sm mb-3">{idea.narrative}</p>
                
                <h4 className="font-medium text-sm mb-1">Product Tie-In:</h4>
                <p className="text-sm mb-3">{idea.productTieIn}</p>
                
                <h4 className="font-medium text-sm mb-1">Call to Action:</h4>
                <p className="text-sm">{idea.cta}</p>
                
                {idea.icpId && (
                  <div className="mt-3">
                    <Badge variant="outline" className="mr-2">
                      ICP: {scripts.find(s => s.id === idea.icpId)?.name || 'Unknown'}
                    </Badge>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t pt-3 flex justify-end">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mr-2"
                  onClick={() => {
                    // Edit idea functionality would be added here
                    toast.info("Edit feature coming soon");
                  }}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => {
                    onIdeaDeleted(idea.id);
                    toast.success("Idea deleted successfully");
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedIdeas;
