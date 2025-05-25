
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { ExternalLink } from 'lucide-react';
import { AuthorSocialLink } from '@/types/storytelling';

interface SocialLinksDisplayProps {
  socialLinks: AuthorSocialLink[];
}

const SocialLinksDisplay: FC<SocialLinksDisplayProps> = ({ socialLinks }) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">LinkedIn and Other URLs to Analyze</label>
      <div className="space-y-2">
        {socialLinks.map((link) => (
          <div key={link.id} className="flex items-center gap-2 text-sm">
            <span className="w-20 text-gray-500">{link.type}:</span>
            <div className="flex-1 truncate">{link.url}</div>
            <Button 
              variant="ghost" 
              size="icon" 
              asChild
              className="h-6 w-6"
            >
              <a href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SocialLinksDisplay;
