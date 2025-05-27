
import { FC, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import DraftEditor from './DraftEditor';
import DraftsHeader from './DraftsHeader';
import DraftsList from './DraftsList';
import ClientSelectionPrompt from './ClientSelectionPrompt';
import LoadingState from './LoadingState';

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

interface DraftsManagerProps {
  selectedClientId?: string;
}

const DraftsManager: FC<DraftsManagerProps> = ({ selectedClientId }) => {
  const { toast } = useToast();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);

  // Mock data for now - in the future this would come from Supabase
  useEffect(() => {
    setIsLoading(true);
    // Simulate loading time
    setTimeout(() => {
      if (selectedClientId) {
        // Mock some drafts for the selected client
        setDrafts([
          {
            id: '1',
            title: 'GTM Strategy Q1 2024',
            contentType: 'gtm-narrative',
            content: 'This is a draft of our go-to-market narrative focusing on enterprise customers...',
            status: 'draft',
            clientId: selectedClientId,
            createdAt: new Date(Date.now() - 86400000).toISOString(),
            updatedAt: new Date(Date.now() - 3600000).toISOString(),
            createdBy: 'John Doe',
            lastEditedBy: 'Jane Smith'
          },
          {
            id: '2',
            title: 'Product Launch Email Campaign',
            contentType: 'sales-email',
            content: 'Subject: Introducing our latest innovation... Dear [Name], We are excited to announce...',
            status: 'in-review',
            clientId: selectedClientId,
            createdAt: new Date(Date.now() - 172800000).toISOString(),
            updatedAt: new Date(Date.now() - 7200000).toISOString(),
            createdBy: 'Alice Johnson'
          }
        ]);
      } else {
        setDrafts([]);
      }
      setIsLoading(false);
    }, 500);
  }, [selectedClientId]);

  const handleCreateDraft = () => {
    // Create a new draft
    const newDraft: Draft = {
      id: Date.now().toString(),
      title: 'New Draft',
      contentType: 'custom',
      content: '',
      status: 'draft',
      clientId: selectedClientId || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Current User'
    };
    
    setDrafts(prev => [newDraft, ...prev]);
    setEditingDraft(newDraft);
    
    toast({
      title: "Draft Created",
      description: "New draft has been created and is ready for editing.",
    });
  };

  const handleEditDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setEditingDraft(draft);
    }
  };

  const handleSaveDraft = (updatedDraft: Draft) => {
    setDrafts(prev => prev.map(draft => 
      draft.id === updatedDraft.id ? updatedDraft : draft
    ));
    
    toast({
      title: "Draft Updated",
      description: "Your changes have been saved successfully.",
    });
  };

  const handleBackToList = () => {
    setEditingDraft(null);
  };

  const handleDeleteDraft = (draftId: string) => {
    if (confirm('Are you sure you want to delete this draft?')) {
      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      toast({
        title: "Draft Deleted",
        description: "The draft has been successfully deleted.",
      });
    }
  };

  // If editing a draft, show the editor
  if (editingDraft) {
    return (
      <DraftEditor
        draft={editingDraft}
        onSave={handleSaveDraft}
        onBack={handleBackToList}
      />
    );
  }

  if (!selectedClientId) {
    return <ClientSelectionPrompt />;
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <DraftsHeader onCreateDraft={handleCreateDraft} />
      <CardContent>
        <DraftsList
          drafts={drafts}
          onCreateDraft={handleCreateDraft}
          onEditDraft={handleEditDraft}
          onDeleteDraft={handleDeleteDraft}
        />
      </CardContent>
    </Card>
  );
};

export default DraftsManager;
