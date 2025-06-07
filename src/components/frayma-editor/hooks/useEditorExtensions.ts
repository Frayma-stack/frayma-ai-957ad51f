
import { useCallback } from 'react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import CharacterCount from '@tiptap/extension-character-count';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
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
    }),
    Underline,
    Link.configure({
      openOnClick: false,
    }),
    Placeholder.configure({
      placeholder: 'Start writing your GTM article...',
    }),
    CharacterCount,
    // Custom extensions for smart blocks would go here
    // ResonanceBlock,
    // RelevanceBlock, 
    // ResultsBlock,
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
