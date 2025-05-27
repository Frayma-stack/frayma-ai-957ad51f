
import { FC } from 'react';
import { Textarea } from "@/components/ui/textarea";

interface DraftContentEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const DraftContentEditor: FC<DraftContentEditorProps> = ({
  content,
  onContentChange
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Content</label>
      <Textarea
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        className="min-h-[500px] font-mono text-sm"
        placeholder="Start writing your content here..."
      />
    </div>
  );
};

export default DraftContentEditor;
