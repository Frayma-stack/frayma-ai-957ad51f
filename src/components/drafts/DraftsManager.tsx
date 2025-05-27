
import { FC, useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Plus, Edit, Trash, Clock, User } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useSupabaseData } from '@/hooks/useSupabaseData';

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
    
    toast({
      title: "Draft Created",
      description: "New draft has been created and is ready for editing.",
    });
  };

  const handleEditDraft = (draftId: string) => {
    toast({
      title: "Opening Editor",
      description: "Draft editor functionality will be implemented when the Editor is complete.",
    });
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

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'gtm-narrative': return 'GTM Narrative';
      case 'sales-email': return 'Sales Email';
      case 'linkedin-post': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-review': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!selectedClientId) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="p-8 text-center">
          <Users className="mx-auto h-12 w-12 opacity-30 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
          <p className="text-gray-500">
            Please select a client from the sidebar to view and manage their drafts.
          </p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="w-full bg-white shadow-md">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-500">Loading drafts...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-brand-primary">Drafts</CardTitle>
          <CardDescription>
            Manage uncompleted auto-crafted pieces and collaborate with your team
          </CardDescription>
        </div>
        <Button 
          className="bg-brand-primary hover:bg-brand-primary/90"
          onClick={handleCreateDraft}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Draft
        </Button>
      </CardHeader>
      <CardContent>
        {drafts.length === 0 ? (
          <div className="text-center py-8 border border-dashed rounded-md">
            <FileText className="h-10 w-10 mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500 mb-2">No drafts yet</p>
            <p className="text-gray-400 text-sm mb-4">
              Drafts will be automatically saved here when you start creating content
            </p>
            <Button 
              variant="outline" 
              onClick={handleCreateDraft}
              className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create First Draft
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {drafts.map((draft) => (
              <Card key={draft.id} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-900">{draft.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(draft.status)}`}>
                          {draft.status.replace('-', ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {getContentTypeLabel(draft.contentType)}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {draft.content ? `${draft.content.substring(0, 150)}...` : 'No content yet'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {draft.createdBy}
                        </span>
                        {draft.lastEditedBy && draft.lastEditedBy !== draft.createdBy && (
                          <span>• Last edited by {draft.lastEditedBy}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditDraft(draft.id)}
                        className="hover:bg-blue-50"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DraftsManager;
