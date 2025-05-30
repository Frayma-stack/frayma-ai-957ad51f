
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
  onSave: (author: Author) => Promise<Author> | Author;
  onCancel: () => void;
}

const AuthorForm: FC<AuthorFormProps> = ({ initialAuthor, onSave, onCancel }) => {
  const [activeTab, setActiveTab] = useState('experiences');
  const [showExpandedForm, setShowExpandedForm] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  console.log('🔥 AuthorForm RENDER:', {
    hasInitialAuthor: !!initialAuthor,
    initialAuthorName: initialAuthor?.name,
    onSaveType: typeof onSave,
    isAsync: onSave.constructor.name === 'AsyncFunction',
    isSaving
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
    handleAuthorAnalysisResult,
    validateAndCleanAuthor
  } = useAuthorForm(initialAuthor);

  const handleSave = async () => {
    console.log('🔥 AuthorForm.handleSave CLICKED - ENTRY POINT');
    console.log('🔥 Current isSaving state:', isSaving);
    console.log('🔥 Current author state:', {
      id: author.id,
      name: author.name,
      role: author.role,
      organization: author.organization,
      backstory: author.backstory,
      hasExperiences: author.experiences?.length > 0,
      hasTones: author.tones?.length > 0,
      hasBeliefs: author.beliefs?.length > 0
    });
    
    if (isSaving) {
      console.log('🔥 Already saving, ignoring duplicate click');
      return;
    }
    
    setIsSaving(true);
    console.log('🔥 Set isSaving to true, proceeding with save...');
    
    try {
      console.log('🔥 About to validate author...');
      const cleanedAuthor = validateAndCleanAuthor();
      console.log('🔥 Validation result:', {
        isValid: !!cleanedAuthor,
        cleanedAuthorName: cleanedAuthor?.name,
        cleanedAuthorId: cleanedAuthor?.id,
        cleanedAuthorRole: cleanedAuthor?.role,
        cleanedAuthorOrganization: cleanedAuthor?.organization
      });
      
      if (cleanedAuthor) {
        console.log('🔥 Validation passed, calling parent onSave function...');
        console.log('🔥 About to call onSave with:', {
          name: cleanedAuthor.name,
          id: cleanedAuthor.id,
          role: cleanedAuthor.role,
          organization: cleanedAuthor.organization,
          experiencesCount: cleanedAuthor.experiences?.length || 0,
          tonesCount: cleanedAuthor.tones?.length || 0,
          beliefsCount: cleanedAuthor.beliefs?.length || 0
        });
        
        const result = await onSave(cleanedAuthor);
        console.log('🔥 onSave completed successfully, result:', {
          resultType: typeof result,
          resultName: result?.name,
          resultId: result?.id
        });
        console.log('🔥 Author save process completed successfully');
      } else {
        console.error('🔥 Author validation failed - cleanedAuthor is null');
        console.error('🔥 Raw author that failed validation:', author);
      }
    } catch (error) {
      console.error('🔥 ERROR in AuthorForm.handleSave:', error);
      console.error('🔥 Error name:', error instanceof Error ? error.name : 'Unknown');
      console.error('🔥 Error message:', error instanceof Error ? error.message : 'Unknown');
      console.error('🔥 Error stack:', error instanceof Error ? error.stack : 'No stack available');
      throw error; // Re-throw to ensure error handling works properly
    } finally {
      console.log('🔥 Setting isSaving back to false');
      setIsSaving(false);
    }
  };

  const handleAnalysisComplete = (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: any[];
    tones?: any[];
    beliefs?: any[];
  }) => {
    console.log('Analysis complete with results:', results);
    
    // Show the expanded form when analysis completes or manual mode is triggered
    setShowExpandedForm(true);
    
    // Check if this is manual mode (empty results object)
    const isManual = Object.keys(results).length === 0;
    setIsManualMode(isManual);
    
    // Handle the analysis results (if any)
    if (!isManual) {
      handleAuthorAnalysisResult(results);
    }
  };

  const hasAnalyzedContent = author.role || author.organization || author.backstory || 
    author.experiences.some(exp => exp.title || exp.description) ||
    author.tones.some(tone => tone.tone) ||
    author.beliefs.some(belief => belief.belief);

  console.log('🔥 AuthorForm render state:', {
    authorName: author.name,
    authorId: author.id,
    showExpandedForm,
    hasAnalyzedContent,
    isManualMode,
    isSaving
  });

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">
          {initialAuthor ? 'Edit Author' : 'Add New Author'}
        </CardTitle>
        <CardDescription>
          Define author voice and perspective for generating authentic content. Add social links and use profile analysis to auto-fill information, or add author details manually.
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
          onAnalyzeProfile={() => {}} // This is handled within the component
          onAnalysisComplete={handleAnalysisComplete}
        />

        {(showExpandedForm || hasAnalyzedContent) && (
          <AuthorAnalyzedInfoSection
            author={author}
            onInputChange={handleInputChange}
            showSection={true}
          />
        )}

        {(showExpandedForm || hasAnalyzedContent) && (
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
        isSaving={isSaving}
      />
    </Card>
  );
};

export default AuthorForm;
