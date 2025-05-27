
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

interface DraftMetaFormProps {
  title: string;
  contentType: Draft['contentType'];
  status: Draft['status'];
  onTitleChange: (title: string) => void;
  onContentTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
}

const DraftMetaForm: FC<DraftMetaFormProps> = ({
  title,
  contentType,
  status,
  onTitleChange,
  onContentTypeChange,
  onStatusChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Input
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Draft title..."
        />
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Content Type</label>
        <Select value={contentType} onValueChange={onContentTypeChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gtm-narrative">GTM Narrative</SelectItem>
            <SelectItem value="sales-email">Sales Email</SelectItem>
            <SelectItem value="linkedin-post">LinkedIn Post</SelectItem>
            <SelectItem value="custom">Custom Content</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="in-review">In Review</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DraftMetaForm;
