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
  console.log('👥 ICPAuthorSelectors - Client-filtered data received:', {
    selectedICP,
    selectedAuthor,
    scriptsCount: scripts.length,
    authorsCount: authors.length,
    selectedIdea: selectedIdea ? { id: selectedIdea.id, title: selectedIdea.title } : null,
    authorsValidation: authors.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      organization: a.organization,
      clientId: a.clientId,
      isValid: !!(a.id && a.id.trim() !== '' && a.name && a.name.trim() !== '')
    }))
  });

  const getSelectedAuthor = () => {
    const found = authors.find(author => author.id === selectedAuthor);
    console.log('👥 getSelectedAuthor result:', {
      selectedAuthor,
      found: found ? { id: found.id, name: found.name } : null
    });
    return found;
  };

  const selectedAuthorObj = getSelectedAuthor();

  // Validate authors - ensure they have valid ID and name
  const validAuthors = authors.filter(author => {
    const hasValidId = author && author.id && typeof author.id === 'string' && author.id.trim() !== '';
    const hasValidName = author && author.name && typeof author.name === 'string' && author.name.trim() !== '';
    const isValid = hasValidId && hasValidName;
    
    console.log('👥 Author validation (client-filtered):', {
      authorId: author?.id,
      authorName: author?.name,
      authorRole: author?.role,
      authorClientId: author?.clientId,
      hasValidId,
      hasValidName,
      isValid
    });
    
    return isValid;
  });

  console.log('👥 Final valid authors after client filtering:', {
    originalCount: authors.length,
    validCount: validAuthors.length,
    validAuthors: validAuthors.map(a => ({
      id: a.id,
      name: a.name,
      role: a.role,
      clientId: a.clientId
    }))
  });

  // Get valid tones and experiences from selected author
  const validTones = selectedAuthorObj?.tones?.filter(tone => tone && tone.id && tone.id.trim() !== '') || [];
  const validExperiences = selectedAuthorObj?.experiences?.filter(exp => exp && exp.id && exp.id.trim() !== '') || [];

  console.log('👥 Author sub-data validation:', {
    selectedAuthorObj: selectedAuthorObj ? { id: selectedAuthorObj.id, name: selectedAuthorObj.name } : null,
    validTonesCount: validTones.length,
    validExperiencesCount: validExperiences.length
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
          <SelectContent className="bg-white z-50">
            {validAuthors.length === 0 ? (
              <SelectItem value="no-authors" disabled>
                {authors.length === 0 
                  ? "No authors found for this client - please create an author first"
                  : `No valid authors found for this client (${authors.length} authors have validation issues)`
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
    </div>
  );
};

export default ICPAuthorSelectors;
