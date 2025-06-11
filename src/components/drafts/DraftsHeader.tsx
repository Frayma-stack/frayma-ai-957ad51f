
import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface DraftsHeaderProps {
  onCreateDraft: () => void;
  onClearAllDrafts?: () => void;
  draftsCount?: number;
}

const DraftsHeader: React.FC<DraftsHeaderProps> = ({ 
  onCreateDraft, 
  onClearAllDrafts,
  draftsCount = 0 
}) => {
  return (
    <CardHeader>
      <div className="flex items-center justify-between">
        <CardTitle className="text-xl font-semibold">
          Content Drafts {draftsCount > 0 && `(${draftsCount})`}
        </CardTitle>
        <div className="flex items-center space-x-2">
          {draftsCount > 0 && onClearAllDrafts && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onClearAllDrafts}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
          <Button onClick={onCreateDraft} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Draft
          </Button>
        </div>
      </div>
    </CardHeader>
  );
};

export default DraftsHeader;
