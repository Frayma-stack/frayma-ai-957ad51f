
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from 'lucide-react';

const IdeasIntroCard: FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <Lightbulb className="h-6 w-6 text-blue-600 mt-1" />
          </div>
          <div>
            <h4 className="text-lg font-medium text-gray-800 mb-2">Fresh Product-Led Ideas</h4>
            <p className="text-gray-700 leading-relaxed">
              Here are 15 rare, non-obvious content ideas tailored for your target audience, demonstrating how your product can amplify their storytelling without sounding salesy.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IdeasIntroCard;
