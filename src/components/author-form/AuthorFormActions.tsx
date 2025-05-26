
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { CardFooter } from "@/components/ui/card";

interface AuthorFormActionsProps {
  onCancel: () => void;
  onSave: () => void;
}

const AuthorFormActions: FC<AuthorFormActionsProps> = ({ onCancel, onSave }) => {
  return (
    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button 
        className="bg-story-blue hover:bg-story-light-blue"
        onClick={onSave}
      >
        Save Author
      </Button>
    </CardFooter>
  );
};

export default AuthorFormActions;
