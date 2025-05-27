
import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, Mail, MessageSquare, Settings, ChevronDown } from 'lucide-react';
import { GeneratedIdea } from '@/types/ideas';

interface IdeaContentActionsProps {
  idea: GeneratedIdea;
  onContentTypeSelect: (ideaId: string, contentType: string) => void;
}

const IdeaContentActions: FC<IdeaContentActionsProps> = ({
  idea,
  onContentTypeSelect
}) => {
  const contentTypes = [
    {
      key: 'article',
      label: 'GTM Narrative Piece',
      icon: FileText,
      description: 'Create a structured article'
    },
    {
      key: 'email',
      label: 'Sales Email',
      icon: Mail,
      description: 'Craft a compelling email'
    },
    {
      key: 'linkedin',
      label: 'LinkedIn Post',
      icon: MessageSquare,
      description: 'Create social content'
    },
    {
      key: 'custom',
      label: 'Custom Content',
      icon: Settings,
      description: 'Custom GTM narrative'
    }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="default" 
          size="sm"
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Auto-Craft Content
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {contentTypes.map((type) => {
          const IconComponent = type.icon;
          return (
            <DropdownMenuItem
              key={type.key}
              onClick={() => onContentTypeSelect(idea.id, type.key)}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <IconComponent className="h-4 w-4" />
              <div className="flex flex-col">
                <span className="font-medium">{type.label}</span>
                <span className="text-xs text-gray-500">{type.description}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default IdeaContentActions;
