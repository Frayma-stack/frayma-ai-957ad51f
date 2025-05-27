
import { FC, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, Plus, Edit, Trash, Clock } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

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

  // Placeholder function for creating new draft
  const handleCreateDraft = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Draft creation will be available when content auto-crafting features are implemented.",
    });
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
              <Card key={draft.id} className="border border-gray-200">
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
                        {draft.content.substring(0, 150)}...
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Created {new Date(draft.createdAt).toLocaleDateString()}
                        </span>
                        <span>by {draft.createdBy}</span>
                        {draft.lastEditedBy && draft.lastEditedBy !== draft.createdBy && (
                          <span>• Last edited by {draft.lastEditedBy}</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 ml-4">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
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
