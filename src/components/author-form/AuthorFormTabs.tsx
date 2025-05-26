
import { FC } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Author } from '@/types/storytelling';
import AuthorExperiencesTab from './AuthorExperiencesTab';
import AuthorTonesTab from './AuthorTonesTab';
import AuthorBeliefsTab from './AuthorBeliefsTab';

interface AuthorFormTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  author: Author;
  onExperienceChange: (id: string, field: 'title' | 'description', value: string) => void;
  onAddExperience: () => void;
  onRemoveExperience: (id: string) => void;
  onToneChange: (id: string, field: 'tone' | 'description', value: string) => void;
  onAddTone: () => void;
  onRemoveTone: (id: string) => void;
  onBeliefChange: (id: string, field: 'belief' | 'description', value: string) => void;
  onAddBelief: () => void;
  onRemoveBelief: (id: string) => void;
}

const AuthorFormTabs: FC<AuthorFormTabsProps> = ({
  activeTab,
  onTabChange,
  author,
  onExperienceChange,
  onAddExperience,
  onRemoveExperience,
  onToneChange,
  onAddTone,
  onRemoveTone,
  onBeliefChange,
  onAddBelief,
  onRemoveBelief
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange}>
      <TabsList className="grid grid-cols-3">
        <TabsTrigger value="experiences">Experiences</TabsTrigger>
        <TabsTrigger value="tones">Writing Tone</TabsTrigger>
        <TabsTrigger value="beliefs">Product Beliefs</TabsTrigger>
      </TabsList>
      
      <TabsContent value="experiences">
        <AuthorExperiencesTab
          experiences={author.experiences}
          onExperienceChange={onExperienceChange}
          onAddExperience={onAddExperience}
          onRemoveExperience={onRemoveExperience}
        />
      </TabsContent>
      
      <TabsContent value="tones">
        <AuthorTonesTab
          tones={author.tones}
          onToneChange={onToneChange}
          onAddTone={onAddTone}
          onRemoveTone={onRemoveTone}
        />
      </TabsContent>
      
      <TabsContent value="beliefs">
        <AuthorBeliefsTab
          beliefs={author.beliefs}
          onBeliefChange={onBeliefChange}
          onAddBelief={onAddBelief}
          onRemoveBelief={onRemoveBelief}
        />
      </TabsContent>
    </Tabs>
  );
};

export default AuthorFormTabs;
