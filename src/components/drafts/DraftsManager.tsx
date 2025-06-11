
import { FC, useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DraftEditor from './DraftEditor';
import DraftsHeader from './DraftsHeader';
import DraftsList from './DraftsList';
import ClientSelectionPrompt from './ClientSelectionPrompt';
import LoadingState from './LoadingState';
import { ContentEditorWithFrayma } from '@/components/content-editor/ContentEditorWithFrayma';

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
  const { user } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingDraft, setEditingDraft] = useState<Draft | null>(null);
  const [showPLSEditor, setShowPLSEditor] = useState(false);

  // Load drafts from Supabase
  useEffect(() => {
    const loadDrafts = async () => {
      if (!user || !selectedClientId) {
        setDrafts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('drafts')
          .select('*')
          .eq('user_id', user.id)
          .eq('client_id', selectedClientId)
          .order('updated_at', { ascending: false });

        if (error) throw error;

        const transformedDrafts: Draft[] = (data || []).map(draft => ({
          id: draft.id,
          title: draft.title,
          contentType: draft.content_type as Draft['contentType'],
          content: draft.content,
          status: draft.status as Draft['status'],
          clientId: draft.client_id,
          authorId: draft.author_id || undefined,
          createdAt: draft.created_at,
          updatedAt: draft.updated_at,
          createdBy: draft.created_by,
          lastEditedBy: draft.last_edited_by || undefined
        }));

        setDrafts(transformedDrafts);
      } catch (error) {
        console.error('Failed to load drafts:', error);
        toast({
          title: "Error Loading Drafts",
          description: "Failed to load drafts from the database.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadDrafts();
  }, [selectedClientId, user]);

  const handleCreateDraft = () => {
    // Open the PLS-focused Text Editor for creating new drafts
    console.log('📝 Opening PLS-focused Text Editor for new draft');
    setShowPLSEditor(true);
  };

  const handlePLSEditorSave = async (updatedContent: string) => {
    if (!user || !selectedClientId) return;

    // Only save if content is substantial and different from template
    const templateStart = '# Your GTM Narrative Draft';
    if (!updatedContent.trim() || updatedContent.startsWith(templateStart)) {
      console.log('💾 Skipping save - content is empty or unchanged template');
      return;
    }

    try {
      const newDraftData = {
        title: `New Draft - ${new Date().toLocaleDateString()}`,
        content_type: 'gtm-narrative',
        content: updatedContent,
        status: 'draft',
        client_id: selectedClientId,
        user_id: user.id,
        created_by: user.email || 'Unknown User',
        last_edited_by: user.email || 'Unknown User'
      };

      const { data, error } = await supabase
        .from('drafts')
        .insert(newDraftData)
        .select()
        .single();

      if (error) throw error;

      const newDraft: Draft = {
        id: data.id,
        title: data.title,
        contentType: data.content_type as Draft['contentType'],
        content: data.content,
        status: data.status as Draft['status'],
        clientId: data.client_id,
        authorId: data.author_id || undefined,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
        createdBy: data.created_by,
        lastEditedBy: data.last_edited_by || undefined
      };

      setDrafts(prev => [newDraft, ...prev]);

      toast({
        title: "Draft Saved",
        description: "Your draft has been created and saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: "Error Saving Draft",
        description: "Failed to save your draft.",
        variant: "destructive",
      });
    }
  };

  const handleBackFromPLSEditor = () => {
    setShowPLSEditor(false);
  };

  const handleEditDraft = (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft) {
      setEditingDraft(draft);
    }
  };

  const handleSaveDraft = async (updatedDraft: Draft) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('drafts')
        .update({
          title: updatedDraft.title,
          content: updatedDraft.content,
          content_type: updatedDraft.contentType,
          status: updatedDraft.status,
          last_edited_by: user.email || 'Unknown User',
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedDraft.id);

      if (error) throw error;

      setDrafts(prev => prev.map(draft => 
        draft.id === updatedDraft.id ? updatedDraft : draft
      ));

      toast({
        title: "Draft Updated",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      console.error('Failed to save draft:', error);
      toast({
        title: "Error Saving Draft",
        description: "Failed to save your changes.",
        variant: "destructive",
      });
    }
  };

  const handleBackToList = () => {
    setEditingDraft(null);
  };

  const handleDeleteDraft = async (draftId: string) => {
    if (!confirm('Are you sure you want to delete this draft?')) return;

    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('id', draftId);

      if (error) throw error;

      setDrafts(prev => prev.filter(draft => draft.id !== draftId));
      
      toast({
        title: "Draft Deleted",
        description: "The draft has been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete draft:', error);
      toast({
        title: "Error Deleting Draft",
        description: "Failed to delete the draft.",
        variant: "destructive",
      });
    }
  };

  // Function to clear all drafts for current client
  const handleClearAllDrafts = async () => {
    if (!user || !selectedClientId) return;
    
    if (!confirm('Are you sure you want to delete ALL drafts for this client? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('drafts')
        .delete()
        .eq('user_id', user.id)
        .eq('client_id', selectedClientId);

      if (error) throw error;

      setDrafts([]);
      
      toast({
        title: "All Drafts Deleted",
        description: "All drafts have been successfully deleted.",
      });
    } catch (error) {
      console.error('Failed to delete all drafts:', error);
      toast({
        title: "Error Deleting Drafts",
        description: "Failed to delete all drafts.",
        variant: "destructive",
      });
    }
  };

  // If showing PLS Editor, render it
  if (showPLSEditor) {
    return (
      <ContentEditorWithFrayma
        initialContent=""
        contentType="gtm-narrative"
        contentTypeLabel="GTM Narrative Draft"
        onBack={handleBackFromPLSEditor}
        onContentChange={handlePLSEditorSave}
      />
    );
  }

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
      <DraftsHeader 
        onCreateDraft={handleCreateDraft}
        onClearAllDrafts={handleClearAllDrafts}
        draftsCount={drafts.length}
      />
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
