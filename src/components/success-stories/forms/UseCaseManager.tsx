
import { FC, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

interface LocalUseCase {
  id: string;
  name: string;
  description: string;
  beneficiaryDescription?: string;
}

interface UseCaseManagerProps {
  useCases: LocalUseCase[];
  onAddUseCase: (useCase: Omit<LocalUseCase, 'id'>) => void;
  onRemoveUseCase: (id: string) => void;
}

const UseCaseManager: FC<UseCaseManagerProps> = ({
  useCases,
  onAddUseCase,
  onRemoveUseCase,
}) => {
  const [newUseCase, setNewUseCase] = useState({ 
    name: '', 
    description: '',
    beneficiaryDescription: ''
  });

  const handleAddUseCase = () => {
    if (newUseCase.name && newUseCase.description) {
      onAddUseCase(newUseCase);
      setNewUseCase({ name: '', description: '', beneficiaryDescription: '' });
    }
  };

  return (
    <div className="space-y-4">
      <Label className="text-base font-medium">Use Cases Unlocked</Label>
      
      {useCases.length > 0 && (
        <div className="space-y-3">
          {useCases.map((useCase) => (
            <Card key={useCase.id} className="border border-gray-200">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-sm font-semibold">{useCase.name}</CardTitle>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onRemoveUseCase(useCase.id)}
                    className="h-8 w-8 p-0 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0 space-y-2">
                <p className="text-sm text-gray-600">{useCase.description}</p>
                {useCase.beneficiaryDescription && (
                  <div className="bg-green-50 p-2 rounded-md">
                    <p className="text-xs font-medium text-green-800 mb-1">Who/What Team It Helped:</p>
                    <p className="text-sm text-green-700">{useCase.beneficiaryDescription}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="border-dashed border-2 border-gray-300">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="usecase-name">Use Case Name *</Label>
              <Input
                id="usecase-name"
                type="text"
                placeholder="e.g., Cross-team Collaboration"
                value={newUseCase.name}
                onChange={(e) => setNewUseCase({ ...newUseCase, name: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="usecase-description">Use Case Description *</Label>
              <Textarea
                id="usecase-description"
                placeholder="What business use case was unlocked?"
                value={newUseCase.description}
                onChange={(e) => setNewUseCase({ ...newUseCase, description: e.target.value })}
                className="resize-none"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="usecase-beneficiary">Who/What Team Did This Help?</Label>
              <Textarea
                id="usecase-beneficiary"
                placeholder="Describe which teams, departments, or stakeholders benefited from this use case"
                value={newUseCase.beneficiaryDescription}
                onChange={(e) => setNewUseCase({ ...newUseCase, beneficiaryDescription: e.target.value })}
                className="resize-none"
                rows={3}
              />
            </div>
            
            <Button 
              size="sm" 
              onClick={handleAddUseCase}
              disabled={!newUseCase.name || !newUseCase.description}
              className="w-full"
            >
              Add Use Case
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UseCaseManager;
