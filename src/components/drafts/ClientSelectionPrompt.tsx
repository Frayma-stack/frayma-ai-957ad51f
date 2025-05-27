
import { FC } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users } from 'lucide-react';

const ClientSelectionPrompt: FC = () => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardContent className="p-8 text-center">
        <Users className="mx-auto h-12 w-12 opacity-30 mb-4 text-gray-400" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Client</h3>
        <p className="text-gray-500">
          Please select a client from the sidebar to view and manage their drafts.
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientSelectionPrompt;
