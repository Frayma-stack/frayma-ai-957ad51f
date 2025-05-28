
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SummaryForm from './SummaryForm';
import QuoteManager from './QuoteManager';
import FeatureManager from './FeatureManager';

interface Quote {
  id: string;
  quote: string;
  author: string;
  title: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
}

interface ManualEntryFormProps {
  title: string;
  url: string;
  beforeSummary: string;
  afterSummary: string;
  quotes: Quote[];
  features: Feature[];
  onTitleChange: (title: string) => void;
  onUrlChange: (url: string) => void;
  onBeforeSummaryChange: (summary: string) => void;
  onAfterSummaryChange: (summary: string) => void;
  onAddQuote: (quote: Omit<Quote, 'id'>) => void;
  onRemoveQuote: (id: string) => void;
  onAddFeature: (feature: Omit<Feature, 'id'>) => void;
  onRemoveFeature: (id: string) => void;
}

const ManualEntryForm: FC<ManualEntryFormProps> = ({
  title,
  url,
  beforeSummary,
  afterSummary,
  quotes,
  features,
  onTitleChange,
  onUrlChange,
  onBeforeSummaryChange,
  onAfterSummaryChange,
  onAddQuote,
  onRemoveQuote,
  onAddFeature,
  onRemoveFeature,
}) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="manual-title" className="text-right">
          Title
        </Label>
        <Input 
          type="text" 
          id="manual-title" 
          value={title} 
          onChange={(e) => onTitleChange(e.target.value)} 
          className="col-span-3" 
        />
      </div>
      
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="manual-url" className="text-right">
          URL (Optional)
        </Label>
        <Input 
          type="url" 
          id="manual-url" 
          value={url} 
          onChange={(e) => onUrlChange(e.target.value)} 
          className="col-span-3" 
          placeholder="https://example.com"
        />
      </div>
      
      <SummaryForm
        beforeSummary={beforeSummary}
        afterSummary={afterSummary}
        onBeforeSummaryChange={onBeforeSummaryChange}
        onAfterSummaryChange={onAfterSummaryChange}
      />
      
      <QuoteManager
        quotes={quotes}
        onAddQuote={onAddQuote}
        onRemoveQuote={onRemoveQuote}
      />
      
      <FeatureManager
        features={features}
        onAddFeature={onAddFeature}
        onRemoveFeature={onRemoveFeature}
      />
    </div>
  );
};

export default ManualEntryForm;
