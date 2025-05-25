
export interface IdeaScore {
  value: 0 | 1 | 2 | 3;
  label: string;
}

export interface GeneratedIdea {
  id: string;
  title: string;
  narrative: string;
  productTieIn: string;
  cta: string;
  createdAt: string;
  score: IdeaScore | null;
  source: {
    type: 'text' | 'file' | 'url' | 'manual';
    content: string;
  };
  icpId: string;
  narrativeAnchor: 'belief' | 'pain' | 'struggle' | 'transformation';
  narrativeItemId: string;
  productFeatures: string[];
  perspective?: string;
  clientId?: string; // New field for client assignment
}

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  contentType: 'thought_leadership' | 'newsletter';
  articleSubtype: 'blog_post' | 'article' | 'whitepaper';
  status: 'draft' | 'in_progress' | 'completed';
  clientId?: string;
  createdAt: string;
}

export interface IdeaGenerationPrompt {
  topic: string;
  targetAudience: string;
  keywords: string;
  tone: string;
  style: string;
  successStoryId: string;
  icpScriptId: string;
  productContextId: string;
  authorId: string;
}

export type IdeasSortOrder = 'score-desc' | 'date-desc' | 'date-asc';
