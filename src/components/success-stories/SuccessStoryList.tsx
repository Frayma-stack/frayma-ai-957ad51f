
import { FC, useState } from 'react';
import { CustomerSuccessStory } from '@/types/storytelling';
import SuccessStoryCard from './SuccessStoryCard';
import { BookMarked, Search } from 'lucide-react';
import { Input } from '../ui/input';

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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter success stories based on search term
  const filteredStories = successStories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Render empty state if no stories or no search results
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
    <div className="space-y-4">
      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search success stories by title..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="pl-9 w-full"
        />
      </div>
      
      {/* Show message when no search results */}
      {filteredStories.length === 0 && searchTerm !== '' && (
        <div className="text-center py-6 text-gray-500">
          <p>No success stories found matching "{searchTerm}"</p>
        </div>
      )}
      
      {/* Success stories grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredStories.map((story) => (
          <SuccessStoryCard 
            key={story.id} 
            story={story} 
            onEdit={onEdit} 
            onDelete={onDelete} 
          />
        ))}
      </div>
    </div>
  );
};

export default SuccessStoryList;
