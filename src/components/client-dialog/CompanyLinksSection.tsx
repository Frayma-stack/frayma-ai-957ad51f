
import { FC } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyLink } from '@/types/storytelling';
import { Plus, Trash, Loader2 } from 'lucide-react';

interface CompanyLinksSectionProps {
  companyLinks: CompanyLink[];
  onUpdateCompanyLinks: (links: CompanyLink[]) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  canAnalyze: boolean;
}

const CompanyLinksSection: FC<CompanyLinksSectionProps> = ({
  companyLinks,
  onUpdateCompanyLinks,
  onAnalyze,
  isAnalyzing,
  canAnalyze
}) => {
  const addCompanyLink = () => {
    onUpdateCompanyLinks([...companyLinks, { type: 'website', url: '' }]);
  };

  const removeCompanyLink = (index: number) => {
    if (companyLinks.length > 1) {
      onUpdateCompanyLinks(companyLinks.filter((_, i) => i !== index));
    }
  };

  const updateCompanyLink = (index: number, field: 'type' | 'url', value: string) => {
    const updated = [...companyLinks];
    updated[index] = { ...updated[index], [field]: value };
    onUpdateCompanyLinks(updated);
  };

  return (
    <div className="space-y-3">
      <Label>Company Links for Analysis</Label>
      <p className="text-sm text-gray-600">
        Add company URLs for automated product context analysis
      </p>
      
      {companyLinks.map((link, index) => (
        <div key={index} className="flex gap-2 items-end">
          <div className="flex-1">
            <Label className="text-xs">Type</Label>
            <select
              value={link.type}
              onChange={(e) => updateCompanyLink(index, 'type', e.target.value)}
              className="w-full p-2 border rounded-md text-sm"
            >
              <option value="website">Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="about">About Page</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="flex-[3]">
            <Label className="text-xs">URL</Label>
            <Input
              value={link.url}
              onChange={(e) => updateCompanyLink(index, 'url', e.target.value)}
              placeholder="https://..."
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => removeCompanyLink(index)}
            disabled={companyLinks.length === 1}
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      ))}
      
      <Button
        type="button"
        variant="outline"
        onClick={addCompanyLink}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Another URL
      </Button>

      <Button
        onClick={onAnalyze}
        disabled={isAnalyzing || !canAnalyze}
        className="w-full bg-story-blue hover:bg-story-light-blue"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Analyzing...
          </>
        ) : (
          'Analyze & Complete Product Context'
        )}
      </Button>
    </div>
  );
};

export default CompanyLinksSection;
