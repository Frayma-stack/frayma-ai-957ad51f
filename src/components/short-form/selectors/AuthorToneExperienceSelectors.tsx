
import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Author } from '@/types/storytelling';

interface AuthorToneExperienceSelectorsProps {
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedAuthorBelief?: string;
  authors: Author[];
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
  onAuthorBeliefChange?: (value: string) => void;
}

const AuthorToneExperienceSelectors: FC<AuthorToneExperienceSelectorsProps> = ({
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedAuthorBelief,
  authors,
  onAuthorToneChange,
  onAuthorExperienceChange,
  onAuthorBeliefChange
}) => {
  const getSelectedAuthor = () => {
    const found = authors.find(author => author.id === selectedAuthor);
    console.log('🎨 getSelectedAuthor in ToneExperienceSelectors:', {
      selectedAuthor,
      found: found ? { id: found.id, name: found.name } : null,
      totalAuthors: authors.length
    });
    return found;
  };

  const selectedAuthorObj = getSelectedAuthor();

  // Only show these selectors if an author is selected
  if (!selectedAuthor || !selectedAuthorObj) {
    console.log('🎨 No author selected, hiding tone/experience selectors');
    return null;
  }

  // Get valid data from selected author
  const validTones = selectedAuthorObj?.tones?.filter(tone => 
    tone && tone.id && tone.id.trim() !== '' && tone.tone && tone.tone.trim() !== ''
  ) || [];
  
  const validExperiences = selectedAuthorObj?.experiences?.filter(exp => 
    exp && exp.id && exp.id.trim() !== '' && exp.title && exp.title.trim() !== ''
  ) || [];
  
  const validBeliefs = selectedAuthorObj?.beliefs?.filter(belief => 
    belief && belief.id && belief.id.trim() !== '' && belief.belief && belief.belief.trim() !== ''
  ) || [];

  console.log('🎨 Author sub-data validation in ToneExperienceSelectors:', {
    selectedAuthorObj: selectedAuthorObj ? { id: selectedAuthorObj.id, name: selectedAuthorObj.name } : null,
    validTonesCount: validTones.length,
    validExperiencesCount: validExperiences.length,
    validBeliefsCount: validBeliefs.length,
    rawTones: selectedAuthorObj?.tones?.length || 0,
    rawExperiences: selectedAuthorObj?.experiences?.length || 0,
    rawBeliefs: selectedAuthorObj?.beliefs?.length || 0
  });

  // Handle value changes to convert special "none" value back to empty string
  const handleToneChange = (value: string) => {
    onAuthorToneChange(value === "__none__" ? "" : value);
  };

  const handleExperienceChange = (value: string) => {
    onAuthorExperienceChange(value === "__none__" ? "" : value);
  };

  const handleBeliefChange = (value: string) => {
    if (onAuthorBeliefChange) {
      onAuthorBeliefChange(value === "__none__" ? "" : value);
    }
  };

  // Convert empty strings to special "__none__" value for display (non-empty string)
  const getToneDisplayValue = () => {
    return selectedAuthorTone === "" ? "__none__" : selectedAuthorTone;
  };

  const getExperienceDisplayValue = () => {
    return selectedAuthorExperience === "" ? "__none__" : selectedAuthorExperience;
  };

  const getBeliefDisplayValue = () => {
    return (selectedAuthorBelief || "") === "" ? "__none__" : selectedAuthorBelief || "";
  };

  return (
    <div className="space-y-4">
      {validTones.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Writing Tone</Label>
          <p className="text-xs text-gray-500 mb-2">Select the author's writing tone</p>
          <Select value={getToneDisplayValue()} onValueChange={handleToneChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select tone (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="__none__">None</SelectItem>
              {validTones.map((tone: any) => (
                <SelectItem key={tone.id} value={tone.id}>
                  {tone.tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {validExperiences.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Author Experience</Label>
          <p className="text-xs text-gray-500 mb-2">Select relevant author experience</p>
          <Select value={getExperienceDisplayValue()} onValueChange={handleExperienceChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select experience (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="__none__">None</SelectItem>
              {validExperiences.map((experience: any) => (
                <SelectItem key={experience.id} value={experience.id}>
                  {experience.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {validBeliefs.length > 0 && onAuthorBeliefChange && (
        <div>
          <Label className="text-sm font-medium">Product Belief</Label>
          <p className="text-xs text-gray-500 mb-2">Select relevant product belief</p>
          <Select value={getBeliefDisplayValue()} onValueChange={handleBeliefChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select belief (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              <SelectItem value="__none__">None</SelectItem>
              {validBeliefs.map((belief: any) => (
                <SelectItem key={belief.id} value={belief.id}>
                  {belief.belief}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default AuthorToneExperienceSelectors;
