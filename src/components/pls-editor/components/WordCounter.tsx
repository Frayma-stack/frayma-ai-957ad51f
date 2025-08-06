import { FC } from 'react';

interface WordCounterProps {
  wordCount: number;
  charCount: number;
}

const WordCounter: FC<WordCounterProps> = ({ wordCount, charCount }) => {
  return (
    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
      <span>{wordCount} words</span>
      <span>{charCount} characters</span>
    </div>
  );
};

export default WordCounter;