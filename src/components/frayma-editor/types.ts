
export interface FraymaDocument {
  id: string;
  title: string;
  content: string;
  outline: DocumentSection[];
  context: DocumentContext;
  metadata: DocumentMetadata;
  collaborators: Collaborator[];
  comments: Comment[];
  version: number;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentSection {
  id: string;
  type: 'resonance' | 'relevance' | 'results' | 'header' | 'paragraph';
  title: string;
  content: string;
  order: number;
  isLocked?: boolean;
  narrativeAnchor?: NarrativeAnchor;
}

export interface DocumentContext {
  storyBrief: string;
  narrativeAnchors: NarrativeAnchor[];
  targetAudience: string;
  authorVoice: AuthorVoice;
  productContext: ProductContext;
}

export interface NarrativeAnchor {
  id: string;
  type: 'belief' | 'pain' | 'transformation';
  content: string;
  selected: boolean;
  strength?: number;
  resonanceFactors?: string[];
  isLocked?: boolean;
}

export interface AuthorVoice {
  tone: string;
  experiences: string[];
  beliefs: string[];
}

export interface ProductContext {
  features: string[];
  useCases: string[];
  differentiators: string[];
}

export interface DocumentMetadata {
  wordCount: number;
  readingTime: number;
  lastEditedBy: string;
  tags: string[];
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  cursor?: CursorPosition;
}

export interface CursorPosition {
  position: number;
  selection?: { from: number; to: number };
}

export interface Comment {
  id: string;
  content: string;
  author: Collaborator;
  position: number;
  resolved: boolean;
  replies: CommentReply[];
  createdAt: string;
  updatedAt: string;
}

export interface CommentReply {
  id: string;
  content: string;
  author: Collaborator;
  createdAt: string;
}

export type UserRole = 'owner' | 'editor' | 'viewer';
export type EditorTab = 'outline' | 'editor' | 'visuals' | 'review';

export interface AIsuggestion {
  id: string;
  type: 'rewrite' | 'improve' | 'expand' | 'insert_cta' | 'suggest_visual';
  content: string;
  originalContent: string;
  confidence: number;
  reasoning: string;
}

export interface SmartBlock {
  id: string;
  type: 'resonance' | 'relevance' | 'results';
  title: string;
  description: string;
  template: string;
  aiPrompt: string;
}
