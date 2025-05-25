
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
import { Client, CompanyLink, ProductContext } from '@/types/storytelling';
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
  const [step, setStep] = useState<'basic' | 'analysis' | 'complete'>('basic');
  const [analyzedProductContext, setAnalyzedProductContext] = useState<ProductContext | null>(null);
  
  const { toast } = useToast();
  const { isAnalyzing, analyzeClient } = useClientAnalysis();

  const resetForm = () => {
    setName('');
    setDescription('');
    setCompanyLinks([{ type: 'website', url: '' }]);
    setStep('basic');
    setAnalyzedProductContext(null);
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

  const handleBasicInfoSubmit = () => {
    if (!name.trim()) {
      toast({
        title: "Error",
        description: "Client name is required",
        variant: "destructive"
      });
      return;
    }

    const hasValidLinks = companyLinks.some(link => link.url.trim() !== '');
    if (!hasValidLinks) {
      // If no links, create client without analysis
      handleCreateClientWithoutAnalysis();
      return;
    }

    setStep('analysis');
    handleAnalyzeAndCreate();
  };

  const handleCreateClientWithoutAnalysis = () => {
    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    console.log('Creating client without analysis:', clientData);
    onClientCreated(clientData);
    
    toast({
      title: "Success",
      description: "Client created successfully"
    });

    handleClose();
  };

  const handleAnalyzeAndCreate = async () => {
    const validLinks = companyLinks.filter(link => link.url.trim() !== '');
    
    console.log('Starting analysis with links:', validLinks);
    
    try {
      await analyzeClient(validLinks, name, (productContext) => {
        console.log('Analysis completed, received product context:', productContext);
        
        // Store the analyzed product context
        setAnalyzedProductContext(productContext);
        setStep('complete');
      });
    } catch (error) {
      console.error('Analysis failed:', error);
      toast({
        title: "Analysis Failed",
        description: "Failed to analyze company information. You can still create the client.",
        variant: "destructive"
      });
      setStep('basic');
    }
  };

  const handleFinalSubmit = () => {
    const clientData: Client = {
      id: editingClient?.id || crypto.randomUUID(),
      name: name.trim(),
      description: description.trim() || undefined,
      companyLinks: companyLinks.filter(link => link.url.trim() !== ''),
      createdAt: editingClient?.createdAt || new Date().toISOString()
    };

    console.log('Creating client with analyzed data:', { clientData, analyzedProductContext });

    // Ensure clientId is set on the product context
    if (analyzedProductContext) {
      analyzedProductContext.clientId = clientData.id;
      console.log('Updated product context with client ID:', analyzedProductContext);
    }

    onClientCreated(clientData, analyzedProductContext || undefined);
    
    toast({
      title: "Success",
      description: analyzedProductContext 
        ? "Client and product context created successfully"
        : "Client created successfully"
    });

    handleClose();
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'basic' && (editingClient ? 'Edit Client' : 'Add New Client')}
            {step === 'analysis' && 'Company Analysis'}
            {step === 'complete' && 'Review & Create'}
          </DialogTitle>
          <DialogDescription>
            {step === 'basic' && 'Provide company information and URLs for automated analysis'}
            {step === 'analysis' && 'Analyzing company information to extract product context'}
            {step === 'complete' && 'Review the extracted information and create the client'}
          </DialogDescription>
        </DialogHeader>

        {step === 'basic' && (
          <div className="space-y-4">
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
              <Label>Company Links</Label>
              <p className="text-sm text-gray-600">
                Provide company URLs for automated analysis (LinkedIn, website, about page, etc.)
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
            </div>
          </div>
        )}

        {step === 'analysis' && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Analyzing Company Information
                </CardTitle>
                <CardDescription>
                  We're analyzing the provided URLs to extract company details and create a comprehensive product context.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="font-medium">{name}</p>
                  <div className="space-y-1">
                    {companyLinks.filter(link => link.url.trim()).map((link, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                        {getLinkTypeIcon(link.type)}
                        <span className="capitalize">{link.type}:</span>
                        <span className="truncate">{link.url}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {step === 'complete' && analyzedProductContext && (
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analysis Complete!</CardTitle>
                <CardDescription>
                  Successfully extracted company information and product context.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Core Narrative</h4>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    {analyzedProductContext.categoryPOV && (
                      <div>
                        <span className="font-medium">Category POV:</span>
                        <p className="text-gray-700">{analyzedProductContext.categoryPOV}</p>
                      </div>
                    )}
                    {analyzedProductContext.companyMission && (
                      <div>
                        <span className="font-medium">Company Mission:</span>
                        <p className="text-gray-700">{analyzedProductContext.companyMission}</p>
                      </div>
                    )}
                    {analyzedProductContext.uniqueInsight && (
                      <div>
                        <span className="font-medium">Unique Insight:</span>
                        <p className="text-gray-700">{analyzedProductContext.uniqueInsight}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium">Features</h5>
                    <p className="text-gray-600">{analyzedProductContext.features.length} extracted</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Use Cases</h5>
                    <p className="text-gray-600">{analyzedProductContext.useCases.length} extracted</p>
                  </div>
                  <div>
                    <h5 className="font-medium">Differentiators</h5>
                    <p className="text-gray-600">{analyzedProductContext.differentiators.length} extracted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <DialogFooter>
          {step === 'basic' && (
            <>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={handleBasicInfoSubmit} className="bg-story-blue hover:bg-story-light-blue">
                {companyLinks.some(link => link.url.trim()) ? 'Analyze & Create' : 'Create Client'}
              </Button>
            </>
          )}
          
          {step === 'analysis' && (
            <>
              <Button type="button" variant="outline" onClick={() => setStep('basic')} disabled={isAnalyzing}>
                Back
              </Button>
              <Button 
                onClick={handleCreateClientWithoutAnalysis} 
                disabled={isAnalyzing}
                className="bg-story-blue hover:bg-story-light-blue"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Skip Analysis & Create'
                )}
              </Button>
            </>
          )}
          
          {step === 'complete' && (
            <>
              <Button type="button" variant="outline" onClick={() => setStep('analysis')}>
                Re-analyze
              </Button>
              <Button onClick={handleFinalSubmit} className="bg-story-blue hover:bg-story-light-blue">
                Create Client
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedClientDialog;
