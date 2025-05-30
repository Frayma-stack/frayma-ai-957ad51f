
export interface ContentGoal {
  type: 'book_call' | 'learn_more' | 'try_product' | 'reply' | 'visit_article';
  description: string;
}

export type ContentType = 'email' | 'linkedin' | 'custom';
