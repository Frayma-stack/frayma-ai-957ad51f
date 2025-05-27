
import { FC } from 'react';

interface ICPFormSectionProps {
  title: string;
  children: React.ReactNode;
}

const ICPFormSection: FC<ICPFormSectionProps> = ({ title, children }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-story-blue">{title}</h3>
      {children}
    </div>
  );
};

export default ICPFormSection;
