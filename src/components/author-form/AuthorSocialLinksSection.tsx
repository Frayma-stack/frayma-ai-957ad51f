
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Author, AuthorSocialLink } from '@/types/storytelling';
import { Plus, Trash, Info } from 'lucide-react';

interface AuthorSocialLinksSectionProps {
  author: Author;
  onSocialLinkChange: (id: string, field: keyof AuthorSocialLink, value: string | 'linkedin' | 'x' | 'blog' | 'website' | 'other') => void;
  onAddSocialLink: () => void;
  onRemoveSocialLink: (id: string) => void;
  onAnalyzeProfile: () => void;
}

const AuthorSocialLinksSection: FC<AuthorSocialLinksSectionProps> = ({
  author,
  onSocialLinkChange,
  onAddSocialLink,
  onRemoveSocialLink,
  onAnalyzeProfile
}) => {
  const hasValidUrls = (author.socialLinks || []).some(link => link.url.trim() !== '');

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="font-medium text-story-blue">Social Links</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onAddSocialLink}
        >
          <Plus className="h-4 w-4 mr-1" /> Add Link
        </Button>
      </div>

      {!hasValidUrls && (
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-md">
          <div className="flex items-start">
            <Info className="h-4 w-4 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-amber-700">
              Add LinkedIn, X (Twitter), or other profile URLs to enable automatic profile analysis and auto-filling of author information.
            </p>
          </div>
        </div>
      )}
      
      <div className="space-y-4">
        {(author.socialLinks || []).map((link, index) => (
          <div key={link.id} className="flex items-center gap-3">
            <select 
              className="border border-input bg-background px-3 py-2 rounded-md text-sm h-10 min-w-[120px]"
              value={link.type}
              onChange={(e) => onSocialLinkChange(link.id, 'type', e.target.value as 'linkedin' | 'x' | 'blog' | 'website' | 'other')}
            >
              <option value="linkedin">LinkedIn</option>
              <option value="x">X (Twitter)</option>
              <option value="blog">Blog</option>
              <option value="website">Website</option>
              <option value="other">Other</option>
            </select>
            <Input 
              placeholder="Enter profile or content URL"
              value={link.url}
              onChange={(e) => onSocialLinkChange(link.id, 'url', e.target.value)}
              className="flex-1"
            />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onRemoveSocialLink(link.id)}
              disabled={(author.socialLinks || []).length <= 1}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuthorSocialLinksSection;
