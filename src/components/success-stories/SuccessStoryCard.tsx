
import { FC } from 'react';
import { CustomerSuccessStory } from '@/types/storytelling';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash, Link } from 'lucide-react';

interface SuccessStoryCardProps {
  story: CustomerSuccessStory;
  onEdit: (story: CustomerSuccessStory) => void;
  onDelete: (story: CustomerSuccessStory) => void;
}

const SuccessStoryCard: FC<SuccessStoryCardProps> = ({ story, onEdit, onDelete }) => {
  return (
    <Card key={story.id} className="overflow-hidden">
      <CardHeader className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{story.title}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(story)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(story)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold">Before:</span>
            <p className="text-gray-700 line-clamp-3">{story.beforeSummary}</p>
          </div>
          <div>
            <span className="font-semibold">After:</span>
            <p className="text-gray-700 line-clamp-3">{story.afterSummary}</p>
          </div>
          <div>
            <span className="font-semibold">Features Used:</span>
            <p className="text-gray-700 line-clamp-2">
              {story.features.map(f => f.name).join(', ')}
            </p>
          </div>
          <div>
            <span className="font-semibold">Quotes:</span>
            <p className="text-gray-700 line-clamp-2">
              {story.quotes.length} quote{story.quotes.length !== 1 ? 's' : ''}
            </p>
          </div>
          {story.url && (
            <div>
              <a 
                href={story.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-story-blue hover:underline flex items-center"
              >
                <Link className="h-3.5 w-3.5 mr-1" />
                View original
              </a>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuccessStoryCard;
