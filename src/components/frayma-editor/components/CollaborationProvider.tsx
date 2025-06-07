
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Collaborator } from '../types';

interface CollaborationContextType {
  users: Collaborator[];
  isConnected: boolean;
  sendCursorUpdate: (position: number) => void;
}

const CollaborationContext = createContext<CollaborationContextType | undefined>(undefined);

interface CollaborationProviderProps {
  documentId: string;
  editor: Editor;
  children: React.ReactNode;
}

export const CollaborationProvider: React.FC<CollaborationProviderProps> = ({
  documentId,
  editor,
  children
}) => {
  const [users, setUsers] = useState<Collaborator[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // This would integrate with your real-time collaboration service
  // For now, simulating with mock data
  useEffect(() => {
    // Mock users for demonstration
    setUsers([
      {
        id: 'user-1',
        name: 'Sarah Chen',
        email: 'sarah@example.com',
        role: 'editor',
        isActive: true,
        cursor: { position: 0 }
      },
      {
        id: 'user-2',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        role: 'viewer',
        isActive: true,
        cursor: { position: 150 }
      }
    ]);
    setIsConnected(true);
  }, [documentId]);

  // Handle cursor updates
  const sendCursorUpdate = (position: number) => {
    // This would send cursor position to other collaborators
    console.log('Cursor update:', position);
  };

  // Listen to editor selection changes
  useEffect(() => {
    if (!editor) return;

    const handleSelectionUpdate = () => {
      const { from } = editor.state.selection;
      sendCursorUpdate(from);
    };

    editor.on('selectionUpdate', handleSelectionUpdate);
    return () => editor.off('selectionUpdate', handleSelectionUpdate);
  }, [editor]);

  const value = {
    users,
    isConnected,
    sendCursorUpdate
  };

  return (
    <CollaborationContext.Provider value={value}>
      {children}
    </CollaborationContext.Provider>
  );
};

export const useCollaboration = () => {
  const context = useContext(CollaborationContext);
  if (!context) {
    throw new Error('useCollaboration must be used within CollaborationProvider');
  }
  return context;
};
