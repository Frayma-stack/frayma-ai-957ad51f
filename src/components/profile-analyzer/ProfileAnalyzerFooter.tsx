
import { FC } from 'react';
import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from 'lucide-react';

interface ProfileAnalyzerFooterProps {
  isAnalyzing: boolean;
  onClose: () => void;
  onAnalyze: () => void;
}

const ProfileAnalyzerFooter: FC<ProfileAnalyzerFooterProps> = ({ 
  isAnalyzing, 
  onClose, 
  onAnalyze 
}) => {
  return (
    <CardFooter className="flex justify-end space-x-2 border-t pt-4">
      <Button variant="outline" onClick={onClose} disabled={isAnalyzing}>
        Cancel
      </Button>
      <Button 
        className="bg-story-blue hover:bg-story-light-blue"
        onClick={onAnalyze}
        disabled={isAnalyzing}
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing Profile...
          </>
        ) : (
          'Analyze & Auto-Fill'
        )}
      </Button>
    </CardFooter>
  );
};

export default ProfileAnalyzerFooter;
