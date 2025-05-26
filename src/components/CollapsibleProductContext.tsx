
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { ChevronDown, ChevronRight, Edit, Save, X, Plus, Trash } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import MediaUploader from './MediaUploader';

interface CollapsibleProductContextProps {
  productContext: ProductContext;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const CollapsibleProductContext: FC<CollapsibleProductContextProps> = ({
  productContext,
  onProductContextUpdated
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Edit state
  const [categoryPOV, setCategoryPOV] = useState(productContext.categoryPOV);
  const [companyMission, setCompanyMission] = useState(productContext.companyMission);
  const [uniqueInsight, setUniqueInsight] = useState(productContext.uniqueInsight);
  const [features, setFeatures] = useState<ProductFeature[]>(productContext.features);
  const [useCases, setUseCases] = useState<ProductUseCase[]>(productContext.useCases);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>(productContext.differentiators);
  
  const { toast } = useToast();

  const handleEdit = () => {
    setIsEditing(true);
    // Reset edit state to current values
    setCategoryPOV(productContext.categoryPOV);
    setCompanyMission(productContext.companyMission);
    setUniqueInsight(productContext.uniqueInsight);
    setFeatures([...productContext.features]);
    setUseCases([...productContext.useCases]);
    setDifferentiators([...productContext.differentiators]);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original values
    setCategoryPOV(productContext.categoryPOV);
    setCompanyMission(productContext.companyMission);
    setUniqueInsight(productContext.uniqueInsight);
    setFeatures([...productContext.features]);
    setUseCases([...productContext.useCases]);
    setDifferentiators([...productContext.differentiators]);
  };

  const handleSave = () => {
    const updatedContext: ProductContext = {
      ...productContext,
      categoryPOV,
      companyMission,
      uniqueInsight,
      features,
      useCases,
      differentiators
    };

    onProductContextUpdated(updatedContext);
    setIsEditing(false);
    
    toast({
      title: "Success",
      description: "Product context updated successfully"
    });
  };

  // Feature management functions
  const addFeature = () => {
    setFeatures([...features, { id: crypto.randomUUID(), name: '', benefits: [''], media: [] }]);
  };

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    const updated = [...features];
    updated[index] = { ...updated[index], [field]: value };
    setFeatures(updated);
  };

  const updateFeatureMedia = (index: number, media: any[]) => {
    const updated = [...features];
    updated[index] = { ...updated[index], media };
    setFeatures(updated);
  };

  const addFeatureBenefit = (featureIndex: number) => {
    const updated = [...features];
    updated[featureIndex].benefits.push('');
    setFeatures(updated);
  };

  const removeFeatureBenefit = (featureIndex: number, benefitIndex: number) => {
    const updated = [...features];
    if (updated[featureIndex].benefits.length > 1) {
      updated[featureIndex].benefits.splice(benefitIndex, 1);
      setFeatures(updated);
    }
  };

  const updateFeatureBenefit = (featureIndex: number, benefitIndex: number, value: string) => {
    const updated = [...features];
    updated[featureIndex].benefits[benefitIndex] = value;
    setFeatures(updated);
  };

  // Use case management functions
  const addUseCase = () => {
    setUseCases([...useCases, { id: crypto.randomUUID(), useCase: '', userRole: '', description: '', media: [] }]);
  };

  const removeUseCase = (index: number) => {
    setUseCases(useCases.filter((_, i) => i !== index));
  };

  const updateUseCase = (index: number, field: string, value: string) => {
    const updated = [...useCases];
    updated[index] = { ...updated[index], [field]: value };
    setUseCases(updated);
  };

  const updateUseCaseMedia = (index: number, media: any[]) => {
    const updated = [...useCases];
    updated[index] = { ...updated[index], media };
    setUseCases(updated);
  };

  // Differentiator management functions
  const addDifferentiator = () => {
    setDifferentiators([...differentiators, { id: crypto.randomUUID(), name: '', description: '', competitorComparison: '', media: [] }]);
  };

  const removeDifferentiator = (index: number) => {
    setDifferentiators(differentiators.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index: number, field: string, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    setDifferentiators(updated);
  };

  const updateDifferentiatorMedia = (index: number, media: any[]) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], media };
    setDifferentiators(updated);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-story-blue flex items-center">
            Product Context
          </CardTitle>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button onClick={handleSave} size="sm" className="bg-story-blue hover:bg-story-light-blue">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button onClick={handleCancel} variant="outline" size="sm">
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
              </>
            ) : (
              <Button onClick={handleEdit} variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
            <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
            </Collapsible>
          </div>
        </div>
      </CardHeader>
      
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleContent>
          <CardContent className="space-y-6">
            {/* Core Product Narrative */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-700">Core Product Narrative</h4>
              
              <div className="space-y-2">
                <Label className="text-sm">Category Point of View</Label>
                {isEditing ? (
                  <Textarea
                    value={categoryPOV}
                    onChange={(e) => setCategoryPOV(e.target.value)}
                    placeholder="Company's perspective on the industry/category"
                    rows={2}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {productContext.categoryPOV || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Company Mission</Label>
                {isEditing ? (
                  <Textarea
                    value={companyMission}
                    onChange={(e) => setCompanyMission(e.target.value)}
                    placeholder="The company's mission statement"
                    rows={2}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {productContext.companyMission || 'Not specified'}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm">Unique Insight</Label>
                {isEditing ? (
                  <Textarea
                    value={uniqueInsight}
                    onChange={(e) => setUniqueInsight(e.target.value)}
                    placeholder="Unique perspective the company brings"
                    rows={2}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {productContext.uniqueInsight || 'Not specified'}
                  </p>
                )}
              </div>
            </div>

            {/* Features & Benefits */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Features & Benefits</h4>
                {isEditing && (
                  <Button type="button" onClick={addFeature} variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Feature
                  </Button>
                )}
              </div>

              {isEditing ? (
                <>
                  {features.map((feature, index) => (
                    <div key={feature.id} className="border rounded p-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={feature.name}
                            onChange={(e) => updateFeature(index, 'name', e.target.value)}
                            placeholder="Feature name"
                            className="text-sm"
                          />
                          
                          <div className="space-y-2">
                            <Label className="text-xs">Benefits</Label>
                            {feature.benefits.map((benefit, benefitIndex) => (
                              <div key={benefitIndex} className="flex gap-1">
                                <Input
                                  value={benefit}
                                  onChange={(e) => updateFeatureBenefit(index, benefitIndex, e.target.value)}
                                  placeholder="Benefit description"
                                  className="text-sm"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="icon"
                                  onClick={() => removeFeatureBenefit(index, benefitIndex)}
                                  disabled={feature.benefits.length === 1}
                                  className="h-8 w-8"
                                >
                                  <Trash className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => addFeatureBenefit(index)}
                              className="text-xs h-6"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Benefit
                            </Button>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs">Feature Visuals</Label>
                            <MediaUploader
                              media={feature.media || []}
                              onMediaChange={(media) => updateFeatureMedia(index, media)}
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeFeature(index)}
                          className="ml-2 h-8 w-8"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {productContext.features.length > 0 ? (
                    productContext.features.map((feature, index) => (
                      <div key={feature.id} className="bg-gray-50 p-3 rounded space-y-2">
                        <h5 className="font-medium text-sm">{feature.name}</h5>
                        <div className="space-y-1">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <p key={benefitIndex} className="text-xs text-gray-600">• {benefit}</p>
                          ))}
                        </div>
                        {feature.media && feature.media.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">{feature.media.length} visual(s) attached</p>
                            <MediaUploader
                              media={feature.media}
                              onMediaChange={() => {}} // Read-only in view mode
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No features added yet</p>
                  )}
                </>
              )}
            </div>

            {/* Use Cases */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Use Cases</h4>
                {isEditing && (
                  <Button type="button" onClick={addUseCase} variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Use Case
                  </Button>
                )}
              </div>

              {isEditing ? (
                <>
                  {useCases.map((useCase, index) => (
                    <div key={useCase.id} className="border rounded p-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={useCase.useCase}
                            onChange={(e) => updateUseCase(index, 'useCase', e.target.value)}
                            placeholder="Use case title"
                            className="text-sm"
                          />
                          <Input
                            value={useCase.userRole}
                            onChange={(e) => updateUseCase(index, 'userRole', e.target.value)}
                            placeholder="Target user role/persona"
                            className="text-sm"
                          />
                          <Textarea
                            value={useCase.description}
                            onChange={(e) => updateUseCase(index, 'description', e.target.value)}
                            placeholder="Description of how the company solves this problem"
                            rows={2}
                            className="text-sm"
                          />

                          <div className="space-y-2">
                            <Label className="text-xs">Use Case Visuals</Label>
                            <MediaUploader
                              media={useCase.media || []}
                              onMediaChange={(media) => updateUseCaseMedia(index, media)}
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeUseCase(index)}
                          className="ml-2 h-8 w-8"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {productContext.useCases.length > 0 ? (
                    productContext.useCases.map((useCase, index) => (
                      <div key={useCase.id} className="bg-gray-50 p-3 rounded space-y-2">
                        <h5 className="font-medium text-sm">{useCase.useCase}</h5>
                        <p className="text-xs text-gray-600"><strong>Target:</strong> {useCase.userRole}</p>
                        <p className="text-xs text-gray-600">{useCase.description}</p>
                        {useCase.media && useCase.media.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">{useCase.media.length} visual(s) attached</p>
                            <MediaUploader
                              media={useCase.media}
                              onMediaChange={() => {}} // Read-only in view mode
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No use cases added yet</p>
                  )}
                </>
              )}
            </div>

            {/* Differentiators */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-700">Differentiators</h4>
                {isEditing && (
                  <Button type="button" onClick={addDifferentiator} variant="outline" size="sm">
                    <Plus className="h-3 w-3 mr-1" />
                    Add Differentiator
                  </Button>
                )}
              </div>

              {isEditing ? (
                <>
                  {differentiators.map((diff, index) => (
                    <div key={diff.id} className="border rounded p-3 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-3">
                          <Input
                            value={diff.name}
                            onChange={(e) => updateDifferentiator(index, 'name', e.target.value)}
                            placeholder="Differentiator name"
                            className="text-sm"
                          />
                          <Textarea
                            value={diff.description}
                            onChange={(e) => updateDifferentiator(index, 'description', e.target.value)}
                            placeholder="Description of what makes them unique"
                            rows={2}
                            className="text-sm"
                          />
                          <Textarea
                            value={diff.competitorComparison}
                            onChange={(e) => updateDifferentiator(index, 'competitorComparison', e.target.value)}
                            placeholder="How this compares to their closest competitors"
                            rows={2}
                            className="text-sm"
                          />

                          <div className="space-y-2">
                            <Label className="text-xs">Differentiator Visuals</Label>
                            <MediaUploader
                              media={diff.media || []}
                              onMediaChange={(media) => updateDifferentiatorMedia(index, media)}
                            />
                          </div>
                        </div>
                        
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => removeDifferentiator(index)}
                          className="ml-2 h-8 w-8"
                        >
                          <Trash className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {productContext.differentiators.length > 0 ? (
                    productContext.differentiators.map((diff, index) => (
                      <div key={diff.id} className="bg-gray-50 p-3 rounded space-y-2">
                        <h5 className="font-medium text-sm">{diff.name}</h5>
                        <p className="text-xs text-gray-600">{diff.description}</p>
                        {diff.competitorComparison && (
                          <p className="text-xs text-gray-600"><strong>vs Competitors:</strong> {diff.competitorComparison}</p>
                        )}
                        {diff.media && diff.media.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-500 mb-1">{diff.media.length} visual(s) attached</p>
                            <MediaUploader
                              media={diff.media}
                              onMediaChange={() => {}} // Read-only in view mode
                            />
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No differentiators added yet</p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default CollapsibleProductContext;
