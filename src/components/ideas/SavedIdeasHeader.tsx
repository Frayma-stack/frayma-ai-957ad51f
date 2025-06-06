
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, SortDesc } from 'lucide-react';
import { IdeasSortOrder } from '@/types/ideas';

interface SavedIdeasHeaderProps {
  searchTerm: string;
  sortOrder: IdeasSortOrder;
  onSearchChange: (value: string) => void;
  onSortOrderChange: (value: IdeasSortOrder) => void;
  onAddManualIdea: () => void;
}

const SavedIdeasHeader: FC<SavedIdeasHeaderProps> = ({
  searchTerm,
  sortOrder,
  onSearchChange,
  onSortOrderChange,
  onAddManualIdea
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
      <div className="relative flex-grow">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input 
          placeholder="Search ideas..." 
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      <div className="flex gap-2">
        <Select
          value={sortOrder}
          onValueChange={(value) => onSortOrderChange(value as IdeasSortOrder)}
        >
          <SelectTrigger className="w-[180px]">
            <SortDesc className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="score-desc">Highest Score First</SelectItem>
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
        
        <Button onClick={onAddManualIdea}>
          <Plus className="h-4 w-4 mr-2" />
          Add Idea
        </Button>
      </div>
    </div>
  );
};

export default SavedIdeasHeader;
