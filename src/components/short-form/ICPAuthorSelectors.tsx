
import { FC } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Mic, User } from "lucide-react";
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
  const getSelectedAuthor = () => {
    return authors.find(author => author.id === selectedAuthor);
  };

  const getAuthorTones = () => {
    const author = getSelectedAuthor();
    return author?.tones || [];
  };

  const getAuthorExperiences = () => {
    const author = getSelectedAuthor();
    return author?.experiences || [];
  };

  return (
    <>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select ICP</label>
          <Select 
            value={selectedICP} 
            onValueChange={onICPChange}
            disabled={!!selectedIdea}
          >
            <SelectTrigger>
              <SelectValue placeholder={selectedIdea ? "Using selected idea" : "Choose an ICP"} />
            </SelectTrigger>
            <SelectContent>
              {scripts.map(script => (
                <SelectItem key={script.id} value={script.id}>{script.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Author</label>
          <Select value={selectedAuthor} onValueChange={onAuthorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an author" />
            </SelectTrigger>
            <SelectContent>
              {authors.map(author => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                  {author.role ? ` (${author.role})` : ''}
                </SelectItem>
              ))}
              {authors.length === 0 && (
                <SelectItem value="no-authors" disabled>
                  No authors available. Add authors in Assets tab.
                </SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {selectedAuthor && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium">Author Writing Tone</label>
              <Mic className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <Select 
              value={selectedAuthorTone} 
              onValueChange={onAuthorToneChange}
              disabled={!selectedAuthor || getAuthorTones().length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select tone (optional)" />
              </SelectTrigger>
              <SelectContent>
                {getAuthorTones().map(tone => (
                  <SelectItem key={tone.id} value={tone.id}>
                    {tone.tone}
                  </SelectItem>
                ))}
                {getAuthorTones().length === 0 && (
                  <SelectItem value="no-tones" disabled>
                    No tones available for this author
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <label className="text-sm font-medium">Author Experience</label>
              <User className="ml-2 h-4 w-4 text-gray-400" />
            </div>
            <Select 
              value={selectedAuthorExperience} 
              onValueChange={onAuthorExperienceChange}
              disabled={!selectedAuthor || getAuthorExperiences().length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select experience (optional)" />
              </SelectTrigger>
              <SelectContent>
                {getAuthorExperiences().map(exp => (
                  <SelectItem key={exp.id} value={exp.id}>
                    {exp.title}
                  </SelectItem>
                ))}
                {getAuthorExperiences().length === 0 && (
                  <SelectItem value="no-experiences" disabled>
                    No experiences available for this author
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default ICPAuthorSelectors;
