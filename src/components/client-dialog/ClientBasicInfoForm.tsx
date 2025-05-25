
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CompanyLink } from '@/types/storytelling';
import CompanyLinksSection from './CompanyLinksSection';

interface ClientBasicInfoFormProps {
  name: string;
  description: string;
  companyLinks: CompanyLink[];
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCompanyLinksChange: (links: CompanyLink[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

const ClientBasicInfoForm: FC<ClientBasicInfoFormProps> = ({
  name,
  description,
  companyLinks,
  onNameChange,
  onDescriptionChange,
  onCompanyLinksChange,
  onAnalyze,
  isAnalyzing
}) => {
  const canAnalyze = name.trim() && companyLinks.some(link => link.url.trim());

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Client Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Client Name*</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Enter client/company name"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Brief description of the client"
            rows={3}
          />
        </div>

        <CompanyLinksSection
          companyLinks={companyLinks}
          onUpdateCompanyLinks={onCompanyLinksChange}
          onAnalyze={onAnalyze}
          isAnalyzing={isAnalyzing}
          canAnalyze={canAnalyze}
        />
      </CardContent>
    </Card>
  );
};

export default ClientBasicInfoForm;
