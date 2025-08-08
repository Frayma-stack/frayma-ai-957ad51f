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
  onInsertElement?: (element: string) => void;
}

const EditorToolbar: FC<EditorToolbarProps> = ({ selectedText, onTextUpdate, onInsertElement }) => {
  const applyFormatting = (format: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const selectedContent = range.toString();
    
    if (!selectedContent) return;

    let formattedElement: HTMLElement;
    
    switch (format) {
      case 'bold':
        formattedElement = document.createElement('strong');
        break;
      case 'italic':
        formattedElement = document.createElement('em');
        break;
      case 'underline':
        formattedElement = document.createElement('u');
        break;
      case 'strikethrough':
        formattedElement = document.createElement('s');
        break;
      case 'quote':
        formattedElement = document.createElement('blockquote');
        formattedElement.style.borderLeft = '3px solid hsl(var(--border))';
        formattedElement.style.paddingLeft = '16px';
        formattedElement.style.margin = '24px 0';
        formattedElement.style.fontStyle = 'italic';
        formattedElement.style.color = 'hsl(var(--muted-foreground))';
        break;
      case 'code':
        formattedElement = document.createElement('code');
        formattedElement.style.backgroundColor = 'hsl(var(--muted))';
        formattedElement.style.padding = '2px 4px';
        formattedElement.style.borderRadius = '3px';
        formattedElement.style.fontFamily = 'Monaco, Menlo, Ubuntu Mono, monospace';
        formattedElement.style.fontSize = '15px';
        break;
      case 'superscript':
        formattedElement = document.createElement('sup');
        break;
      case 'subscript':
        formattedElement = document.createElement('sub');
        break;
      default:
        return;
    }

    formattedElement.textContent = selectedContent;
    range.deleteContents();
    range.insertNode(formattedElement);
    
    // Clear selection
    selection.removeAllRanges();
    
    // Update the content
    const editor = document.querySelector('.pls-editor-content') as HTMLElement;
    if (editor && onTextUpdate) {
      onTextUpdate(editor.innerHTML);
    }
  };

  const insertElement = (element: string) => {
    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let insertElement: HTMLElement;

    switch (element) {
      case 'bullet':
        insertElement = document.createElement('ul');
        const listItem = document.createElement('li');
        listItem.textContent = 'New list item';
        insertElement.appendChild(listItem);
        break;
      case 'numbered':
        insertElement = document.createElement('ol');
        const numberedItem = document.createElement('li');
        numberedItem.textContent = 'New numbered item';
        insertElement.appendChild(numberedItem);
        break;
      case 'hr':
        insertElement = document.createElement('hr');
        insertElement.style.border = 'none';
        insertElement.style.borderTop = '1px solid hsl(var(--border))';
        insertElement.style.margin = '36px 0';
        break;
      case 'link':
        insertElement = document.createElement('a');
        insertElement.textContent = selectedText || 'Link text';
        insertElement.setAttribute('href', 'https://');
        insertElement.style.color = 'hsl(var(--primary))';
        insertElement.style.textDecoration = 'underline';
        break;
      default:
        return;
    }

    range.insertNode(insertElement);
    selection.removeAllRanges();
    
    // Update the content
    const editor = document.querySelector('.pls-editor-content') as HTMLElement;
    if (editor && onTextUpdate) {
      onTextUpdate(editor.innerHTML);
    }
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