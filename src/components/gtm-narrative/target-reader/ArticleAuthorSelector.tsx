import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Author } from '@/types/storytelling';
import { Users, HelpCircle } from 'lucide-react';

interface ArticleAuthorSelectorProps {
  selectedAuthor: string;
  authors: Author[];
  onAuthorChange: (authorId: string) => void;
}

const ArticleAuthorSelector: FC<ArticleAuthorSelectorProps> = ({
  selectedAuthor,
  authors,
  onAuthorChange
}) => {
  return (
    <TooltipProvider>
      <div className="space-y-3">
        <div className="flex items-center mb-3">
          <Users className="h-5 w-5 text-brand-primary mr-2" />
          <h4 className="text-md font-semibold text-brand-primary">Who's the Best-Fit Author for this Piece?</h4>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">
                Choose the author whose experience and perspective is most likely to resonate with your target readers. 
                This will guide the first-person narrative throughout the article.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div>
          <label className="text-sm font-medium">Select Article Author *</label>
          <p className="text-xs text-gray-500 mb-2">
            The chosen author should be someone whose experience is likely to resonate most with the target reader
          </p>
          <Select value={selectedAuthor} onValueChange={onAuthorChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose the best-fit author for this piece..." />
            </SelectTrigger>
            <SelectContent>
              {authors.length === 0 ? (
                <SelectItem value="no-authors" disabled>
                  No authors available. Add authors in Account Settings first.
                </SelectItem>
              ) : (
                authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{author.name}</span>
                      <span className="text-xs text-gray-500">{author.role} at {author.organization}</span>
                    </div>
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ArticleAuthorSelector;