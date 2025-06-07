
import React from 'react';
import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Sparkles,
  Plus,
  Wand2
} from 'lucide-react';
import { UserRole } from '../types';

interface EditorToolbarProps {
  editor: Editor;
  onAISuggestion: (type: string, content: string) => void;
  userRole: UserRole;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  onAISuggestion,
  userRole
}) => {
  if (userRole === 'viewer') {
    return null;
  }

  const handleCommand = (command: string) => {
    const selectedText = editor.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to
    );

    switch (command) {
      case 'rewrite':
        onAISuggestion('rewrite', selectedText);
        break;
      case 'insert_cta':
        onAISuggestion('insert_cta', '');
        break;
      case 'suggest_visual':
        onAISuggestion('suggest_visual', selectedText);
        break;
      default:
        break;
    }
  };

  return (
    <div className="flex items-center space-x-1 p-2 border-b border-gray-200 mb-4">
      {/* Text Formatting */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'bg-gray-200' : ''}
      >
        <Bold className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'bg-gray-200' : ''}
      >
        <Italic className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={editor.isActive('underline') ? 'bg-gray-200' : ''}
      >
        <Underline className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Headings */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
      >
        <Heading1 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
      >
        <Heading2 className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
      >
        <Heading3 className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* Lists */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
      >
        <List className="h-4 w-4" />
      </Button>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
      >
        <ListOrdered className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
      >
        <Quote className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive('code') ? 'bg-gray-200' : ''}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      {/* AI Commands */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCommand('rewrite')}
        className="text-blue-600"
      >
        <Wand2 className="h-4 w-4 mr-1" />
        Rewrite
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCommand('insert_cta')}
        className="text-green-600"
      >
        <Plus className="h-4 w-4 mr-1" />
        CTA
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleCommand('suggest_visual')}
        className="text-purple-600"
      >
        <Sparkles className="h-4 w-4 mr-1" />
        Visual
      </Button>
    </div>
  );
};
