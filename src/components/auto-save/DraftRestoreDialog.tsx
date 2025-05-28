
import { FC, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2, Clock } from "lucide-react";

interface Draft {
  id: string;
  title: string;
  content: string;
  content_type: string;
  updated_at: string;
  client_id: string | null;
}

interface DraftRestoreDialogProps {
  isOpen: boolean;
  onClose: () => void;
  drafts: Draft[];
  onRestore: (draft: Draft) => void;
  onDelete: (draftId: string) => void;
}

const DraftRestoreDialog: FC<DraftRestoreDialogProps> = ({
  isOpen,
  onClose,
  drafts,
  onRestore,
  onDelete
}) => {
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const getContentPreview = (content: string) => {
    return content.length > 100 ? content.substring(0, 100) + '...' : content;
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedDraft(null);
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Restore Draft</DialogTitle>
          <DialogDescription>
            Select a draft to restore. This will replace your current content.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 h-[500px]">
          {/* Drafts List */}
          <div className="w-1/2 border-r pr-4">
            <ScrollArea className="h-full">
              <div className="space-y-2">
                {drafts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No drafts found
                  </div>
                ) : (
                  drafts.map((draft) => (
                    <div
                      key={draft.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedDraft?.id === draft.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedDraft(draft)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm truncate">
                          {draft.title}
                        </h4>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(draft.id);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">
                        {getContentPreview(draft.content)}
                      </p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatDate(draft.updated_at)}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Draft Preview */}
          <div className="w-1/2 pl-4">
            {selectedDraft ? (
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <h3 className="font-semibold mb-2">{selectedDraft.title}</h3>
                  <div className="flex gap-2 mb-4">
                    <Badge variant="secondary">{selectedDraft.content_type}</Badge>
                    <Badge variant="outline">
                      {formatDate(selectedDraft.updated_at)}
                    </Badge>
                  </div>
                </div>
                <ScrollArea className="flex-1 border rounded p-3">
                  <pre className="whitespace-pre-wrap text-sm">
                    {selectedDraft.content}
                  </pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">
                Select a draft to preview
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              if (selectedDraft) {
                onRestore(selectedDraft);
                onClose();
              }
            }}
            disabled={!selectedDraft}
          >
            Restore Draft
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DraftRestoreDialog;
