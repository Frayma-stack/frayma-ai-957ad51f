
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Loader } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Author } from '@/types/storytelling';
import { useAuthorForm } from '@/hooks/useAuthorForm';
import AuthorBasicInfoSection from './author-form/AuthorBasicInfoSection';
import AuthorExperiencesSection from './author-form/AuthorExperiencesSection';
import AuthorTonesSection from './author-form/AuthorTonesSection';
import AuthorBeliefsSection from './author-form/AuthorBeliefsSection';
import AuthorSocialLinksSection from './author-form/AuthorSocialLinksSection';

interface AuthorFormProps {
  initialAuthor?: Author | null;
  selectedClientId?: string | null;
  onSave: (author: Author) => Promise<Author>;
  onCancel: () => void;
}

const AuthorForm: FC<AuthorFormProps> = ({ 
  initialAuthor, 
  selectedClientId,
  onSave, 
  onCancel 
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log('📝 AuthorForm rendered with:', {
    hasInitialAuthor: !!initialAuthor,
    selectedClientId,
    isEditing: !!initialAuthor,
    clientAssignment: selectedClientId ? 'will_assign_to_client' : 'no_client_selected'
  });

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
    validateAndCleanAuthor,
    clearPersistedData
  } = useAuthorForm(initialAuthor, selectedClientId);

  const handleSave = async () => {
    console.log('📝 AuthorForm handleSave called');
    setError(null);
    setIsSaving(true);

    try {
      const validatedAuthor = validateAndCleanAuthor(author);
      
      if (!validatedAuthor) {
        throw new Error('Author validation failed. Please check all required fields.');
      }

      console.log('📝 AuthorForm calling onSave with validated author:', {
        id: validatedAuthor.id,
        name: validatedAuthor.name,
        clientId: validatedAuthor.clientId,
        hasClientAssignment: !!validatedAuthor.clientId
      });

      await onSave(validatedAuthor);
      console.log('📝 AuthorForm onSave completed successfully');
    } catch (error) {
      console.error('📝 AuthorForm save error:', error);
      setError(error instanceof Error ? error.message : 'Failed to save author');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    console.log('📝 AuthorForm handleCancel called');
    clearPersistedData();
    onCancel();
  };

  // Show warning if no client is selected for new authors
  const showClientWarning = !initialAuthor && !selectedClientId;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-story-blue">
          {initialAuthor ? 'Edit Author' : 'Add New Author'}
        </CardTitle>
        {selectedClientId && (
          <p className="text-sm text-gray-600">
            This author will be assigned to the selected client
          </p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showClientWarning && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Please select a client first. Authors must be associated with a client to be used for content creation.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <AuthorBasicInfoSection 
          author={author} 
          onInputChange={handleInputChange} 
        />
        
        <AuthorExperiencesSection
          experiences={author.experiences}
          onExperienceChange={handleExperienceChange}
          onAddExperience={addExperience}
          onRemoveExperience={removeExperience}
        />
        
        <AuthorTonesSection
          tones={author.tones}
          onToneChange={handleToneChange}
          onAddTone={addTone}
          onRemoveTone={removeTone}
        />
        
        <AuthorBeliefsSection
          beliefs={author.beliefs}
          onBeliefChange={handleBeliefChange}
          onAddBelief={addBelief}
          onRemoveBelief={removeBelief}
        />
        
        <AuthorSocialLinksSection
          socialLinks={author.socialLinks}
          onSocialLinkChange={handleSocialLinkChange}
          onAddSocialLink={addSocialLink}
          onRemoveSocialLink={removeSocialLink}
        />
        
        <div className="flex gap-4 pt-6">
          <Button 
            onClick={handleSave}
            disabled={isSaving || showClientWarning}
            className="flex-1 bg-story-blue hover:bg-story-light-blue"
          >
            {isSaving ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              initialAuthor ? 'Update Author' : 'Create Author'
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1"
          >
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AuthorForm;
