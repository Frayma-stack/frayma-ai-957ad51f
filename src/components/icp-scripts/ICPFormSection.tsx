
import { FC, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ICPFormSectionProps {
  title: string;
  children: ReactNode;
}

const ICPFormSection: FC<ICPFormSectionProps> = ({ title, children }) => {
  return (
    <Card className="border-l-4 border-l-story-blue">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-story-blue">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default ICPFormSection;
