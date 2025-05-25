
import { FC } from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import FeaturesSection from './FeaturesSection';
import UseCasesSection from './UseCasesSection';
import DifferentiatorsSection from './DifferentiatorsSection';

interface ProductContextFormProps {
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
  features: ProductFeature[];
  useCases: ProductUseCase[];
  differentiators: ProductDifferentiator[];
  onCategoryPOVChange: (value: string) => void;
  onCompanyMissionChange: (value: string) => void;
  onUniqueInsightChange: (value: string) => void;
  onFeaturesChange: (features: ProductFeature[]) => void;
  onUseCasesChange: (useCases: ProductUseCase[]) => void;
  onDifferentiatorsChange: (differentiators: ProductDifferentiator[]) => void;
}

const ProductContextForm: FC<ProductContextFormProps> = ({
  categoryPOV,
  companyMission,
  uniqueInsight,
  features,
  useCases,
  differentiators,
  onCategoryPOVChange,
  onCompanyMissionChange,
  onUniqueInsightChange,
  onFeaturesChange,
  onUseCasesChange,
  onDifferentiatorsChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Product Context</CardTitle>
        <CardDescription>
          This section will be populated after analysis, but you can also fill it manually
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Core Product Narrative */}
        <div className="space-y-3">
          <h4 className="font-medium">Core Product Narrative</h4>
          
          <div className="space-y-2">
            <Label className="text-sm">Category Point of View</Label>
            <Textarea
              value={categoryPOV}
              onChange={(e) => onCategoryPOVChange(e.target.value)}
              placeholder="Company's perspective on the industry/category"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Company Mission</Label>
            <Textarea
              value={companyMission}
              onChange={(e) => onCompanyMissionChange(e.target.value)}
              placeholder="The company's mission statement"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm">Unique Insight</Label>
            <Textarea
              value={uniqueInsight}
              onChange={(e) => onUniqueInsightChange(e.target.value)}
              placeholder="Unique perspective the company brings"
              rows={2}
            />
          </div>
        </div>

        {/* Features & Benefits */}
        <FeaturesSection
          features={features}
          onFeaturesChange={onFeaturesChange}
        />

        {/* Use Cases */}
        <UseCasesSection
          useCases={useCases}
          onUseCasesChange={onUseCasesChange}
        />

        {/* Differentiators */}
        <DifferentiatorsSection
          differentiators={differentiators}
          onDifferentiatorsChange={onDifferentiatorsChange}
        />
      </CardContent>
    </Card>
  );
};

export default ProductContextForm;
