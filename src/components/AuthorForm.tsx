
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Author } from '@/types/storytelling';
import { useAuthorForm } from '@/hooks/useAuthorForm';
import AuthorFormTabs from './author-form/AuthorFormTabs';
import AuthorBasicInfoSection from './author-form/AuthorBasicInfoSection';
import AuthorAnalyzedInfoSection from './author-form/AuthorAnalyzedInfoSection';
import AuthorSocialLinksSection from './author-form/AuthorSocialLinksSection';
import AuthorFormActions from './author-form/AuthorFormActions';

interface AuthorFormProps {
  initialAuthor?: Author | null;
  onSave: (author: Author) => void;
  onCancel: () => void;
}

const AuthorForm: FC<AuthorFormProps> = ({ initialAuthor, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  
  const {
    author,
    handleInputChange,
    handleExperienceChange,
    addExperience,
    removeExperience,
    handleToneChange,
    addTone,
    removeTone,
    handleBeliefChange,
    addBelief,
    removeBelief,
    handleSocialLinkChange,
    addSocialLink,
    removeSocialLink,
    handleAuthorAnalysisResult,
    validateAndCleanAuthor
  } = useAuthorForm(initialAuthor);

  const handleSave = () => {
    const cleanedAuthor = validateAndCleanAuthor();
    if (cleanedAuthor) {
      onSave(cleanedAuthor);
    }
  };

  const handleAnalyzeProfile = () => {
    // This function is handled within AuthorSocialLinksSection
  };

  const hasAnalyzedContent = author.role || author.organization || author.backstory || 
    author.experiences.some(exp => exp.title || exp.description) ||
    author.tones.some(tone => tone.tone) ||
    author.beliefs.some(belief => belief.belief);

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">
          {initialAuthor ? 'Edit Author' : 'Add New Author'}
        </CardTitle>
        <CardDescription>
          Define author voice and perspective for generating authentic content. Add social links and use profile analysis to auto-fill information.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        <AuthorBasicInfoSection 
          author={author}
          onInputChange={handleInputChange}
        />

        <AuthorSocialLinksSection
          author={author}
          onSocialLinkChange={handleSocialLinkChange}
          onAddSocialLink={addSocialLink}
          onRemoveSocialLink={removeSocialLink}
          onAnalyzeProfile={handleAnalyzeProfile}
          onAnalysisComplete={handleAuthorAnalysisResult}
        />

        <AuthorAnalyzedInfoSection
          author={author}
          onInputChange={handleInputChange}
        />

        {hasAnalyzedContent && (
          <AuthorFormTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            author={author}
            onExperienceChange={handleExperienceChange}
            onAddExperience={addExperience}
            onRemoveExperience={removeExperience}
            onToneChange={handleToneChange}
            onAddTone={addTone}
            onRemoveTone={removeTone}
            onBeliefChange={handleBeliefChange}
            onAddBelief={addBelief}
            onRemoveBelief={removeBelief}
          />
        )}
      </CardContent>

      <AuthorFormActions 
        onSave={handleSave}
        onCancel={onCancel}
      />
    </Card>
  );
};

export default AuthorForm;
