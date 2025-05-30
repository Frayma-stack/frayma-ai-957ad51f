
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';

interface AuthorFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

const AuthorFormActions: FC<AuthorFormActionsProps> = ({ onCancel, onSave, isSaving = false }) => {
  
  const handleSaveClick = () => {
    console.log('💾 AuthorFormActions.handleSaveClick - BUTTON CLICKED');
    console.log('💾 isSaving state:', isSaving);
    console.log('💾 onSave function type:', typeof onSave);
    console.log('💾 About to call onSave...');
    onSave();
  };

  const handleCancelClick = () => {
    console.log('💾 AuthorFormActions.handleCancelClick - CANCEL CLICKED');
    onCancel();
  };

  return (
    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
      <Button variant="outline" onClick={handleCancelClick} disabled={isSaving}>
        Cancel
      </Button>
      <Button 
        className="bg-story-blue hover:bg-story-light-blue"
        onClick={handleSaveClick}
        disabled={isSaving}
      >
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Author'
        )}
      </Button>
    </CardFooter>
  );
};

export default AuthorFormActions;
