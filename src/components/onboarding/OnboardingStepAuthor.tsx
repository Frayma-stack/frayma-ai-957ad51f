
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Plus, Trash2, Linkedin, Twitter, Globe } from "lucide-react";
import { Author, AuthorSocialLink } from '@/types/storytelling';

interface OnboardingStepAuthorProps {
  onAuthorAdded: (author: Author) => void;
  onNext: () => void;
}

const OnboardingStepAuthor: FC<OnboardingStepAuthorProps> = ({
  onAuthorAdded,
  onNext,
}) => {
  const [name, setName] = useState('');
  const [socialLinks, setSocialLinks] = useState<AuthorSocialLink[]>([
    { id: crypto.randomUUID(), type: 'linkedin', url: '' }
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  const addSocialLink = () => {
    setSocialLinks([
      ...socialLinks,
      { id: crypto.randomUUID(), type: 'linkedin', url: '' }
    ]);
  };

  const removeSocialLink = (id: string) => {
    setSocialLinks(socialLinks.filter(link => link.id !== id));
  };

  const updateSocialLink = (id: string, field: keyof AuthorSocialLink, value: string) => {
    setSocialLinks(socialLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const handleAnalyze = async () => {
    if (!name.trim()) return;

    setIsAnalyzing(true);
    
    // Simulate analysis (replace with actual API call)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockAuthor: Author = {
      id: crypto.randomUUID(),
      name: name.trim(),
      role: 'Marketing Director',
      organization: 'Tech Startup',
      backstory: 'Passionate about growth marketing and AI automation with 5+ years of experience.',
      experiences: [
        {
          id: crypto.randomUUID(),
          title: 'Growth Marketing',
          description: 'Led growth initiatives resulting in 300% user acquisition increase'
        },
        {
          id: crypto.randomUUID(),
          title: 'AI Implementation',
          description: 'Implemented AI tools to streamline marketing operations'
        }
      ],
      tones: [
        {
          id: crypto.randomUUID(),
          tone: 'Educational',
          description: 'Explains complex concepts in simple terms'
        },
        {
          id: crypto.randomUUID(),
          tone: 'Authentic',
          description: 'Shares personal experiences and insights'
        }
      ],
      beliefs: [
        {
          id: crypto.randomUUID(),
          belief: 'AI should augment human creativity',
          description: 'Technology should enhance rather than replace human insight'
        }
      ],
      socialLinks: socialLinks.filter(link => link.url.trim())
    };

    onAuthorAdded(mockAuthor);
    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const handleSkip = () => {
    const basicAuthor: Author = {
      id: crypto.randomUUID(),
      name: name.trim() || 'My Author',
      role: '',
      organization: '',
      backstory: '',
      experiences: [],
      tones: [],
      beliefs: [],
      socialLinks: []
    };
    
    onAuthorAdded(basicAuthor);
    onNext();
  };

  const getSocialIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'x': return <Twitter className="h-4 w-4" />;
      case 'blog': return <Globe className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      default: return <Globe className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label>Your Name *</Label>
            <Input
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <Label>Social Links</Label>
            <p className="text-sm text-gray-600 mb-3">
              Add your professional social links so we can analyze your content style and expertise
            </p>
            
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div key={link.id} className="flex space-x-2">
                  <select
                    value={link.type}
                    onChange={(e) => updateSocialLink(link.id, 'type', e.target.value)}
                    className="px-3 py-2 border rounded-md w-32"
                  >
                    <option value="linkedin">LinkedIn</option>
                    <option value="x">X (Twitter)</option>
                    <option value="blog">Blog</option>
                    <option value="website">Website</option>
                    <option value="other">Other</option>
                  </select>
                  
                  <div className="flex-1 relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                      {getSocialIcon(link.type)}
                    </div>
                    <Input
                      placeholder="Enter URL"
                      value={link.url}
                      onChange={(e) => updateSocialLink(link.id, 'url', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {socialLinks.length > 1 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeSocialLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              <Button
                variant="outline"
                size="sm"
                onClick={addSocialLink}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Another Link
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {hasAnalyzed && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <p className="text-green-800 font-medium">
              ✨ Great! We've analyzed your profile and extracted your writing style, expertise, and unique voice. 
              This will help us create content that truly sounds like you.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="flex space-x-3">
        <Button
          onClick={handleAnalyze}
          disabled={!name.trim() || isAnalyzing || hasAnalyzed}
          className="flex-1 bg-story-blue hover:bg-story-light-blue"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing Profile...
            </>
          ) : hasAnalyzed ? (
            'Analysis Complete ✓'
          ) : (
            'Analyze My Profile'
          )}
        </Button>
        
        {hasAnalyzed && (
          <Button onClick={onNext} className="flex-1">
            Continue
          </Button>
        )}
        
        <Button variant="outline" onClick={handleSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
};

export default OnboardingStepAuthor;
