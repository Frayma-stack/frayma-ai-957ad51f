
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash } from 'lucide-react';
import { ICPStoryScript } from '@/types/storytelling';

interface ICPScriptCardProps {
  script: ICPStoryScript;
  onEdit: (script: ICPStoryScript) => void;
  onDelete: (script: ICPStoryScript) => void;
}

const ICPScriptCard: FC<ICPScriptCardProps> = ({ script, onEdit, onDelete }) => {
  const formatItemsList = (items: { id: string; content: string }[]): string => {
    return items
      .filter(item => item.content.trim() !== '')
      .map(item => item.content)
      .join(', ');
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 p-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{script.name}</CardTitle>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onEdit(script)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onDelete(script)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2 text-sm">
          {script.internalPains && script.internalPains.length > 0 && (
            <div>
              <span className="font-semibold">Internal Pains:</span>
              <p className="text-gray-700 line-clamp-2">{formatItemsList(script.internalPains)}</p>
            </div>
          )}
          {script.externalStruggles && script.externalStruggles.length > 0 && (
            <div>
              <span className="font-semibold">External Struggles:</span>
              <p className="text-gray-700 line-clamp-2">{formatItemsList(script.externalStruggles)}</p>
            </div>
          )}
          {script.desiredTransformations && script.desiredTransformations.length > 0 && (
            <div>
              <span className="font-semibold">Desired Transformations:</span>
              <p className="text-gray-700 line-clamp-2">{formatItemsList(script.desiredTransformations)}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ICPScriptCard;
