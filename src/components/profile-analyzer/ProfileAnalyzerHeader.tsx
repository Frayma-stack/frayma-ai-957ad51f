
import { FC } from 'react';
import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ProfileAnalyzerHeader: FC = () => {
  return (
    <CardHeader>
      <CardTitle className="text-story-blue">Smart Author Profile Analysis</CardTitle>
      <CardDescription>
        Automatically extract professional experiences and writing style from online profiles to speed up author creation
      </CardDescription>
    </CardHeader>
  );
};

export default ProfileAnalyzerHeader;
