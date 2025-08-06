import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Link,
  Quote,
  Code,
  Superscript,
  Subscript,
  List,
  ListOrdered,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  RotateCcw
} from 'lucide-react';

interface EditorToolbarProps {
  selectedText: string;
  onTextUpdate: (newContent: string) => void;
}

const EditorToolbar: FC<EditorToolbarProps> = ({ selectedText, onTextUpdate }) => {
  const applyFormatting = (format: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.toString();
    
    let formattedText = selectedContent;
    
    switch (format) {
      case 'bold':
        formattedText = `**${selectedContent}**`;
        break;
      case 'italic':
        formattedText = `*${selectedContent}*`;
        break;
      case 'underline':
        formattedText = `<u>${selectedContent}</u>`;
        break;
      case 'strikethrough':
        formattedText = `~~${selectedContent}~~`;
        break;
      case 'quote':
        formattedText = `> ${selectedContent}`;
        break;
      case 'code':
        formattedText = `\`${selectedContent}\``;
        break;
      case 'superscript':
        formattedText = `<sup>${selectedContent}</sup>`;
        break;
      case 'subscript':
        formattedText = `<sub>${selectedContent}</sub>`;
        break;
      default:
        return;
    }

    // Replace the selected text with formatted text
    range.deleteContents();
    range.insertNode(document.createTextNode(formattedText));
    
    // Clear selection
    selection.removeAllRanges();
  };

  const insertElement = (element: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let insertText = '';

    switch (element) {
      case 'bullet':
        insertText = '\n• ';
        break;
      case 'numbered':
        insertText = '\n1. ';
        break;
      case 'hr':
        insertText = '\n\n---\n\n';
        break;
      case 'link':
        insertText = `[${selectedText}](https://)`;
        break;
      default:
        return;
    }

    range.insertNode(document.createTextNode(insertText));
    selection.removeAllRanges();
  };

  return (
    <div className="flex items-center space-x-1 bg-background border border-border rounded-lg px-2 py-1">
      {/* Alignment */}
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('align-left')}>
        <AlignLeft className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('align-center')}>
        <AlignCenter className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('align-right')}>
        <AlignRight className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      {/* Text Formatting */}
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('bold')}>
        <Bold className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('italic')}>
        <Italic className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('underline')}>
        <Underline className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('strikethrough')}>
        <Strikethrough className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      {/* Special Elements */}
      <Button variant="ghost" size="sm" onClick={() => insertElement('link')}>
        <Link className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('quote')}>
        <Quote className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('code')}>
        <Code className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      {/* Scripts */}
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('superscript')}>
        <Superscript className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('subscript')}>
        <Subscript className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      {/* Lists */}
      <Button variant="ghost" size="sm" onClick={() => insertElement('bullet')}>
        <List className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => insertElement('numbered')}>
        <ListOrdered className="h-4 w-4" />
      </Button>
      
      <div className="w-px h-6 bg-border mx-2" />
      
      {/* Horizontal Rule & Clear */}
      <Button variant="ghost" size="sm" onClick={() => insertElement('hr')}>
        <Minus className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => applyFormatting('clear')}>
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default EditorToolbar;