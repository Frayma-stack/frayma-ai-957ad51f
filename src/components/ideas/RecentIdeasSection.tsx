
import { FC } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GeneratedIdea } from '@/types/ideas';

interface RecentIdeasSectionProps {
  ideas: GeneratedIdea[];
}

const RecentIdeasSection: FC<RecentIdeasSectionProps> = ({ ideas }) => {
  if (ideas.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Ideas ({ideas.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px]">
          <div className="space-y-2">
            {ideas.slice(0, 5).map((idea) => (
              <div key={idea.id} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-sm">{idea.title}</h4>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">{idea.narrative}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default RecentIdeasSection;
