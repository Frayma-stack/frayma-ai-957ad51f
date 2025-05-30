
import { IdeaWithScore } from './types';
import { parseIdeaContent } from './ideaParser';

export * from './types';
export * from './constants';
export * from './sectionDetectors';
export * from './contentExtractor';
export * from './ideaParser';

export const parseIdeas = (generatedIdeas: string[]): IdeaWithScore[] => {
  return generatedIdeas.map((ideaContent, index) => {
    const tempId = `temp-idea-${Date.now()}-${index}`;
    
    // Enhanced parsing logic to extract structured content
    const parsed = parseIdeaContent(ideaContent);
    
    return {
      ...parsed,
      originalContent: ideaContent,
      tempId,
      score: null
    };
  });
};
