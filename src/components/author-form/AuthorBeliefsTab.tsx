
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AuthorBelief } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface AuthorBeliefsTabProps {
  beliefs: AuthorBelief[];
  onBeliefChange: (id: string, field: keyof AuthorBelief, value: string) => void;
  onAddBelief: () => void;
  onRemoveBelief: (id: string) => void;
}

const AuthorBeliefsTab: FC<AuthorBeliefsTabProps> = ({
  beliefs,
  onBeliefChange,
  onAddBelief,
  onRemoveBelief
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Product Beliefs & Takes</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddBelief}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Belief
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Add the author's strong opinions or unique insights about the product, industry, or problem space
      </p>
      
      {beliefs.map((belief, index) => (
        <div key={belief.id} className="border p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Belief #{index + 1}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveBelief(belief.id)}
              disabled={beliefs.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input 
              placeholder="Core belief or opinion"
              value={belief.belief}
              onChange={(e) => onBeliefChange(belief.id, 'belief', e.target.value)}
            />
            
            <Textarea 
              placeholder="Explanation of this belief"
              value={belief.description}
              onChange={(e) => onBeliefChange(belief.id, 'description', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthorBeliefsTab;
