
import { FC } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

const ProductContextAnalyzer: FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Context Analysis</CardTitle>
          <CardDescription>
            Product context analysis is now integrated into the client creation process
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Product context analysis has been streamlined and now happens automatically when you create a new client. 
              Simply provide the company links during client creation, and the system will analyze them to automatically 
              populate the Category Point of View, Company Mission, Unique Insight, Features & Benefits, Use Cases, 
              and Differentiators.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-2">
            <h4 className="font-medium">To create a product context with analysis:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Go to the sidebar and click "Manage Clients"</li>
              <li>Click "Add Client" to create a new client</li>
              <li>Fill in the basic client information</li>
              <li>Add company links (LinkedIn, website, about page, etc.)</li>
              <li>Click "Analyze & Create" to automatically generate the product context</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductContextAnalyzer;
