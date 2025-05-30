
import { FC } from 'react';
import { ICPStoryScript, Author } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import ICPSelector from './selectors/ICPSelector';
import AuthorSelector from './selectors/AuthorSelector';
import AuthorToneExperienceSelectors from './selectors/AuthorToneExperienceSelectors';

interface ICPAuthorSelectorsProps {
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedAuthorBelief?: string;
  scripts: ICPStoryScript[];
  authors: Author[];
  selectedIdea: GeneratedIdea | null;
  onICPChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onAuthorToneChange: (value: string) => void;
  onAuthorExperienceChange: (value: string) => void;
  onAuthorBeliefChange?: (value: string) => void;
}

const ICPAuthorSelectors: FC<ICPAuthorSelectorsProps> = ({
  selectedICP,
  selectedAuthor,
  selectedAuthorTone,
  selectedAuthorExperience,
  selectedAuthorBelief,
  scripts,
  authors,
  selectedIdea,
  onICPChange,
  onAuthorChange,
  onAuthorToneChange,
  onAuthorExperienceChange,
  onAuthorBeliefChange
}) => {
  console.log('👥 ICPAuthorSelectors - Client-filtered data received:', {
    selectedICP,
    selectedAuthor,
    scriptsCount: scripts.length,
    authorsCount: authors.length,
    selectedIdea: selectedIdea ? { id: selectedIdea.id, title: selectedIdea.title } : null,
    authorsDetailed: authors.map(a => ({
      id: a.id,
      name: a.name,
      clientId: a.clientId
    }))
  });

  return (
    <div className="space-y-4">
      {!selectedIdea && (
        <ICPSelector
          selectedICP={selectedICP}
          scripts={scripts}
          onICPChange={onICPChange}
        />
      )}
      
      <AuthorSelector
        selectedAuthor={selectedAuthor}
        authors={authors}
        onAuthorChange={onAuthorChange}
      />
      
      <AuthorToneExperienceSelectors
        selectedAuthor={selectedAuthor}
        selectedAuthorTone={selectedAuthorTone}
        selectedAuthorExperience={selectedAuthorExperience}
        selectedAuthorBelief={selectedAuthorBelief}
        authors={authors}
        onAuthorToneChange={onAuthorToneChange}
        onAuthorExperienceChange={onAuthorExperienceChange}
        onAuthorBeliefChange={onAuthorBeliefChange}
      />
    </div>
  );
};

export default ICPAuthorSelectors;
