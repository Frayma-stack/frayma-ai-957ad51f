
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProductUseCase } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface UseCasesSectionProps {
  useCases: ProductUseCase[];
  onUseCasesChange: (useCases: ProductUseCase[]) => void;
}

const UseCasesSection: FC<UseCasesSectionProps> = ({
  useCases,
  onUseCasesChange
}) => {
  const addUseCase = () => {
    onUseCasesChange([...useCases, { id: crypto.randomUUID(), useCase: '', userRole: '', description: '', media: [] }]);
  };

  const removeUseCase = (index: number) => {
    onUseCasesChange(useCases.filter((_, i) => i !== index));
  };

  const updateUseCase = (index: number, field: string, value: string) => {
    const updated = [...useCases];
    updated[index] = { ...updated[index], [field]: value };
    onUseCasesChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Use Cases</h4>
        <Button type="button" onClick={addUseCase} variant="outline" size="sm">
          <Plus className="h-3 w-3 mr-1" />
          Add Use Case
        </Button>
      </div>

      {useCases.map((useCase, index) => (
        <div key={useCase.id} className="border rounded p-3 space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <Input
                value={useCase.useCase}
                onChange={(e) => updateUseCase(index, 'useCase', e.target.value)}
                placeholder="Use case title"
                className="text-sm"
              />
              <Input
                value={useCase.userRole}
                onChange={(e) => updateUseCase(index, 'userRole', e.target.value)}
                placeholder="Target user role/persona"
                className="text-sm"
              />
              <Textarea
                value={useCase.description}
                onChange={(e) => updateUseCase(index, 'description', e.target.value)}
                placeholder="Description of how the company solves this problem"
                rows={2}
                className="text-sm"
              />
            </div>
            
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeUseCase(index)}
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

export default UseCasesSection;
