
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { 
  Author, 
  AuthorExperience, 
  AuthorToneItem, 
  AuthorBelief,
  AuthorSocialLink
} from '@/types/storytelling';
import ProfileAnalyzer from './ProfileAnalyzer';
import AuthorBasicInfoSection from './author-form/AuthorBasicInfoSection';
import AuthorSocialLinksSection from './author-form/AuthorSocialLinksSection';
import AuthorFormTabs from './author-form/AuthorFormTabs';

interface AuthorFormProps {
  initialAuthor?: Author | null;
  onSave: (author: Author) => void;
  onCancel: () => void;
}

// Helper to create empty items with unique IDs
const createEmptyExperience = (): AuthorExperience => ({
  id: crypto.randomUUID(),
  title: '',
  description: ''
});

const createEmptyTone = (): AuthorToneItem => ({
  id: crypto.randomUUID(),
  tone: '',
  description: ''
});

const createEmptyBelief = (): AuthorBelief => ({
  id: crypto.randomUUID(),
  belief: '',
  description: ''
});

const createEmptySocialLink = (): AuthorSocialLink => ({
  id: crypto.randomUUID(),
  type: 'linkedin',
  url: ''
});

const AuthorForm: FC<AuthorFormProps> = ({ initialAuthor, onSave, onCancel }) => {
  const { toast } = useToast();
  const [author, setAuthor] = useState<Author>(
    initialAuthor || {
      id: crypto.randomUUID(),
      name: '',
      role: '',
      organization: '',
      backstory: '',
      experiences: [createEmptyExperience()],
      tones: [createEmptyTone()],
      beliefs: [createEmptyBelief()],
      socialLinks: [createEmptySocialLink()]
    }
  );
  const [showProfileAnalyzer, setShowProfileAnalyzer] = useState(false);
  
  const handleInputChange = (
    field: keyof Omit<Author, 'id' | 'experiences' | 'tones' | 'beliefs' | 'socialLinks'>, 
    value: string
  ) => {
    setAuthor(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle Experience items
  const handleExperienceChange = (id: string, field: keyof AuthorExperience, value: string) => {
    setAuthor(prev => ({
      ...prev,
      experiences: prev.experiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };
  
  const addExperience = () => {
    setAuthor(prev => ({
      ...prev,
      experiences: [...prev.experiences, createEmptyExperience()]
    }));
  };
  
  const removeExperience = (id: string) => {
    setAuthor(prev => ({
      ...prev,
      experiences: prev.experiences.filter(exp => exp.id !== id)
    }));
  };
  
  // Handle Tone items
  const handleToneChange = (id: string, field: keyof AuthorToneItem, value: string) => {
    setAuthor(prev => ({
      ...prev,
      tones: prev.tones.map(tone => 
        tone.id === id ? { ...tone, [field]: value } : tone
      )
    }));
  };
  
  const addTone = () => {
    setAuthor(prev => ({
      ...prev,
      tones: [...prev.tones, createEmptyTone()]
    }));
  };
  
  const removeTone = (id: string) => {
    setAuthor(prev => ({
      ...prev,
      tones: prev.tones.filter(tone => tone.id !== id)
    }));
  };
  
  // Handle Belief items
  const handleBeliefChange = (id: string, field: keyof AuthorBelief, value: string) => {
    setAuthor(prev => ({
      ...prev,
      beliefs: prev.beliefs.map(belief => 
        belief.id === id ? { ...belief, [field]: value } : belief
      )
    }));
  };
  
  const addBelief = () => {
    setAuthor(prev => ({
      ...prev,
      beliefs: [...prev.beliefs, createEmptyBelief()]
    }));
  };
  
  const removeBelief = (id: string) => {
    setAuthor(prev => ({
      ...prev,
      beliefs: prev.beliefs.filter(belief => belief.id !== id)
    }));
  };
  
  // Handle Social Link items
  const handleSocialLinkChange = (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => {
    setAuthor(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.map(link => 
        link.id === id ? { ...link, [field]: value } : link
      ) || []
    }));
  };
  
  const addSocialLink = () => {
    setAuthor(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), createEmptySocialLink()]
    }));
  };
  
  const removeSocialLink = (id: string) => {
    setAuthor(prev => ({
      ...prev,
      socialLinks: prev.socialLinks?.filter(link => link.id !== id) || []
    }));
  };

  const handleAuthorAnalysisResult = (results: {
    currentRole?: string;
    organization?: string;
    backstory?: string;
    experiences?: AuthorExperience[];
    tones?: AuthorToneItem[];
    beliefs?: AuthorBelief[];
  }) => {
    setAuthor(prev => ({
      ...prev,
      role: results.currentRole || prev.role,
      organization: results.organization || prev.organization,
      backstory: results.backstory || prev.backstory,
      experiences: results.experiences || prev.experiences,
      tones: results.tones || prev.tones,
      beliefs: results.beliefs || prev.beliefs
    }));
    toast({
      title: "Analysis complete",
      description: "Author's profile has been analyzed and information has been auto-filled in the form.",
    });
    setShowProfileAnalyzer(false);
  };
  
  const handleSubmit = () => {
    // Basic validation
    if (!author.name.trim()) {
      toast({
        title: "Missing information",
        description: "Please provide a name for this author.",
        variant: "destructive"
      });
      return;
    }
    
    // Clean up empty items
    const cleanedAuthor = {
      ...author,
      experiences: author.experiences.filter(exp => exp.title.trim() !== '' || exp.description.trim() !== ''),
      tones: author.tones.filter(tone => tone.tone.trim() !== ''),
      beliefs: author.beliefs.filter(belief => belief.belief.trim() !== ''),
      socialLinks: author.socialLinks?.filter(link => link.url.trim() !== '') || undefined
    };
    
    // Make sure each array has at least one item
    if (cleanedAuthor.experiences.length === 0) cleanedAuthor.experiences = [createEmptyExperience()];
    if (cleanedAuthor.tones.length === 0) cleanedAuthor.tones = [createEmptyTone()];
    if (cleanedAuthor.beliefs.length === 0) cleanedAuthor.beliefs = [createEmptyBelief()];
    
    onSave(cleanedAuthor);
    toast({
      title: "Author saved",
      description: `"${author.name}" has been saved successfully.`
    });
  };
  
  return (
    <>
      {showProfileAnalyzer ? (
        <ProfileAnalyzer 
          socialLinks={author.socialLinks || []} 
          onClose={() => setShowProfileAnalyzer(false)}
          onAnalysisComplete={handleAuthorAnalysisResult}
        />
      ) : (
        <Card className="bg-white shadow-md">
          <CardHeader>
            <CardTitle className="text-story-blue">
              {initialAuthor ? 'Edit Author' : 'Add New Author'}
            </CardTitle>
            <CardDescription>
              Define author voice and perspective for generating authentic content
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
              onAnalyzeProfile={() => setShowProfileAnalyzer(true)}
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
          
          <CardFooter className="flex justify-end space-x-2 border-t pt-4">
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button 
              className="bg-story-blue hover:bg-story-light-blue"
              onClick={handleSubmit}
            >
              Save Author
            </Button>
          </CardFooter>
        </Card>
      )}
    </>
  );
};

export default AuthorForm;
