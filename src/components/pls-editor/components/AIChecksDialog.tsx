import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';

interface AIChecksDialogProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  onHighlightErrors: (errors: Array<{ text: string; type: string; suggestion: string }>) => void;
}

const AIChecksDialog: FC<AIChecksDialogProps> = ({
  isOpen,
  onClose,
  content,
  onHighlightErrors
}) => {
  const [selectedCheckType, setSelectedCheckType] = useState<'grammar' | '3rs' | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<any>(null);

  const handleRunCheck = async (type: 'grammar' | '3rs') => {
    setSelectedCheckType(type);
    setIsRunning(true);
    
    try {
      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockResults = type === 'grammar' ? {
        type: 'Grammar & Syntax',
        issues: [
          { text: 'example text', type: 'grammar', suggestion: 'Fix grammar here' },
          { text: 'another example', type: 'syntax', suggestion: 'Fix syntax here' }
        ]
      } : {
        type: '3Rs Analysis',
        resonance: 85,
        relevance: 92,
        results: 78,
        issues: [
          { text: 'low resonance section', type: 'resonance', suggestion: 'Add more emotional connection' }
        ]
      };
      
      setResults(mockResults);
      onHighlightErrors(mockResults.issues);
    } catch (error) {
      console.error('Error running AI checks:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const resetDialog = () => {
    setSelectedCheckType(null);
    setResults(null);
    setIsRunning(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        resetDialog();
        onClose();
      }
    }}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI Content Checks</DialogTitle>
        </DialogHeader>

        {!selectedCheckType && !results && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Choose the type of analysis you want to run on your content:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRunCheck('grammar')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <h3 className="font-semibold">Grammar & Syntax</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Check for grammatical errors, spelling mistakes, and syntax issues in your content.
                  </p>
                </CardContent>
              </Card>

              <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleRunCheck('3rs')}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-3">
                    <AlertTriangle className="h-6 w-6 text-orange-600" />
                    <h3 className="font-semibold">3Rs Analysis</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Analyze Resonance, Relevance, and Results flow throughout your draft.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {isRunning && (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Running {selectedCheckType === 'grammar' ? 'Grammar & Syntax' : '3Rs'} analysis...
            </p>
          </div>
        )}

        {results && (
          <div className="space-y-4">
            <h3 className="font-semibold">{results.type} Results</h3>
            
            {results.type === '3Rs Analysis' && (
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{results.resonance}%</div>
                  <div className="text-xs text-muted-foreground">Resonance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{results.relevance}%</div>
                  <div className="text-xs text-muted-foreground">Relevance</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{results.results}%</div>
                  <div className="text-xs text-muted-foreground">Results</div>
                </div>
              </div>
            )}

            {results.issues.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">Issues Found ({results.issues.length})</h4>
                <div className="space-y-2">
                  {results.issues.map((issue: any, index: number) => (
                    <div key={index} className="border rounded p-3 text-sm">
                      <div className="font-medium text-red-600">{issue.text}</div>
                      <div className="text-muted-foreground mt-1">{issue.suggestion}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Issues have been highlighted in red within the editor.
                </p>
              </div>
            ) : (
              <div className="text-center py-4">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No issues found! Your content looks great.</p>
              </div>
            )}

            <div className="flex justify-between">
              <Button variant="outline" onClick={resetDialog}>
                Run Another Check
              </Button>
              <Button onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AIChecksDialog;