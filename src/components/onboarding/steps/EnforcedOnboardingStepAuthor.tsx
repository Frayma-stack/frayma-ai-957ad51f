
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Sparkles } from "lucide-react";
import { Author } from '@/types/storytelling';
import AuthorForm from '@/components/AuthorForm';

interface EnforcedOnboardingStepAuthorProps {
  onAuthorAdded: (author: Author) => Promise<Author>;
}

const EnforcedOnboardingStepAuthor: FC<EnforcedOnboardingStepAuthorProps> = ({
  onAuthorAdded,
}) => {
  const [isCreating, setIsCreating] = useState(false);

  const handleAuthorCreated = async (author: Author) => {
    setIsCreating(true);
    try {
      const savedAuthor = await onAuthorAdded(author);
      return savedAuthor;
    } catch (error) {
      console.error('Error creating author:', error);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="h-6 w-6 text-story-blue" />
          <CardTitle>Create Your Author Profile</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            <h4 className="font-medium text-purple-800">Frayma AI Author Analysis</h4>
          </div>
          <p className="text-purple-700 text-sm">
            Provide your professional information and social profiles so Frayma AI can analyze 
            your unique voice, expertise, and writing style to create authentic content.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Required Information:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Professional background and role</li>
            <li>• LinkedIn profile for voice analysis</li>
            <li>• X/Twitter profile (optional)</li>
            <li>• Published articles or content URLs</li>
            <li>• Writing tones and expertise areas</li>
            <li>• Professional experiences and beliefs</li>
          </ul>
        </div>

        <div className="border rounded-lg p-6">
          <AuthorForm 
            onSave={handleAuthorCreated}
            onCancel={() => {}}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default EnforcedOnboardingStepAuthor;
