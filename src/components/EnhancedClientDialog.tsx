
import { FC, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog, 
  DialogContent,
  DialogDescription,
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from "@/components/ui/dialog";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Client, CompanyLink, ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { Plus, Trash, Loader2, Linkedin, Globe, FileText, ExternalLink } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useClientAnalysis } from '@/hooks/useClientAnalysis';

interface EnhancedClientDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onClientCreated: (client: Client, productContext?: ProductContext) => void;
  editingClient?: Client | null;
}

const EnhancedClientDialog: FC<EnhancedClientDialogProps> = ({
  isOpen,
  onClose,
  onClientCreated,
  editingClient
}) => {
  const [name, setName] = useState(editingClient?.name || '');
  const [description, setDescription] = useState(editingClient?.description || '');
  const [companyLinks, setCompanyLinks] = useState<CompanyLink[]>(
    editingClient?.companyLinks || [{ type: 'website', url: '' }]
  );

  // Product Context fields
  const [categoryPOV, setCategoryPOV] = useState('');
  const [companyMission, setCompanyMission] = useState('');
  const [uniqueInsight, setUniqueInsight] = useState('');
  const [features, setFeatures] = useState<ProductFeature[]>([]);
  const [useCases, setUseCases] = useState<ProductUseCase[]>([]);
  const [differentiators, setDifferentiators] = useState<ProductDifferentiator[]>([]);
  
  const { toast } = useToast();
  const { isAnalyzing, analyzeClient } = useClientAnalysis();

  const resetForm = () => {
    setName('');
    setDescription('');
    setCompanyLinks([{ type: 'website', url: '' }]);
    setCategoryPOV('');
    setCompanyMission('');
    setUniqueInsight('');
    setFeatures([]);
    setUseCases([]);
    setDifferentiators([]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const addCompanyLink = () => {
    setCompanyLinks([...companyLinks, { type: 'website', url: '' }]);
  };

  const removeCompanyLink = (index: number) => {
    if (companyLinks.length > 1) {
      setCompanyLinks(companyLinks.filter((_, i) => i !== index));
    }
  };

  const updateCompanyLink = (index: number, field: 'type' | 'url', value: string) => {
    const updated = [...companyLinks];
    updated[index] = { ...updated[index], [field]: value };
    setCompanyLinks(updated);
  };

  const handleAnalyzeAndComplete = async () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const validLinks = companyLinks.filter(link => link.url.trim() !== '');
    if (validLinks.length === 0) {
      toast({
        title: "Error",
        description: "At least one company URL is required for analysis",
        variant: "destructive"
      });
      return;
    }

    try {
      await analyzeClient(validLinks, name, (productContext) => {
        // Populate the Product Context fields with analyzed data
        setCategoryPOV(productContext.categoryPOV || '');
        setCompanyMission(productContext.companyMission || '');
        setUniqueInsight(productContext.uniqueInsight || '');
        setFeatures(productContext.features || []);
        setUseCases(productContext.useCases || []);
        setDifferentiators(productContext.differentiators || []);

        toast({
          title: "Analysis Complete",
          description: "Product context has been populated with analyzed data. Review and edit as needed.",
        });
      });
    } catch (error) {
      console.error('Analysis failed:', error);
    }
  };

  const handleCreateClient = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    // Create product context if any fields are filled
    let productContext: ProductContext | undefined;
    if (categoryPOV || companyMission || uniqueInsight || features.length > 0 || useCases.length > 0 || differentiators.length > 0) {
      productContext = {
        id: crypto.randomUUID(),
        categoryPOV: categoryPOV.trim(),
        companyMission: companyMission.trim(),
        uniqueInsight: uniqueInsight.trim(),
        features,
        useCases,
        differentiators,
        companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
        clientId: clientData.id
      };
    }

    onClientCreated(clientData, productContext);
    handleClose();
  };

  // Product Context helper functions
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

  const addDifferentiator = () => {
    setDifferentiators([...differentiators, { id: crypto.randomUUID(), name: '', description: '', competitorComparison: '' }]);
  };

  const removeDifferentiator = (index: number) => {
    setDifferentiators(differentiators.filter((_, i) => i !== index));
  };

  const updateDifferentiator = (index: number, field: string, value: string) => {
    const updated = [...differentiators];
    updated[index] = { ...updated[index], [field]: value };
    setDifferentiators(updated);
  };

  const getLinkTypeIcon = (type: string) => {
    switch (type) {
      case 'linkedin': return <Linkedin className="h-4 w-4" />;
      case 'website': return <Globe className="h-4 w-4" />;
      case 'about': return <FileText className="h-4 w-4" />;
      default: return <ExternalLink className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingClient ? 'Edit Client' : 'Add New Client'}
          </DialogTitle>
          <DialogDescription>
            Provide company information and URLs for automated analysis of product context
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Basic Client Info */}
          <div className="space-y-4">
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
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter client/company name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the client"
                    rows={3}
                  />
                </div>

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
                    onClick={handleAnalyzeAndComplete}
                    disabled={isAnalyzing || !name.trim() || !companyLinks.some(link => link.url.trim())}
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
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Product Context */}
          <div className="space-y-4">
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
                      onChange={(e) => setCategoryPOV(e.target.value)}
                      placeholder="Company's perspective on the industry/category"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Company Mission</Label>
                    <Textarea
                      value={companyMission}
                      onChange={(e) => setCompanyMission(e.target.value)}
                      placeholder="The company's mission statement"
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm">Unique Insight</Label>
                    <Textarea
                      value={uniqueInsight}
                      onChange={(e) => setUniqueInsight(e.target.value)}
                      placeholder="Unique perspective the company brings"
                      rows={2}
                    />
                  </div>
                </div>

                {/* Features & Benefits */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Features & Benefits</h4>
                    <Button type="button" onClick={addFeature} variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Feature
                    </Button>
                  </div>

                  {features.map((feature, index) => (
                    <div key={feature.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <Input
                            value={feature.name}
                            onChange={(e) => updateFeature(index, 'name', e.target.value)}
                            placeholder="Feature name"
                            className="text-sm"
                          />
                          
                          <div className="space-y-1">
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
                </div>

                {/* Use Cases */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Use Cases</h4>
                    <Button type="button" onClick={addUseCase} variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Use Case
                    </Button>
                  </div>

                  {useCases.map((useCase, index) => (
                    <div key={useCase.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
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
                </div>

                {/* Differentiators */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Differentiators</h4>
                    <Button type="button" onClick={addDifferentiator} variant="outline" size="sm">
                      <Plus className="h-3 w-3 mr-1" />
                      Add Differentiator
                    </Button>
                  </div>

                  {differentiators.map((diff, index) => (
                    <div key={diff.id} className="border rounded p-3 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleCreateClient} className="bg-story-blue hover:bg-story-light-blue">
            {editingClient ? 'Update Client' : 'Create Client'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedClientDialog;
