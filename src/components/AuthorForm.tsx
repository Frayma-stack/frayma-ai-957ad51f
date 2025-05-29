
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
  const [showExpandedForm, setShowExpandedForm] = useState(false);
  const [isManualMode, setIsManualMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
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
    console.log('AuthorForm handleSave called');
    
    if (isSaving) {
      console.log('Already saving, ignoring duplicate request');
      return;
    }
    
    setIsSaving(true);
    
    try {
      console.log('Validating author before save...', {
        name: author.name,
        role: author.role,
        organization: author.organization
      });
      
      const cleanedAuthor = validateAndCleanAuthor();
      
      if (cleanedAuthor) {
        console.log('Author validated successfully, calling onSave...', cleanedAuthor.name);
        await onSave(cleanedAuthor);
        console.log('onSave completed successfully');
      } else {
        console.error('Author validation failed, cannot save');
      }
    } catch (error) {
      console.error('Error during save process:', error);
    } finally {
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

  console.log('AuthorForm render state:', {
    authorName: author.name,
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
