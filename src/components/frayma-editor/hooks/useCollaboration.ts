
import { useState, useEffect } from 'react';
import { Editor } from '@tiptap/react';
import { Collaborator, Comment, CommentReply } from '../types';

interface UseCollaborationProps {
  documentId: string;
  editor: Editor | null;
}

export const useCollaboration = ({ documentId, editor }: UseCollaborationProps) => {
  const [users, setUsers] = useState<Collaborator[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // Mock collaboration data - in real implementation this would connect to Supabase/Firebase
  useEffect(() => {
    // Simulate connection
    setIsConnected(true);
    
    // Mock users
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

    // Mock comments
    setComments([
      {
        id: 'comment-1',
        content: 'This section could use more specific examples.',
        author: {
          id: 'user-1',
          name: 'Sarah Chen',
          email: 'sarah@example.com',
          role: 'editor',
          isActive: true
        },
        position: 100,
        resolved: false,
        replies: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]);
  }, [documentId]);

  const addComment = (content: string, position: number) => {
    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        role: 'editor',
        isActive: true
      },
      position,
      resolved: false,
      replies: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setComments(prev => [...prev, newComment]);
  };

  const resolveComment = (commentId: string) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, resolved: true }
          : comment
      )
    );
  };

  const replyToComment = (commentId: string, content: string) => {
    const newReply: CommentReply = {
      id: `reply-${Date.now()}`,
      content,
      author: {
        id: 'current-user',
        name: 'Current User',
        email: 'user@example.com',
        role: 'editor',
        isActive: true
      },
      createdAt: new Date().toISOString()
    };

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? { ...comment, replies: [...comment.replies, newReply] }
          : comment
      )
    );
  };

  return {
    users,
    comments,
    isConnected,
    addComment,
    resolveComment,
    replyToComment
  };
};
