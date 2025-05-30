
import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Author } from '@/types/storytelling';

interface AuthorToneExperienceSelectorsProps {
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  authors: Author[];
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
}

const AuthorToneExperienceSelectors: FC<AuthorToneExperienceSelectorsProps> = ({
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  authors,
  onAuthorToneChange,
  onAuthorExperienceChange
}) => {
  const getSelectedAuthor = () => {
    const found = authors.find(author => author.id === selectedAuthor);
    console.log('🎨 getSelectedAuthor result in ToneExperienceSelectors:', {
      selectedAuthor,
      found: found ? { id: found.id, name: found.name } : null
    });
    return found;
  };

  const selectedAuthorObj = getSelectedAuthor();

  // Get valid tones and experiences from selected author
  const validTones = selectedAuthorObj?.tones?.filter(tone => tone && tone.id && tone.id.trim() !== '') || [];
  const validExperiences = selectedAuthorObj?.experiences?.filter(exp => exp && exp.id && exp.id.trim() !== '') || [];

  console.log('🎨 Author sub-data validation in ToneExperienceSelectors:', {
    selectedAuthorObj: selectedAuthorObj ? { id: selectedAuthorObj.id, name: selectedAuthorObj.name } : null,
    validTonesCount: validTones.length,
    validExperiencesCount: validExperiences.length
  });

  return (
    <>
      {validTones.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Author Tone</Label>
          <Select value={selectedAuthorTone} onValueChange={onAuthorToneChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select tone (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
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
          <Select value={selectedAuthorExperience} onValueChange={onAuthorExperienceChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select experience (optional)" />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {validExperiences.map((experience: any) => (
                <SelectItem key={experience.id} value={experience.id}>
                  {experience.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};

export default AuthorToneExperienceSelectors;
