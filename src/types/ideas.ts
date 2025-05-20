
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
}

export type IdeasSortOrder = 'score-desc' | 'date-desc' | 'date-asc';
