
import { FC } from 'react';
import { CustomerSuccessStory } from '@/types/storytelling';
import SuccessStoryCard from './SuccessStoryCard';
import { BookMarked } from 'lucide-react';

interface SuccessStoryListProps {
  successStories: CustomerSuccessStory[];
  onEdit: (story: CustomerSuccessStory) => void;
  onDelete: (story: CustomerSuccessStory) => void;
}

const SuccessStoryList: FC<SuccessStoryListProps> = ({ 
  successStories, 
  onEdit, 
  onDelete 
}) => {
  if (successStories.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <BookMarked className="mx-auto h-12 w-12 opacity-30 mb-2" />
        <p>No customer success stories yet</p>
        <p className="text-sm mt-1">
          Add your first customer success story to reference in your narratives
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {successStories.map((story) => (
        <SuccessStoryCard 
          key={story.id} 
          story={story} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default SuccessStoryList;
