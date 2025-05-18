
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  Author, 
  AuthorExperience, 
  AuthorToneItem, 
  AuthorBelief,
  AuthorSocialLink
} from '@/types/storytelling';
import { Plus, Trash, Loader2, Link as LinkIcon } from 'lucide-react';
import ProfileAnalyzer from './ProfileAnalyzer';

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
  const handleSocialLinkChange = (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'blog' | 'website' | 'other') => {
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
    experiences?: AuthorExperience[],
    tones?: AuthorToneItem[]
  }) => {
    setAuthor(prev => ({
      ...prev,
      experiences: results.experiences || prev.experiences,
      tones: results.tones || prev.tones
    }));
    toast({
      title: "Analysis complete",
      description: "Author's profile has been analyzed and information has been added to the form.",
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
            {/* Basic Info Section */}
            <div className="space-y-4">
              <h3 className="font-medium text-story-blue">Basic Information</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Name*</label>
                <Input 
                  placeholder="Author's full name"
                  value={author.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Role/Title</label>
                  <Input 
                    placeholder="e.g., Founder & CEO"
                    value={author.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Organization</label>
                  <Input 
                    placeholder="Company or organization name"
                    value={author.organization}
                    onChange={(e) => handleInputChange('organization', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Backstory</label>
                <Textarea 
                  placeholder="Describe the author's founding journey or background"
                  value={author.backstory}
                  onChange={(e) => handleInputChange('backstory', e.target.value)}
                  rows={5}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-story-blue">Social Links</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={addSocialLink}
                >
                  <Plus className="h-4 w-4 mr-1" /> Add Link
                </Button>
              </div>
              
              <div className="space-y-4">
                {(author.socialLinks || []).map((link, index) => (
                  <div key={link.id} className="flex items-center gap-3">
                    <select 
                      className="border border-input bg-background px-3 py-2 rounded-md text-sm h-10 min-w-[120px]"
                      value={link.type}
                      onChange={(e) => handleSocialLinkChange(link.id, 'type', e.target.value as 'linkedin' | 'blog' | 'website' | 'other')}
                    >
                      <option value="linkedin">LinkedIn</option>
                      <option value="blog">Blog</option>
                      <option value="website">Website</option>
                      <option value="other">Other</option>
                    </select>
                    <Input 
                      placeholder="Enter URL"
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(link.id, 'url', e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => removeSocialLink(link.id)}
                      disabled={(author.socialLinks || []).length <= 1}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button 
                className="w-full mt-2"
                variant="secondary"
                onClick={() => setShowProfileAnalyzer(true)}
                disabled={(author.socialLinks || []).every(link => !link.url.trim())}
              >
                <LinkIcon className="h-4 w-4 mr-2" /> Analyze Profile
              </Button>
            </div>
            
            <Tabs defaultValue="experiences">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="experiences">Experiences</TabsTrigger>
                <TabsTrigger value="tones">Writing Tone</TabsTrigger>
                <TabsTrigger value="beliefs">Product Beliefs</TabsTrigger>
              </TabsList>
              
              {/* Experiences Tab */}
              <TabsContent value="experiences" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Professional Experiences</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addExperience}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Experience
                  </Button>
                </div>
                
                {author.experiences.map((experience, index) => (
                  <div key={experience.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Experience #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeExperience(experience.id)}
                        disabled={author.experiences.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Input 
                        placeholder="Experience title"
                        value={experience.title}
                        onChange={(e) => handleExperienceChange(experience.id, 'title', e.target.value)}
                      />
                      
                      <Textarea 
                        placeholder="Experience description"
                        value={experience.description}
                        onChange={(e) => handleExperienceChange(experience.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Writing Tones Tab */}
              <TabsContent value="tones" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Writing Tone</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addTone}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Tone
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Define the author's writing style (e.g., candid, opinionated, data-driven, etc.)
                </p>
                
                {author.tones.map((tone, index) => (
                  <div key={tone.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tone #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeTone(tone.id)}
                        disabled={author.tones.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Input 
                        placeholder="Tone (e.g., Candid, Data-driven, Opinionated)"
                        value={tone.tone}
                        onChange={(e) => handleToneChange(tone.id, 'tone', e.target.value)}
                      />
                      
                      <Textarea 
                        placeholder="Description of this tone and when to use it"
                        value={tone.description}
                        onChange={(e) => handleToneChange(tone.id, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Product Beliefs Tab */}
              <TabsContent value="beliefs" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Product Beliefs & Takes</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addBelief}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Belief
                  </Button>
                </div>
                
                <p className="text-sm text-gray-600">
                  Add the author's strong opinions or unique insights about the product, industry, or problem space
                </p>
                
                {author.beliefs.map((belief, index) => (
                  <div key={belief.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Belief #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeBelief(belief.id)}
                        disabled={author.beliefs.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      <Input 
                        placeholder="Core belief or opinion"
                        value={belief.belief}
                        onChange={(e) => handleBeliefChange(belief.id, 'belief', e.target.value)}
                      />
                      
                      <Textarea 
                        placeholder="Explanation of this belief"
                        value={belief.description}
                        onChange={(e) => handleBeliefChange(belief.id, 'description', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
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
