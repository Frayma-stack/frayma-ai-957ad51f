
import { FC } from 'react';
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { ScrollArea } from "@/components/ui/scroll-area";

interface MainContentAreaProps {
  children: React.ReactNode;
  currentView: string;
  selectedType?: ContentType | null;
  selectedArticleSubtype?: ArticleSubType | null;
}

const MainContentArea: FC<MainContentAreaProps> = ({
  children,
  currentView,
  selectedType,
  selectedArticleSubtype
}) => {
  return (
    <div className="flex-1 overflow-auto">
      <ScrollArea className="h-full">
        <div className="p-6">
          {children}
        </div>
      </ScrollArea>
    </div>
  );
};

export default MainContentArea;
