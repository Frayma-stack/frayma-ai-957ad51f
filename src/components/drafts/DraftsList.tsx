
import { FC } from 'react';
import DraftCard from './DraftCard';
import DraftsEmptyState from './DraftsEmptyState';

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

interface DraftsListProps {
  drafts: Draft[];
  onCreateDraft: () => void;
  onEditDraft: (draftId: string) => void;
  onDeleteDraft: (draftId: string) => void;
}

const DraftsList: FC<DraftsListProps> = ({ 
  drafts, 
  onCreateDraft, 
  onEditDraft, 
  onDeleteDraft 
}) => {
  if (drafts.length === 0) {
    return <DraftsEmptyState onCreateDraft={onCreateDraft} />;
  }

  return (
    <div className="space-y-4">
      {drafts.map((draft) => (
        <DraftCard
          key={draft.id}
          draft={draft}
          onEdit={onEditDraft}
          onDelete={onDeleteDraft}
        />
      ))}
    </div>
  );
};

export default DraftsList;
