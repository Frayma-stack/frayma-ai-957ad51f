
import { useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Heading from '@tiptap/extension-heading';
import Paragraph from '@tiptap/extension-paragraph';
import Typography from '@tiptap/extension-typography';
import { UserRole } from '../types';

interface UseEditorExtensionsProps {
  documentId: string;
  userRole: UserRole;
  onBlockSelect: (blockId: string) => void;
}

export const useEditorExtensions = ({
  documentId,
  userRole,
  onBlockSelect
}: UseEditorExtensionsProps) => {
  
  const extensions = [
    StarterKit.configure({
      history: false, // Disabled for collaboration
      heading: false, // We'll configure this separately
      paragraph: false, // We'll configure this separately
    }),
    
    // Enhanced heading with PLS-specific classes
    Heading.configure({
      levels: [1, 2, 3, 4, 5, 6],
      HTMLAttributes: {
        class: 'pls-heading',
      },
    }),
    
    // Enhanced paragraph with proper spacing
    Paragraph.configure({
      HTMLAttributes: {
        class: 'pls-paragraph',
      },
    }),
    
    // Typography improvements for PLS content
    Typography.configure({
      openDoubleQuote: '"',
      closeDoubleQuote: '"',
      openSingleQuote: "'",
      closeSingleQuote: "'",
      emDash: '—',
      ellipsis: '…',
    }),
    
    Underline,
    
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'pls-link',
      },
    }),
    
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          if (node.attrs.level === 1) return 'Main Headline - Start with a Relatable Hook...';
          if (node.attrs.level === 2) return 'Section Header - Focus on Real Problems or Remarkable Solutions...';
          if (node.attrs.level === 3) return 'Subsection - Break down complex ideas...';
          return 'Heading - Use clear, scannable structure...';
        }
        return 'Write your PLS narrative here. Keep sentences clear and concise (15-18 words max). Focus on Relatable → Real → Remarkable → Results.';
      },
    }),
    
    CharacterCount.configure({
      mode: 'nodeSize',
    }),
  ];

  // Add collaboration extensions if needed
  if (userRole !== 'viewer') {
    // This would integrate with your real-time collaboration provider
    // extensions.push(
    //   Collaboration.configure({
    //     document: yDoc, // Y.js document
    //   }),
    //   CollaborationCursor.configure({
    //     provider: provider, // WebRTC or WebSocket provider
    //   })
    // );
  }

  return extensions;
};
