
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Loader, Sparkles } from 'lucide-react';

const RegenerationLoadingState: FC = () => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 shadow-sm">
      <CardContent className="p-12 text-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Sparkles className="h-12 w-12 text-purple-600" />
            <Loader className="h-6 w-6 text-purple-700 absolute -bottom-1 -right-1 animate-spin" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              Minting Fresh Product-Led Ideas...
            </h3>
            <p className="text-gray-600 font-light max-w-md">
              We're crafting new content ideas based on your fresh perspective and narrative direction.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegenerationLoadingState;
