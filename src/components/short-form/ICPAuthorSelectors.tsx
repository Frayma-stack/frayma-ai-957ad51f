
import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User } from "lucide-react";
import { ICPStoryScript, Author } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

interface ICPAuthorSelectorsProps {
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  scripts: ICPStoryScript[];
  authors: Author[];
  selectedIdea: GeneratedIdea | null;
  onICPChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
}

const ICPAuthorSelectors: FC<ICPAuthorSelectorsProps> = ({
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  scripts,
  authors,
  selectedIdea,
  onICPChange,
  onAuthorChange,
  onAuthorToneChange,
  onAuthorExperienceChange
}) => {
  console.log('👥 ICPAuthorSelectors DETAILED DEBUG:', {
    selectedICP,
    selectedAuthor,
    scriptsCount: scripts.length,
    authorsCount: authors.length,
    authorsRaw: authors,
    authorsDetailed: authors.map(a => ({ 
      id: a.id, 
      name: a.name, 
      role: a.role,
      idType: typeof a.id,
      idValue: a.id,
      idLength: a.id?.length,
      idTrimmed: a.id?.trim(),
      isEmpty: !a.id || a.id.trim() === ''
    })),
    scriptsFirst3: scripts.slice(0, 3).map(s => ({ id: s.id, name: s.name })),
    selectedIdea: selectedIdea ? { id: selectedIdea.id, title: selectedIdea.title } : null
  });

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  const selectedAuthorObj = getSelectedAuthor();

  // Filter function to ensure no empty string values
  const filterValidItems = (items: any[]) => {
    return items?.filter(item => item && item.id && item.id.trim() !== '') || [];
  };

  // Get valid tones and experiences
  const validTones = selectedAuthorObj?.tones ? filterValidItems(selectedAuthorObj.tones) : [];
  const validExperiences = selectedAuthorObj?.experiences ? filterValidItems(selectedAuthorObj.experiences) : [];

  // Filter valid authors - this might be the issue!
  const validAuthors = authors.filter(author => {
    const isValid = author && author.id && author.id.trim() !== '' && author.name && author.name.trim() !== '';
    console.log('👥 Author validation:', {
      authorId: author?.id,
      authorName: author?.name,
      hasId: !!author?.id,
      hasName: !!author?.name,
      idNotEmpty: author?.id && author.id.trim() !== '',
      nameNotEmpty: author?.name && author.name.trim() !== '',
      isValid
    });
    return isValid;
  });

  console.log('👥 Valid authors after filtering:', {
    originalCount: authors.length,
    validCount: validAuthors.length,
    validAuthors: validAuthors.map(a => ({ id: a.id, name: a.name, role: a.role }))
  });

  return (
    <div className="space-y-4">
      {!selectedIdea && (
        <div>
          <div className="flex items-center">
            <label className="text-sm font-medium">Target ICP *</label>
            <Users className="ml-2 h-4 w-4 text-gray-400" />
          </div>
          <Select value={selectedICP} onValueChange={onICPChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select ICP StoryScript" />
            </SelectTrigger>
            <SelectContent>
              {scripts.length === 0 ? (
                <SelectItem value="no-scripts" disabled>
                  No ICP StoryScripts found for this client
                </SelectItem>
              ) : (
                scripts
                  .filter(script => script.id && script.id.trim() !== '')
                  .map(script => (
                    <SelectItem key={script.id} value={script.id}>
                      {script.name}
                    </SelectItem>
                  ))
              )}
            </SelectContent>
          </Select>
        </div>
      )}
      
      <div>
        <div className="flex items-center">
          <label className="text-sm font-medium">Author *</label>
          <User className="ml-2 h-4 w-4 text-gray-400" />
        </div>
        <Select value={selectedAuthor} onValueChange={onAuthorChange}>
          <SelectTrigger className="mt-2">
            <SelectValue placeholder="Select author" />
          </SelectTrigger>
          <SelectContent>
            {validAuthors.length === 0 ? (
              <SelectItem value="no-authors" disabled>
                {authors.length === 0 
                  ? "No authors found for this client"
                  : `No valid authors found (${authors.length} total authors, but none have valid ID and name)`
                }
              </SelectItem>
            ) : (
              validAuthors.map(author => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name} - {author.role}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {validTones.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Author Tone</Label>
          <Select value={selectedAuthorTone} onValueChange={onAuthorToneChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select tone (optional)" />
            </SelectTrigger>
            <SelectContent>
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
            <SelectContent>
              {validExperiences.map((experience: any) => (
                <SelectItem key={experience.id} value={experience.id}>
                  {experience.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

export default ICPAuthorSelectors;
