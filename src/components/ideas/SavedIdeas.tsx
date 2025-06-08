
import { useState } from 'react';
import { GeneratedIdea, IdeasSortOrder, IdeaScore } from '@/types/ideas';
import { ICPStoryScript } from '@/types/storytelling';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import SavedIdeasHeader from './SavedIdeasHeader';
import SavedIdeaCard from './SavedIdeaCard';
import AddIdeaDialog from './AddIdeaDialog';

interface SavedIdeasProps {
  ideas: GeneratedIdea[];
  scripts: ICPStoryScript[];
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  onAddManualIdea: () => void;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
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
  onAddManualIdea,
  onContentTypeSelect
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
    score: SCORE_OPTIONS[2],
  });

  console.log('💾 SavedIdeas render:', { 
    ideasCount: ideas.length, 
    searchTerm, 
    sortOrder 
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
    if (!scoreValue || scoreValue === '__no_score__') return;
    
    const idea = ideas.find(i => i.id === ideaId);
    if (idea) {
      const score = SCORE_OPTIONS.find(s => s.value === Number(scoreValue));
      onIdeaUpdated({ ...idea, score: score || null });
      toast.success(`Idea score updated to ${score?.label || 'unrated'}`);
    }
  };

  const handleSaveManualIdea = () => {
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

    // This would typically call a parent handler to add the idea
    // For now, we'll show the success message and close the dialog
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

  const handleAddManualIdeaClick = () => {
    console.log('💾 SavedIdeas: Add manual idea clicked, switching to generate tab');
    onAddManualIdea();
  };

  return (
    <div className="space-y-6">
      <SavedIdeasHeader
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        onSearchChange={setSearchTerm}
        onSortOrderChange={setSortOrder}
        onAddManualIdea={handleAddManualIdeaClick}
      />
      
      {sortedAndFilteredIdeas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No ideas found. Try adding some ideas or adjusting your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedAndFilteredIdeas.map((idea) => (
            <SavedIdeaCard
              key={idea.id}
              idea={idea}
              scripts={scripts}
              scoreOptions={SCORE_OPTIONS}
              onScoreChange={handleScoreChange}
              onEdit={() => toast.info("Edit feature coming soon")}
              onDelete={() => {
                onIdeaDeleted(idea.id);
                toast.success("Idea deleted successfully");
              }}
              onContentTypeSelect={onContentTypeSelect}
            />
          ))}
        </div>
      )}

      <AddIdeaDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        newIdea={newIdea}
        scripts={scripts}
        scoreOptions={SCORE_OPTIONS}
        onIdeaChange={setNewIdea}
        onSave={handleSaveManualIdea}
      />
    </div>
  );
};

export default SavedIdeas;
