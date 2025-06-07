
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageSquare, Reply, Check, MoreHorizontal } from 'lucide-react';
import { Comment, CommentReply } from '../types';

interface CommentsSidebarProps {
  comments: Comment[];
  onAddComment: (content: string, position: number) => void;
  onResolveComment: (commentId: string) => void;
  onReplyToComment: (commentId: string, content: string) => void;
}

export const CommentsSidebar: React.FC<CommentsSidebarProps> = ({
  comments,
  onAddComment,
  onResolveComment,
  onReplyToComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment, 0); // Position would come from editor selection
      setNewComment('');
    }
  };

  const handleReply = (commentId: string) => {
    if (replyContent.trim()) {
      onReplyToComment(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const activeComments = comments.filter(comment => !comment.resolved);
  const resolvedComments = comments.filter(comment => comment.resolved);

  return (
    <div className="w-80 border-l bg-gray-50 p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <MessageSquare className="h-5 w-5 mr-2" />
            Comments ({activeComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="text-sm"
              rows={3}
            />
            <Button
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment.trim()}
              className="w-full"
            >
              Add Comment
            </Button>
          </div>

          {/* Active comments */}
          {activeComments.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Active Comments</h4>
              {activeComments.map((comment) => (
                <Card key={comment.id} className="border">
                  <CardContent className="p-3">
                    <div className="flex items-start space-x-3">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={comment.author.avatarUrl} />
                        <AvatarFallback className="text-xs">
                          {comment.author.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-xs font-medium text-gray-900">
                            {comment.author.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">
                          {comment.content}
                        </p>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setReplyingTo(comment.id)}
                            className="text-xs"
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onResolveComment(comment.id)}
                            className="text-xs text-green-600"
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Resolve
                          </Button>
                        </div>

                        {/* Replies */}
                        {comment.replies.length > 0 && (
                          <div className="mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                            {comment.replies.map((reply) => (
                              <div key={reply.id} className="flex items-start space-x-2">
                                <Avatar className="w-4 h-4">
                                  <AvatarImage src={reply.author.avatarUrl} />
                                  <AvatarFallback className="text-xs">
                                    {reply.author.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-1">
                                    <span className="text-xs font-medium">
                                      {reply.author.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {new Date(reply.createdAt).toLocaleDateString()}
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-700">
                                    {reply.content}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply input */}
                        {replyingTo === comment.id && (
                          <div className="mt-2 space-y-2">
                            <Textarea
                              placeholder="Write a reply..."
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              className="text-sm"
                              rows={2}
                            />
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                onClick={() => handleReply(comment.id)}
                                disabled={!replyContent.trim()}
                              >
                                Reply
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setReplyingTo(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Resolved comments - collapsed */}
          {resolvedComments.length > 0 && (
            <div className="pt-4 border-t">
              <details>
                <summary className="text-sm font-medium text-gray-600 cursor-pointer">
                  Resolved ({resolvedComments.length})
                </summary>
                <div className="mt-2 space-y-2">
                  {resolvedComments.map((comment) => (
                    <div key={comment.id} className="p-2 bg-gray-100 rounded text-sm text-gray-600">
                      <strong>{comment.author.name}:</strong> {comment.content}
                    </div>
                  ))}
                </div>
              </details>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
