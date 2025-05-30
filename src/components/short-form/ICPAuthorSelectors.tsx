
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
  console.log('👥 ICPAuthorSelectors render:', {
    selectedICP,
    selectedAuthor,
    scriptsCount: scripts.length,
    authorsCount: authors.length,
    scriptsFirst3: scripts.slice(0, 3).map(s => ({ id: s.id, name: s.name })),
    authorsFirst3: authors.slice(0, 3).map(a => ({ id: a.id, name: a.name }))
  });

  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  const selectedAuthorObj = getSelectedAuthor();

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
                scripts.map(script => (
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
            {authors.length === 0 ? (
              <SelectItem value="no-authors" disabled>
                No authors found for this client
              </SelectItem>
            ) : (
              authors.map(author => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name} - {author.role}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>
      
      {selectedAuthorObj && selectedAuthorObj.tones.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Author Tone</Label>
          <Select value={selectedAuthorTone} onValueChange={onAuthorToneChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select tone (optional)" />
            </SelectTrigger>
            <SelectContent>
              {selectedAuthorObj.tones.map(tone => (
                <SelectItem key={tone.id} value={tone.id}>
                  {tone.tone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {selectedAuthorObj && selectedAuthorObj.experiences.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Author Experience</Label>
          <Select value={selectedAuthorExperience} onValueChange={onAuthorExperienceChange}>
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Select experience (optional)" />
            </SelectTrigger>
            <SelectContent>
              {selectedAuthorObj.experiences.map(experience => (
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
