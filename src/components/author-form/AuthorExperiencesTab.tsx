
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AuthorExperience } from '@/types/storytelling';
import { Plus, Trash } from 'lucide-react';

interface AuthorExperiencesTabProps {
  experiences: AuthorExperience[];
  onExperienceChange: (id: string, field: keyof AuthorExperience, value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
}

const AuthorExperiencesTab: FC<AuthorExperiencesTabProps> = ({
  experiences,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience
}) => {
  return (
    <div className="space-y-4 pt-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium">Professional Experiences</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddExperience}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Experience
        </Button>
      </div>
      
      {experiences.map((experience, index) => (
        <div key={experience.id} className="border p-4 rounded-md space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Experience #{index + 1}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveExperience(experience.id)}
              disabled={experiences.length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Input 
              placeholder="Experience title"
              value={experience.title}
              onChange={(e) => onExperienceChange(experience.id, 'title', e.target.value)}
            />
            
            <Textarea 
              placeholder="Experience description"
              value={experience.description}
              onChange={(e) => onExperienceChange(experience.id, 'description', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AuthorExperiencesTab;
