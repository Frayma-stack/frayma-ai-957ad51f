
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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
  usageDescription?: string;
}

interface UseCase {
  id: string;
  name: string;
  description: string;
  beneficiaryDescription?: string;
}

interface ExtractedContentDisplayProps {
  title: string;
  beforeSummary: string;
  afterSummary: string;
  quotes: Quote[];
  features: Feature[];
  useCases: UseCase[];
  onTitleChange: (title: string) => void;
  onBeforeSummaryChange: (summary: string) => void;
  onAfterSummaryChange: (summary: string) => void;
  onRemoveQuote: (id: string) => void;
  onRemoveFeature: (id: string) => void;
  onRemoveUseCase: (id: string) => void;
}

const ExtractedContentDisplay: FC<ExtractedContentDisplayProps> = ({
  title,
  beforeSummary,
  afterSummary,
  quotes,
  features,
  useCases,
  onTitleChange,
  onBeforeSummaryChange,
  onAfterSummaryChange,
  onRemoveQuote,
  onRemoveFeature,
  onRemoveUseCase,
}) => {
  const hasContent = title || beforeSummary || afterSummary || quotes.length > 0 || features.length > 0 || useCases.length > 0;

  if (!hasContent) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Extracted Information</CardTitle>
        <CardDescription>Review and edit the extracted information below</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {title && (
          <div>
            <Label htmlFor="extracted-title">Title</Label>
            <Input 
              id="extracted-title"
              value={title} 
              onChange={(e) => onTitleChange(e.target.value)} 
            />
          </div>
        )}
        
        {beforeSummary && (
          <div>
            <Label htmlFor="extracted-before">Before Summary</Label>
            <Textarea
              id="extracted-before"
              value={beforeSummary}
              onChange={(e) => onBeforeSummaryChange(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {afterSummary && (
          <div>
            <Label htmlFor="extracted-after">After Summary</Label>
            <Textarea
              id="extracted-after"
              value={afterSummary}
              onChange={(e) => onAfterSummaryChange(e.target.value)}
              rows={3}
            />
          </div>
        )}

        {features.length > 0 && (
          <div>
            <Label>Extracted Features</Label>
            <div className="space-y-2 mt-2">
              {features.map((feature) => (
                <div key={feature.id} className="border p-3 rounded-md">
                  <p className="font-medium">{feature.name}</p>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                  {feature.usageDescription && (
                    <p className="text-xs text-blue-600 mt-1">Usage: {feature.usageDescription}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRemoveFeature(feature.id)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {useCases.length > 0 && (
          <div>
            <Label>Extracted Use Cases</Label>
            <div className="space-y-2 mt-2">
              {useCases.map((useCase) => (
                <div key={useCase.id} className="border p-3 rounded-md">
                  <p className="font-medium">{useCase.name}</p>
                  <p className="text-sm text-gray-600">{useCase.description}</p>
                  {useCase.beneficiaryDescription && (
                    <p className="text-xs text-green-600 mt-1">Helped: {useCase.beneficiaryDescription}</p>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRemoveUseCase(useCase.id)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {quotes.length > 0 && (
          <div>
            <Label>Extracted Quotes</Label>
            <div className="space-y-2 mt-2">
              {quotes.map((quote) => (
                <div key={quote.id} className="border p-3 rounded-md">
                  <p className="font-medium">"{quote.quote}"</p>
                  <p className="text-sm text-gray-600">- {quote.author}, {quote.title}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onRemoveQuote(quote.id)}
                    className="mt-2"
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExtractedContentDisplay;
