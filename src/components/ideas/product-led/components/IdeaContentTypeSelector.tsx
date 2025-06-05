
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Mail, MessageSquare, Users, Plus } from 'lucide-react';

interface IdeaContentTypeSelectorProps {
  tempId: string;
  onContentTypeSelect: (tempId: string, contentType: string) => void;
  icpId: string;
  selectedClientId?: string;
}

const IdeaContentTypeSelector: FC<IdeaContentTypeSelectorProps> = ({
  tempId,
  onContentTypeSelect,
  icpId,
  selectedClientId
}) => {
  const contentTypes = [
    {
      type: 'article',
      title: 'GTM Article',
      icon: FileText,
      color: 'bg-blue-500',
      badge: 'Premium'
    },
    {
      type: 'linkedin',
      title: 'LinkedIn Post',
      icon: MessageSquare,
      color: 'bg-blue-600',
      badge: 'Social'
    },
    {
      type: 'email',
      title: 'Email Content',
      icon: Mail,
      color: 'bg-green-500',
      badge: 'Direct'
    },
    {
      type: 'custom',
      title: 'Custom Content',
      icon: Plus,
      color: 'bg-purple-500',
      badge: 'Flexible'
    },
    {
      type: 'success-story',
      title: 'Success Story',
      icon: Users,
      color: 'bg-orange-500',
      badge: 'Proof'
    }
  ];

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">Create Content From This Idea:</h4>
      <div className="grid grid-cols-2 gap-2">
        {contentTypes.map((contentType) => {
          const Icon = contentType.icon;
          return (
            <Button
              key={contentType.type}
              variant="outline"
              size="sm"
              onClick={() => onContentTypeSelect(tempId, contentType.type)}
              className="flex items-center space-x-2 h-auto p-3 justify-start hover:bg-gray-50"
            >
              <div className={`p-1 rounded ${contentType.color}`}>
                <Icon className="h-3 w-3 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="text-xs font-medium">{contentType.title}</div>
              </div>
              <Badge variant="secondary" className="text-xs">
                {contentType.badge}
              </Badge>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default IdeaContentTypeSelector;
