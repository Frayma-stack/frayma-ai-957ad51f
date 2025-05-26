
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Check, Trash2, Edit } from 'lucide-react';

interface IdeaItemProps {
  idea: string;
  onDelete: (idea: string) => void;
  onEdit: (idea: string) => void;
  onCopyToClipboard: (idea: string) => void;
}

const IdeaItem: FC<IdeaItemProps> = ({ idea, onDelete, onEdit, onCopyToClipboard }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedIdea, setEditedIdea] = useState(idea);

  const handleSave = () => {
    onEdit(editedIdea);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-md bg-gray-50 border border-gray-200">
      {isEditing ? (
        <Textarea
          value={editedIdea}
          onChange={(e) => setEditedIdea(e.target.value)}
          className="w-full mr-2"
        />
      ) : (
        <p className="text-sm text-gray-800">{idea}</p>
      )}
      <div>
        {isEditing ? (
          <>
            <Button variant="ghost" size="icon" onClick={handleSave}>
              <Check className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button variant="ghost" size="icon" onClick={() => onCopyToClipboard(idea)}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(idea)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default IdeaItem;
