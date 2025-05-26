
import { FC } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Author } from '@/types/storytelling';
import { useAuthorForm } from '@/hooks/useAuthorForm';
import AuthorBasicInfoSection from './author-form/AuthorBasicInfoSection';
import AuthorSocialLinksSection from './author-form/AuthorSocialLinksSection';
import AuthorFormTabs from './author-form/AuthorFormTabs';
import AuthorFormActions from './author-form/AuthorFormActions';

interface AuthorFormProps {
  initialAuthor?: Author | null;
  onSave: (author: Author) => void;
  onCancel: () => void;
}

const AuthorForm: FC<AuthorFormProps> = ({ initialAuthor, onSave, onCancel }) => {
  const { toast } = useToast();
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
  
  const handleSubmit = () => {
    const cleanedAuthor = validateAndCleanAuthor();
    if (cleanedAuthor) {
      onSave(cleanedAuthor);
    }
  };
  
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
        <AuthorSocialLinksSection
          author={author}
          onSocialLinkChange={handleSocialLinkChange}
          onAddSocialLink={addSocialLink}
          onRemoveSocialLink={removeSocialLink}
          onAnalyzeProfile={() => {}} // Empty function since analysis is now handled in BasicInfoSection
        />

        <AuthorBasicInfoSection
          author={author}
          onInputChange={handleInputChange}
          onAnalysisComplete={handleAuthorAnalysisResult}
        />
        
        <AuthorFormTabs
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
      </CardContent>
      
      <AuthorFormActions onCancel={onCancel} onSave={handleSubmit} />
    </Card>
  );
};

export default AuthorForm;
