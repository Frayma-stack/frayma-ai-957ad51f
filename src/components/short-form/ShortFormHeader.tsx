
import { FC } from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

interface ShortFormHeaderProps {
  contentType: 'email' | 'linkedin' | 'custom';
  clientName: string | null;
  onBack: () => void;
}

const ShortFormHeader: FC<ShortFormHeaderProps> = ({
  contentType,
  clientName,
  onBack
}) => {
  const getContentTypeLabel = () => {
    switch (contentType) {
      case 'email': return 'Sales Email';
      case 'linkedin': return 'LinkedIn Post';
      case 'custom': return 'Custom Content';
      default: return 'Content';
    }
  };

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle className="text-story-blue">Create {getContentTypeLabel()}</CardTitle>
          <CardDescription>
            Quick-generate high-performing content
            {clientName && (
              <span className="ml-1 bg-story-blue/10 px-2 py-0.5 rounded-full text-xs text-story-blue">
                <Users className="inline h-3 w-3 mr-1" />
                {clientName}
              </span>
            )}
          </CardDescription>
        </div>
        <Button variant="outline" onClick={onBack}>Back to Content Types</Button>
      </div>
    </CardHeader>
  );
};

export default ShortFormHeader;
