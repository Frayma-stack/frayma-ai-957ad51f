import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { 
  ProductContext,
  ProductFeature,
  ProductUseCase,
  ProductDifferentiator,
  MediaAttachment,
  CompanyLink
} from '@/types/storytelling';
import { Plus, Trash, Globe, Linkedin, ExternalLink } from 'lucide-react';
import MediaUploader from './MediaUploader';
import ProductContextAnalyzer from './ProductContextAnalyzer';

interface ProductContextFormProps {
  initialProductContext: ProductContext | null;
  onSave: (productContext: ProductContext) => void;
  onCancel: () => void;
}

// Helper functions to create empty items
const createEmptyFeature = (): ProductFeature => ({
  id: crypto.randomUUID(),
  name: '',
  benefits: [''],
  media: []
});

const createEmptyUseCase = (): ProductUseCase => ({
  id: crypto.randomUUID(),
  useCase: '',
  userRole: '',
  description: '',
  media: []
});

const createEmptyDifferentiator = (): ProductDifferentiator => ({
  id: crypto.randomUUID(),
  name: '',
  description: '',
  competitorComparison: ''
});

const createEmptyCompanyLink = (type: 'website' | 'linkedin' | 'other'): CompanyLink => ({
  type,
  url: ''
});

const ProductContextForm: FC<ProductContextFormProps> = ({ 
  initialProductContext, 
  onSave,
  onCancel
}) => {
  const { toast } = useToast();
  const [productContext, setProductContext] = useState<ProductContext>(
    initialProductContext || {
      id: crypto.randomUUID(),
      features: [createEmptyFeature()],
      useCases: [createEmptyUseCase()],
      differentiators: [createEmptyDifferentiator()],
      categoryPOV: '',
      companyMission: '',
      uniqueInsight: '',
      companyLinks: [
        createEmptyCompanyLink('website'),
        createEmptyCompanyLink('linkedin')
      ]
    }
  );
  
  const [showAnalyzer, setShowAnalyzer] = useState(false);
  
  // Handle basic fields
  const handleInputChange = (
    field: 'categoryPOV' | 'companyMission' | 'uniqueInsight', 
    value: string
  ) => {
    setProductContext(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Handle features
  const handleFeatureChange = (featureId: string, field: 'name', value: string) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.map(feature => 
        feature.id === featureId ? { ...feature, [field]: value } : feature
      )
    }));
  };
  
  const handleFeatureBenefitChange = (featureId: string, index: number, value: string) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.map(feature => {
        if (feature.id === featureId) {
          const updatedBenefits = [...feature.benefits];
          updatedBenefits[index] = value;
          return { ...feature, benefits: updatedBenefits };
        }
        return feature;
      })
    }));
  };

  const handleFeatureMediaChange = (featureId: string, media: MediaAttachment[]) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.map(feature => 
        feature.id === featureId ? { ...feature, media } : feature
      )
    }));
  };
  
  const addFeatureBenefit = (featureId: string) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.map(feature => {
        if (feature.id === featureId) {
          return { ...feature, benefits: [...feature.benefits, ''] };
        }
        return feature;
      })
    }));
  };
  
  const removeFeatureBenefit = (featureId: string, index: number) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.map(feature => {
        if (feature.id === featureId && feature.benefits.length > 1) {
          const updatedBenefits = [...feature.benefits];
          updatedBenefits.splice(index, 1);
          return { ...feature, benefits: updatedBenefits };
        }
        return feature;
      })
    }));
  };
  
  const addFeature = () => {
    setProductContext(prev => ({
      ...prev,
      features: [...prev.features, createEmptyFeature()]
    }));
  };
  
  const removeFeature = (featureId: string) => {
    setProductContext(prev => ({
      ...prev,
      features: prev.features.filter(feature => feature.id !== featureId)
    }));
  };
  
  // Handle use cases
  const handleUseCaseChange = (
    useCaseId: string, 
    field: keyof Omit<ProductUseCase, 'id' | 'media'>, 
    value: string
  ) => {
    setProductContext(prev => ({
      ...prev,
      useCases: prev.useCases.map(useCase => 
        useCase.id === useCaseId ? { ...useCase, [field]: value } : useCase
      )
    }));
  };

  const handleUseCaseMediaChange = (useCaseId: string, media: MediaAttachment[]) => {
    setProductContext(prev => ({
      ...prev,
      useCases: prev.useCases.map(useCase => 
        useCase.id === useCaseId ? { ...useCase, media } : useCase
      )
    }));
  };
  
  const addUseCase = () => {
    setProductContext(prev => ({
      ...prev,
      useCases: [...prev.useCases, createEmptyUseCase()]
    }));
  };
  
  const removeUseCase = (useCaseId: string) => {
    setProductContext(prev => ({
      ...prev,
      useCases: prev.useCases.filter(useCase => useCase.id !== useCaseId)
    }));
  };
  
  // Handle differentiators
  const handleDifferentiatorChange = (
    diffId: string, 
    field: keyof Omit<ProductDifferentiator, 'id'>, 
    value: string
  ) => {
    setProductContext(prev => ({
      ...prev,
      differentiators: prev.differentiators.map(diff => 
        diff.id === diffId ? { ...diff, [field]: value } : diff
      )
    }));
  };
  
  const addDifferentiator = () => {
    setProductContext(prev => ({
      ...prev,
      differentiators: [...prev.differentiators, createEmptyDifferentiator()]
    }));
  };
  
  const removeDifferentiator = (diffId: string) => {
    setProductContext(prev => ({
      ...prev,
      differentiators: prev.differentiators.filter(diff => diff.id !== diffId)
    }));
  };

  // Handle company links
  const handleCompanyLinkChange = (index: number, url: string) => {
    setProductContext(prev => {
      const companyLinks = [...(prev.companyLinks || [])];
      companyLinks[index] = { ...companyLinks[index], url };
      return { ...prev, companyLinks };
    });
  };

  const addCompanyLink = () => {
    setProductContext(prev => {
      const companyLinks = [...(prev.companyLinks || []), createEmptyCompanyLink('other')];
      return { ...prev, companyLinks };
    });
  };

  const removeCompanyLink = (index: number) => {
    setProductContext(prev => {
      const companyLinks = [...(prev.companyLinks || [])];
      companyLinks.splice(index, 1);
      return { ...prev, companyLinks };
    });
  };
  
  // Handle analyzer results
  const handleAnalysisComplete = (results: Partial<ProductContext>) => {
    setProductContext(prev => ({
      ...prev,
      categoryPOV: results.categoryPOV || prev.categoryPOV,
      companyMission: results.companyMission || prev.companyMission,
      uniqueInsight: results.uniqueInsight || prev.uniqueInsight,
      features: results.features && results.features.length > 0 ? results.features : prev.features,
      useCases: results.useCases && results.useCases.length > 0 ? results.useCases : prev.useCases,
      differentiators: results.differentiators && results.differentiators.length > 0 ? results.differentiators : prev.differentiators
    }));
    setShowAnalyzer(false);
  };
  
  const handleSubmit = () => {
    // Clean up the data
    const cleanedProductContext = {
      ...productContext,
      features: productContext.features
        .filter(feature => feature.name.trim() !== '')
        .map(feature => ({
          ...feature,
          benefits: feature.benefits.filter(benefit => benefit.trim() !== '')
        }))
        .filter(feature => feature.benefits.length > 0),
      useCases: productContext.useCases.filter(
        uc => uc.useCase.trim() !== '' || uc.userRole.trim() !== '' || uc.description.trim() !== ''
      ),
      differentiators: productContext.differentiators.filter(
        diff => diff.name.trim() !== '' || diff.description.trim() !== '' || diff.competitorComparison.trim() !== ''
      ),
      companyLinks: productContext.companyLinks?.filter(link => link.url.trim() !== '')
    };
    
    // Ensure we have at least one item of each type
    if (cleanedProductContext.features.length === 0) {
      cleanedProductContext.features = [createEmptyFeature()];
    }
    if (cleanedProductContext.useCases.length === 0) {
      cleanedProductContext.useCases = [createEmptyUseCase()];
    }
    if (cleanedProductContext.differentiators.length === 0) {
      cleanedProductContext.differentiators = [createEmptyDifferentiator()];
    }
    
    onSave(cleanedProductContext);
    toast({
      title: "Product context saved",
      description: "Your product information has been updated successfully."
    });
  };
  
  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-story-blue">
          Product Context
        </CardTitle>
        <CardDescription>
          Define your product's key features, use cases, and positioning to guide content generation
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-8">
        {showAnalyzer ? (
          <ProductContextAnalyzer 
            onClose={() => setShowAnalyzer(false)}
            onProductContextCreated={handleAnalysisComplete}
          />
        ) : (
          <>
            {/* Company URLs section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium text-story-blue">Company URLs</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addCompanyLink}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add URL
                  </Button>
                  <Button 
                    className="bg-story-blue hover:bg-story-light-blue" 
                    size="sm"
                    onClick={() => setShowAnalyzer(true)}
                    disabled={!(productContext.companyLinks?.some(link => link.url.trim() !== ''))}
                  >
                    Analyze Company
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                {(productContext.companyLinks || []).map((link, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="w-8 text-gray-500 flex-shrink-0">
                      {link.type === 'website' ? (
                        <Globe className="h-5 w-5" />
                      ) : link.type === 'linkedin' ? (
                        <Linkedin className="h-5 w-5" />
                      ) : (
                        <ExternalLink className="h-5 w-5" />
                      )}
                    </div>
                    <Input 
                      placeholder={`${link.type === 'website' ? 'Company website URL' : 
                        link.type === 'linkedin' ? 'Company LinkedIn URL' : 'Other URL'}`}
                      value={link.url}
                      onChange={(e) => handleCompanyLinkChange(index, e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => removeCompanyLink(index)}
                      disabled={index < 2} // Don't allow removing the first two default links
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <p className="text-xs text-gray-500 mt-1">
                  Add company website and LinkedIn URLs to analyze for automatic product context generation
                </p>
              </div>
            </div>

            {/* Core Narrative section */}
            <div className="space-y-4">
              <h3 className="font-medium text-story-blue">Core Product Narrative</h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category Point of View</label>
                <Textarea 
                  placeholder="Describe your perspective on the industry or product category"
                  value={productContext.categoryPOV}
                  onChange={(e) => handleInputChange('categoryPOV', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Mission</label>
                <Textarea 
                  placeholder="Your company's mission statement or purpose"
                  value={productContext.companyMission}
                  onChange={(e) => handleInputChange('companyMission', e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Unique Insight</label>
                <Textarea 
                  placeholder="What unique insight does your company have that others don't?"
                  value={productContext.uniqueInsight}
                  onChange={(e) => handleInputChange('uniqueInsight', e.target.value)}
                  rows={3}
                />
              </div>
            </div>
            
            {/* Tabs for the rest of the content */}
            <Tabs defaultValue="features">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="features">Features & Benefits</TabsTrigger>
                <TabsTrigger value="usecases">Use Cases</TabsTrigger>
                <TabsTrigger value="differentiators">Differentiators</TabsTrigger>
              </TabsList>
              
              {/* Features Tab */}
              <TabsContent value="features" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Product Features</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addFeature}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Feature
                  </Button>
                </div>
                
                {productContext.features.map((feature, featureIndex) => (
                  <div key={feature.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Feature #{featureIndex + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeFeature(feature.id)}
                        disabled={productContext.features.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Input 
                        placeholder="Feature name"
                        value={feature.name}
                        onChange={(e) => handleFeatureChange(feature.id, 'name', e.target.value)}
                      />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <label className="text-sm font-medium">Benefits</label>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => addFeatureBenefit(feature.id)}
                          >
                            <Plus className="h-3 w-3 mr-1" /> Add Benefit
                          </Button>
                        </div>
                        
                        {feature.benefits.map((benefit, benefitIndex) => (
                          <div key={benefitIndex} className="flex gap-2 items-center">
                            <Input 
                              placeholder={`Benefit #${benefitIndex + 1}`}
                              value={benefit}
                              onChange={(e) => handleFeatureBenefitChange(feature.id, benefitIndex, e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => removeFeatureBenefit(feature.id, benefitIndex)}
                              disabled={feature.benefits.length <= 1}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>

                      {/* Media uploader for features */}
                      <div className="pt-2 border-t mt-4">
                        <h4 className="text-sm font-medium mb-2">Feature Media</h4>
                        <MediaUploader 
                          media={feature.media || []}
                          onMediaChange={(media) => handleFeatureMediaChange(feature.id, media)}
                          maxFiles={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Use Cases Tab */}
              <TabsContent value="usecases" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Use Cases & User Roles</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addUseCase}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Use Case
                  </Button>
                </div>
                
                {productContext.useCases.map((useCase, index) => (
                  <div key={useCase.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Use Case #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeUseCase(useCase.id)}
                        disabled={productContext.useCases.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Input 
                          placeholder="Use case (e.g., Lead Generation)"
                          value={useCase.useCase}
                          onChange={(e) => handleUseCaseChange(useCase.id, 'useCase', e.target.value)}
                        />
                        
                        <Input 
                          placeholder="User role (e.g., Marketing Manager)"
                          value={useCase.userRole}
                          onChange={(e) => handleUseCaseChange(useCase.id, 'userRole', e.target.value)}
                        />
                      </div>
                      
                      <Textarea 
                        placeholder="Description of how this use case works"
                        value={useCase.description}
                        onChange={(e) => handleUseCaseChange(useCase.id, 'description', e.target.value)}
                        rows={3}
                      />
                      
                      {/* Media uploader for use cases */}
                      <div className="pt-2 border-t mt-4">
                        <h4 className="text-sm font-medium mb-2">Use Case Media</h4>
                        <MediaUploader 
                          media={useCase.media || []}
                          onMediaChange={(media) => handleUseCaseMediaChange(useCase.id, media)}
                          maxFiles={3}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              {/* Differentiators Tab */}
              <TabsContent value="differentiators" className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Key Differentiators</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={addDifferentiator}
                  >
                    <Plus className="h-4 w-4 mr-1" /> Add Differentiator
                  </Button>
                </div>
                
                {productContext.differentiators.map((diff, index) => (
                  <div key={diff.id} className="border p-4 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Differentiator #{index + 1}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeDifferentiator(diff.id)}
                        disabled={productContext.differentiators.length <= 1}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      <Input 
                        placeholder="Differentiator name"
                        value={diff.name}
                        onChange={(e) => handleDifferentiatorChange(diff.id, 'name', e.target.value)}
                      />
                      
                      <Textarea 
                        placeholder="Description of this differentiator"
                        value={diff.description}
                        onChange={(e) => handleDifferentiatorChange(diff.id, 'description', e.target.value)}
                        rows={2}
                      />
                      
                      <Textarea 
                        placeholder="How this compares to competitors"
                        value={diff.competitorComparison}
                        onChange={(e) => handleDifferentiatorChange(diff.id, 'competitorComparison', e.target.value)}
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-2 border-t pt-4">
        {initialProductContext && (
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        )}
        <Button 
          className="bg-story-blue hover:bg-story-light-blue"
          onClick={handleSubmit}
        >
          Save Product Context
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductContextForm;
