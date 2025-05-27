
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";

const LoadingState: FC = () => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary mx-auto mb-4"></div>
        <p className="text-gray-500">Loading drafts...</p>
      </CardContent>
    </Card>
  );
};

export default LoadingState;
