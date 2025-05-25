
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductDifferentiator } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface DifferentiatorsSectionProps {
  differentiators: ProductDifferentiator[];
  onDifferentiatorsChange: (differentiators: ProductDifferentiator[]) => void;
}

const DifferentiatorsSection: FC<DifferentiatorsSectionProps> = ({
  differentiators,
  onDifferentiatorsChange
}) => {
  const addDifferentiator = () => {
    onDifferentiatorsChange([...differentiators, { id: crypto.randomUUID(), name: '', description: '', competitorComparison: '' }]);
  };

  const removeDifferentiator = (index: number) => {
    onDifferentiatorsChange(differentiators.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index: number, field: string, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    onDifferentiatorsChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Differentiators</h4>
        <Button type="button" onClick={addDifferentiator} variant="outline" size="sm">
          <Plus className="h-3 w-3 mr-1" />
          Add Differentiator
        </Button>
      </div>

      {differentiators.map((diff, index) => (
        <div key={diff.id} className="border rounded p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Input
                value={diff.name}
                onChange={(e) => updateDifferentiator(index, 'name', e.target.value)}
                placeholder="Differentiator name"
                className="text-sm"
              />
              <Textarea
                value={diff.description}
                onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                placeholder="Description of what makes them unique"
                rows={2}
                className="text-sm"
              />
              <Textarea
                value={diff.competitorComparison}
                onChange={(e) => updateDifferentiator(index, 'competitorComparison', e.target.value)}
                placeholder="How this compares to their closest competitors"
                rows={2}
                className="text-sm"
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeDifferentiator(index)}
              className="ml-2 h-8 w-8"
            >
              <Trash className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DifferentiatorsSection;
