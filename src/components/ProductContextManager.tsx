
import { FC, useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductContext } from '@/types/storytelling';
import { Edit, Image, FileVideo, Globe, Linkedin, ExternalLink } from 'lucide-react';
import ProductContextForm from './ProductContextForm';

interface ProductContextManagerProps {
  productContext: ProductContext | null;
  onProductContextUpdated: (productContext: ProductContext) => void;
}

const ProductContextManager: FC<ProductContextManagerProps> = ({ 
  productContext, 
  onProductContextUpdated 
}) => {
  const [showForm, setShowForm] = useState(!productContext);
  
  const handleSave = (context: ProductContext) => {
    onProductContextUpdated(context);
    setShowForm(false);
  };
  
  const handleCancel = () => {
    if (productContext) {
      setShowForm(false);
    }
  };

  // Count total media attachments
  const countTotalMedia = () => {
    if (!productContext) return 0;
    
    const featureMedia = productContext.features.reduce((total, feature) => 
      total + (feature.media?.length || 0), 0);
    
    const useCaseMedia = productContext.useCases.reduce((total, useCase) => 
      total + (useCase.media?.length || 0), 0);
    
    return featureMedia + useCaseMedia;
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-story-blue">Product Context</h2>
        {!showForm && (
          <Button 
            className="bg-story-blue hover:bg-story-light-blue"
            onClick={() => setShowForm(true)}
          >
            <Edit className="h-4 w-4 mr-2" /> Edit Product Context
          </Button>
        )}
      </div>
      
      {showForm ? (
        <ProductContextForm 
          initialProductContext={productContext} 
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : productContext ? (
        <Card className="bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Product Information</CardTitle>
            <CardDescription>Your product's core narrative and positioning</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Company links */}
            {productContext.companyLinks && productContext.companyLinks.length > 0 && (
              <div className="mb-4">
                <h3 className="font-medium mb-2">Company Links</h3>
                <div className="flex flex-wrap gap-2">
                  {productContext.companyLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md text-gray-700"
                    >
                      {link.type === 'website' ? (
                        <Globe className="h-3.5 w-3.5 mr-1.5" />
                      ) : link.type === 'linkedin' ? (
                        <Linkedin className="h-3.5 w-3.5 mr-1.5" />
                      ) : (
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                      )}
                      {link.type === 'website' ? 'Website' : 
                       link.type === 'linkedin' ? 'LinkedIn' : 
                       'Resource'}
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Core Narrative</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-story-blue mb-1">Category POV</h4>
                  <p className="text-sm">{productContext.categoryPOV}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-story-blue mb-1">Company Mission</h4>
                  <p className="text-sm">{productContext.companyMission}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-md">
                  <h4 className="text-sm font-medium text-story-blue mb-1">Unique Insight</h4>
                  <p className="text-sm">{productContext.uniqueInsight}</p>
                </div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium">Features ({productContext.features.length})</h3>
                {countTotalMedia() > 0 && (
                  <span className="text-xs bg-gray-100 py-1 px-2 rounded-full flex items-center gap-1">
                    <Image className="h-3 w-3" /> {countTotalMedia()} Media
                  </span>
                )}
              </div>
              {productContext.features.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {productContext.features.slice(0, 4).map(feature => (
                    <div key={feature.id} className="bg-gray-50 p-3 rounded-md">
                      <div className="flex justify-between">
                        <h4 className="text-sm font-medium">{feature.name}</h4>
                        {feature.media && feature.media.length > 0 && (
                          <div className="flex gap-1 items-center">
                            {feature.media.some(m => m.type === 'image' || m.type === 'gif') && (
                              <Image className="h-3.5 w-3.5 text-gray-500" />
                            )}
                            {feature.media.some(m => m.type === 'video') && (
                              <FileVideo className="h-3.5 w-3.5 text-gray-500" />
                            )}
                          </div>
                        )}
                      </div>
                      <ul className="text-xs text-gray-700 list-disc list-inside mt-1">
                        {feature.benefits.slice(0, 2).map((benefit, i) => (
                          <li key={i}>{benefit}</li>
                        ))}
                        {feature.benefits.length > 2 && (
                          <li>+{feature.benefits.length - 2} more benefits</li>
                        )}
                      </ul>
                    </div>
                  ))}
                  {productContext.features.length > 4 && (
                    <div className="bg-gray-50 p-3 rounded-md flex items-center justify-center">
                      <span className="text-sm text-gray-500">+{productContext.features.length - 4} more features</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No features added yet</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Use Cases ({productContext.useCases.length})</h3>
                {productContext.useCases.length > 0 ? (
                  <ul className="text-sm space-y-1">
                    {productContext.useCases.slice(0, 3).map(useCase => (
                      <li key={useCase.id} className="flex items-center gap-2">
                        <span className="list-disc list-inside">{useCase.useCase} ({useCase.userRole})</span>
                        {useCase.media && useCase.media.length > 0 && (
                          <div className="flex gap-1 items-center">
                            {useCase.media.some(m => m.type === 'image' || m.type === 'gif') && (
                              <Image className="h-3.5 w-3.5 text-gray-500" />
                            )}
                            {useCase.media.some(m => m.type === 'video') && (
                              <FileVideo className="h-3.5 w-3.5 text-gray-500" />
                            )}
                            <span className="text-xs text-gray-500">{useCase.media.length}</span>
                          </div>
                        )}
                      </li>
                    ))}
                    {productContext.useCases.length > 3 && (
                      <li>+{productContext.useCases.length - 3} more use cases</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No use cases added yet</p>
                )}
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Differentiators ({productContext.differentiators.length})</h3>
                {productContext.differentiators.length > 0 ? (
                  <ul className="list-disc list-inside text-sm space-y-1">
                    {productContext.differentiators.slice(0, 3).map(diff => (
                      <li key={diff.id}>{diff.name}</li>
                    ))}
                    {productContext.differentiators.length > 3 && (
                      <li>+{productContext.differentiators.length - 3} more differentiators</li>
                    )}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No differentiators added yet</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No product context added yet. Add product information to enhance your content generation.</p>
        </div>
      )}
    </div>
  );
};

export default ProductContextManager;
