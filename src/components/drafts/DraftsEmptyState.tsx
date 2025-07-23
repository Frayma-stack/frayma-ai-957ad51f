
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { FileText, Plus } from 'lucide-react';

interface DraftsEmptyStateProps {
  onCreateDraft: () => void;
}

const DraftsEmptyState: FC<DraftsEmptyStateProps> = ({ onCreateDraft }) => {
  return (
    <div className="text-center py-8 border border-dashed rounded-md">
      <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
      <p className="text-gray-500 mb-2">No drafts yet</p>
      <p className="text-gray-400 text-sm mb-4">
        Create a GTM asset that you can save as a draft for further editing
      </p>
      <Button 
        variant="outline" 
        onClick={onCreateDraft}
        className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        Create GTM Asset
      </Button>
    </div>
  );
};

export default DraftsEmptyState;
