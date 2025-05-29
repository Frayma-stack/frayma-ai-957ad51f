
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Sparkles, Edit } from "lucide-react";
import { Author } from '@/types/storytelling';
import AuthorForm from '@/components/AuthorForm';

interface OnboardingStepAuthorProps {
  onAuthorAdded: (author: Author) => void;
  onNext: () => void;
}

const OnboardingStepAuthor: FC<OnboardingStepAuthorProps> = ({
  onAuthorAdded,
  onNext,
}) => {
  const [hasCreatedAuthor, setHasCreatedAuthor] = useState(false);
  const [createdAuthor, setCreatedAuthor] = useState<Author | null>(null);
  const [showEditMode, setShowEditMode] = useState(false);

  const handleAuthorCreated = (author: Author) => {
    console.log('🎯 Author created in onboarding:', author.name);
    setCreatedAuthor(author);
    setHasCreatedAuthor(true);
    setShowEditMode(false);
    onAuthorAdded(author);
  };

  const handleNext = () => {
    if (!hasCreatedAuthor) return;
    onNext();
  };

  const handleEditAuthor = () => {
    setShowEditMode(true);
  };

  if (showEditMode) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <User className="h-5 w-5 text-story-blue" />
            <CardTitle>Edit Your Author Profile</CardTitle>
          </div>
          <CardDescription>
            Make any adjustments to your author profile analyzed by the Frayma AI Narrative Engine.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthorForm 
            onAuthorAdded={handleAuthorCreated}
            initialAuthor={createdAuthor}
          />
        </CardContent>
      </Card>
    );
  }

  if (hasCreatedAuthor && createdAuthor) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-story-blue" />
              <CardTitle>Author Profile Created!</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={handleEditAuthor}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
          <CardDescription>
            The Frayma AI Narrative Engine has analyzed and created your author profile. Review the results below.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="h-5 w-5 text-green-600" />
              <h4 className="font-medium text-green-800">Frayma AI Analysis Complete</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-green-700">Name:</span> {createdAuthor.name}
              </div>
              <div>
                <span className="font-medium text-green-700">Role:</span> {createdAuthor.role}
              </div>
              <div>
                <span className="font-medium text-green-700">Organization:</span> {createdAuthor.organization}
              </div>
              {createdAuthor.experiences && createdAuthor.experiences.length > 0 && (
                <div>
                  <span className="font-medium text-green-700">Key Experiences:</span>
                  <ul className="mt-1 ml-4 list-disc">
                    {createdAuthor.experiences.slice(0, 3).map((exp) => (
                      <li key={exp.id} className="text-green-600">{exp.title}</li>
                    ))}
                  </ul>
                </div>
              )}
              {createdAuthor.tones && createdAuthor.tones.length > 0 && (
                <div>
                  <span className="font-medium text-green-700">Writing Tones:</span>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {createdAuthor.tones.slice(0, 3).map((tone) => (
                      <span key={tone.id} className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
                        {tone.tone}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button 
            onClick={handleNext}
            className="w-full bg-story-blue hover:bg-story-light-blue"
          >
            Continue to Business Setup
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-story-blue" />
          <CardTitle>Set Up Your Author Profile</CardTitle>
        </div>
        <CardDescription>
          Let the Frayma AI Narrative Engine analyze your professional profile to create an authentic authoring voice.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AuthorForm onAuthorAdded={handleAuthorCreated} />
      </CardContent>
    </Card>
  );
};

export default OnboardingStepAuthor;
