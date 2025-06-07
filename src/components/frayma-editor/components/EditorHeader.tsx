
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Save, 
  Download, 
  MessageSquare, 
  Users, 
  Sidebar, 
  Sparkles,
  HelpCircle,
  FileText,
  Share
} from 'lucide-react';
import { FraymaDocument, Collaborator } from '../types';

interface EditorHeaderProps {
  document: FraymaDocument;
  isSaving: boolean;
  lastSaved: Date | null;
  users: Collaborator[];
  onToggleOutline: () => void;
  onToggleAISuggestions: () => void;
  onToggleComments: () => void;
  onExport?: (format: 'markdown' | 'docx' | 'googledocs') => void;
  onShowOnboarding: () => void;
}

export const EditorHeader: React.FC<EditorHeaderProps> = ({
  document,
  isSaving,
  lastSaved,
  users,
  onToggleOutline,
  onToggleAISuggestions,
  onToggleComments,
  onExport,
  onShowOnboarding
}) => {
  const activeUsers = users.filter(user => user.isActive);

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div>
          <h1 className="text-lg font-semibold text-gray-900">{document.title}</h1>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            {isSaving ? (
              <span className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse mr-2" />
                Saving...
              </span>
            ) : lastSaved ? (
              <span>Saved {lastSaved.toLocaleTimeString()}</span>
            ) : (
              <span>Draft</span>
            )}
            <span>•</span>
            <span>{document.metadata.wordCount} words</span>
            <span>•</span>
            <span>{document.metadata.readingTime} min read</span>
          </div>
        </div>
      </div>

      {/* Center Section - Active Users */}
      <div className="flex items-center space-x-2">
        {activeUsers.slice(0, 5).map((user, index) => (
          <Avatar key={user.id} className="w-8 h-8 border-2" style={{ borderColor: `hsl(${index * 60}, 70%, 50%)` }}>
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ))}
        {activeUsers.length > 5 && (
          <Badge variant="outline">+{activeUsers.length - 5}</Badge>
        )}
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onShowOnboarding}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleOutline}
        >
          <Sidebar className="h-4 w-4" />
          Outline
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleAISuggestions}
        >
          <Sparkles className="h-4 w-4" />
          AI Assist
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleComments}
        >
          <MessageSquare className="h-4 w-4" />
          Comments
        </Button>

        <Button variant="outline" size="sm">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>

        <Button variant="outline" size="sm" onClick={() => onExport?.('markdown')}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>

        <Button className="bg-brand-primary hover:bg-brand-primary/90">
          <FileText className="h-4 w-4 mr-2" />
          Publish
        </Button>
      </div>
    </div>
  );
};
