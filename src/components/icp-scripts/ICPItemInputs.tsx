
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash } from 'lucide-react';
import { ICPStoryScriptItem } from '@/types/storytelling';

interface ICPItemInputsProps {
  items: ICPStoryScriptItem[];
  title: string;
  placeholder: string;
  onItemChange: (id: string, content: string) => void;
  onAddItem: () => void;
  onRemoveItem: (id: string) => void;
}

const ICPItemInputs: FC<ICPItemInputsProps> = ({
  items,
  title,
  placeholder,
  onItemChange,
  onAddItem,
  onRemoveItem,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{title}</label>
        <Button 
          type="button"
          variant="ghost" 
          size="sm" 
          onClick={onAddItem}
        >
          <Plus className="h-4 w-4 mr-1" /> Add
        </Button>
      </div>
      
      {items.map((item, index) => (
        <div key={item.id} className="flex gap-2 items-start">
          <Textarea 
            placeholder={`${placeholder} #${index + 1}`}
            value={item.content}
            onChange={(e) => onItemChange(item.id, e.target.value)}
            rows={2}
            className="flex-1"
          />
          {items.length > 1 && (
            <Button 
              type="button"
              variant="ghost" 
              size="icon"
              onClick={() => onRemoveItem(item.id)}
              className="mt-1"
            >
              <Trash className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
    </div>
  );
};

export default ICPItemInputs;
