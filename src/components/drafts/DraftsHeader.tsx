
import { FC } from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface DraftsHeaderProps {
  onCreateDraft: () => void;
}

const DraftsHeader: FC<DraftsHeaderProps> = ({ onCreateDraft }) => {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <div>
        <CardTitle className="text-brand-primary">Drafts</CardTitle>
        <CardDescription>
          Manage uncompleted auto-crafted pieces and collaborate with your team
        </CardDescription>
      </div>
      <Button 
        className="bg-brand-primary hover:bg-brand-primary/90"
        onClick={onCreateDraft}
      >
        <Plus className="h-4 w-4 mr-2" />
        New Draft
      </Button>
    </CardHeader>
  );
};

export default DraftsHeader;
