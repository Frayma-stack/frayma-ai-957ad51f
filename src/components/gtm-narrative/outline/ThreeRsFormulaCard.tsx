
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Target, Lightbulb, TrendingUp } from 'lucide-react';

const ThreeRsFormulaCard: FC = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="pt-4">
        <div className="flex items-center mb-2">
          <Sparkles className="h-4 w-4 text-story-blue mr-2" />
          <h4 className="text-sm font-semibold text-story-blue">Product-Led Storytelling (PLS) Framework</h4>
        </div>
        <p className="text-xs text-gray-600 mb-3">
          Your outline follows the 3Rs Formula: <strong>Resonance</strong> (attract & filter audience), 
          <strong>Relevance</strong> (engage with valuable insights), and <strong>Results</strong> (drive action).
        </p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center">
            <Target className="h-3 w-3 text-blue-600 mr-1" />
            <span className="text-blue-700">Attract</span>
          </div>
          <div className="flex items-center">
            <Target className="h-3 w-3 text-yellow-600 mr-1" />
            <span className="text-yellow-700">Filter</span>
          </div>
          <div className="flex items-center">
            <Lightbulb className="h-3 w-3 text-purple-600 mr-1" />
            <span className="text-purple-700">Engage</span>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
            <span className="text-green-700">Results</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThreeRsFormulaCard;
