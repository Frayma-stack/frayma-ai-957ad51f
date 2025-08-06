import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Heading1,
  Heading2,
  Heading3,
  Image,
  CheckCircle,
  Copy,
  Menu,
  Loader2
} from 'lucide-react';

interface FloatingMenuProps {
  onAddHeading: (level: number) => void;
  onAddVisual: () => void;
  onRunAIChecks: () => void;
  onCopyDraft: () => void;
  isGenerating?: boolean;
}

const FloatingMenu: FC<FloatingMenuProps> = ({
  onAddHeading,
  onAddVisual,
  onRunAIChecks,
  onCopyDraft,
  isGenerating = false
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-40">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="bg-background/95 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-64 p-3">
          <Card>
            <CardContent className="p-0 space-y-2">
              {/* Add Headings */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground px-2 py-1">Add Heading</p>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddHeading(2);
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Heading2 className="h-4 w-4 mr-1" />
                    H2
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddHeading(3);
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Heading3 className="h-4 w-4 mr-1" />
                    H3
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddHeading(4);
                      setIsOpen(false);
                    }}
                    className="flex-1"
                  >
                    <Heading1 className="h-3 w-3 mr-1" />
                    H4
                  </Button>
                </div>
              </div>

              <div className="border-t border-border my-2" />

              {/* Add Visual */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onAddVisual();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                <Image className="h-4 w-4 mr-2" />
                Add Visual
              </Button>

              {/* AI Checks */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRunAIChecks();
                  setIsOpen(false);
                }}
                disabled={isGenerating}
                className="w-full justify-start"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="h-4 w-4 mr-2" />
                )}
                Run AI Checks
              </Button>

              {/* Copy Draft */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onCopyDraft();
                  setIsOpen(false);
                }}
                className="w-full justify-start"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Entire Draft
              </Button>
            </CardContent>
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default FloatingMenu;