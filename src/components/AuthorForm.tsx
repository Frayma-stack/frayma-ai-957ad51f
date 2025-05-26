
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Author } from '@/types/storytelling';
import { useAuthorForm } from '@/hooks/useAuthorForm';
import AuthorFormTabs from './author-form/AuthorFormTabs';
import AuthorBasicInfoSection from './author-form/AuthorBasicInfoSection';
import AuthorSocialLinksSection from './author-form/AuthorSocialLinksSection';
import AuthorFormActions from './author-form/AuthorFormActions';

interface AuthorFormProps {
  initialAuthor?: Author | null;
  onSave: (author: Author) => void;
  onCancel: () => void;
}

const AuthorForm: FC<AuthorFormProps> = ({ initialAuthor, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('basic-info');
  
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

  return (
    <div className="space-y-6">
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

      <AuthorFormActions 
        onSave={handleSave}
        onCancel={onCancel}
      />
    </div>
  );
};

export default AuthorForm;
