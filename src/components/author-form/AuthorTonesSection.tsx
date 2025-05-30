
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AuthorToneItem } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface AuthorTonesSectionProps {
  tones: AuthorToneItem[];
  onToneChange: (id: string, field: keyof AuthorToneItem, value: string) => void;
  onAddTone: () => void;
  onRemoveTone: (id: string) => void;
}

const AuthorTonesSection: FC<AuthorTonesSectionProps> = ({
  tones,
  onToneChange,
  onAddTone,
  onRemoveTone
}) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-story-blue">Writing Tone</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddTone}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Tone
        </Button>
      </div>
      
      <p className="text-sm text-gray-600">
        Define the author's writing style (e.g., candid, opinionated, data-driven, etc.)
      </p>
      
      {tones.map((tone, index) => (
        <div key={tone.id} className="border p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Tone #{index + 1}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveTone(tone.id)}
              disabled={tones.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input 
              placeholder="Tone (e.g., Candid, Data-driven, Opinionated)"
              value={tone.tone}
              onChange={(e) => onToneChange(tone.id, 'tone', e.target.value)}
            />
            
            <Textarea 
              placeholder="Description of this tone and when to use it"
              value={tone.description}
              onChange={(e) => onToneChange(tone.id, 'description', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthorTonesSection;
