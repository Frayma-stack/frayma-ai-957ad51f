
import { FC } from 'react';

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

interface DraftInfoDisplayProps {
  draft: Draft;
}

const DraftInfoDisplay: FC<DraftInfoDisplayProps> = ({ draft }) => {
  return (
    <div className="text-xs text-gray-500 border-t pt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p>Created: {new Date(draft.createdAt).toLocaleString()}</p>
          <p>Created by: {draft.createdBy}</p>
        </div>
        <div>
          <p>Last updated: {new Date(draft.updatedAt).toLocaleString()}</p>
          {draft.lastEditedBy && (
            <p>Last edited by: {draft.lastEditedBy}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DraftInfoDisplay;
