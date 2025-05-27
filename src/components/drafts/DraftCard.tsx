
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Clock, User } from 'lucide-react';

interface Draft {
  id: string;
  title: string;
  contentType: 'gtm-narrative' | 'sales-email' | 'linkedin-post' | 'custom';
  content: string;
  status: 'draft' | 'in-review' | 'completed';
  clientId: string;
  authorId?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  lastEditedBy?: string;
}

interface DraftCardProps {
  draft: Draft;
  onEdit: (draftId: string) => void;
  onDelete: (draftId: string) => void;
}

const DraftCard: FC<DraftCardProps> = ({ draft, onEdit, onDelete }) => {
  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'gtm-narrative': return 'GTM Narrative';
      case 'sales-email': return 'Sales Email';
      case 'linkedin-post': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-medium text-gray-900">{draft.title}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(draft.status)}`}>
                {draft.status.replace('-', ' ')}
              </span>
              <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                {getContentTypeLabel(draft.contentType)}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {draft.content ? `${draft.content.substring(0, 150)}...` : 'No content yet'}
            </p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Created {new Date(draft.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {draft.createdBy}
              </span>
              {draft.lastEditedBy && draft.lastEditedBy !== draft.createdBy && (
                <span>• Last edited by {draft.lastEditedBy}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 ml-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onEdit(draft.id)}
              className="hover:bg-blue-50"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onDelete(draft.id)}
              className="hover:bg-red-50 hover:text-red-600"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DraftCard;
