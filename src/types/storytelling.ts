export interface CoreBelief {
  id: string;
  content: string;
}

export interface ICPStoryScript {
  id: string;
  name: string;
  clientId: string;
  coreBeliefs: CoreBelief[];
}

export interface Author {
  id: string;
  name: string;
  title: string;
  backstory: string;
  clientId?: string;
}

export interface CustomerSuccessStory {
  id: string;
  clientId: string;
  title: string;
  authorId: string;
  icpScriptId: string;
  beforeSummary: string;
  afterSummary: string;
  productContextId: string;
}

export interface ProductContext {
  id: string;
  clientId: string;
  categoryPOV: string;
  companyMission: string;
}

export interface Client {
  id: string;
  name: string;
  description: string;
}

export type ArticleSubType = 'thought_leadership' | 'newsletter';
