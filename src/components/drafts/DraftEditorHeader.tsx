
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save, Download, Copy } from 'lucide-react';

interface DraftEditorHeaderProps {
  hasChanges: boolean;
  onBack: () => void;
  onSave: () => void;
  onCopy: () => void;
  onDownload: () => void;
}

const DraftEditorHeader: FC<DraftEditorHeaderProps> = ({
  hasChanges,
  onBack,
  onSave,
  onCopy,
  onDownload
}) => {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onBack}>
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Drafts
      </Button>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCopy}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <Button variant="outline" onClick={onDownload}>
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button 
          onClick={onSave} 
          disabled={!hasChanges}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default DraftEditorHeader;
