
import { useState, useEffect } from 'react';
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { supabaseDataService } from '@/services/SupabaseDataService';

export const useOutlineData = (
  initialProductFeatures: ProductFeature[],
  initialProductUseCases: ProductUseCase[],
  initialProductDifferentiators: ProductDifferentiator[]
) => {
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);
  const [allProductFeatures, setAllProductFeatures] = useState<ProductFeature[]>(initialProductFeatures);
  const [allProductUseCases, setAllProductUseCases] = useState<ProductUseCase[]>(initialProductUseCases);
  const [allProductDifferentiators, setAllProductDifferentiators] = useState<ProductDifferentiator[]>(initialProductDifferentiators);

  useEffect(() => {
    const loadProductContextData = async () => {
      try {
        const contexts = await supabaseDataService.getProductContexts();
        setProductContexts(contexts);
        
        // Aggregate all features, use cases, and differentiators from product contexts
        const allFeatures: ProductFeature[] = [...initialProductFeatures];
        const allUseCases: ProductUseCase[] = [...initialProductUseCases];
        const allDifferentiators: ProductDifferentiator[] = [...initialProductDifferentiators];
        
        contexts.forEach(context => {
          if (context.features) {
            allFeatures.push(...context.features);
          }
          if (context.useCases) {
            allUseCases.push(...context.useCases);
          }
          if (context.differentiators) {
            allDifferentiators.push(...context.differentiators);
          }
        });
        
        setAllProductFeatures(allFeatures);
        setAllProductUseCases(allUseCases);
        setAllProductDifferentiators(allDifferentiators);
        
        console.log('Asset data loaded:', {
          features: allFeatures.length,
          useCases: allUseCases.length,
          differentiators: allDifferentiators.length
        });
      } catch (error) {
        console.error('Error loading product context data:', error);
      }
    };

    loadProductContextData();
  }, [initialProductFeatures, initialProductUseCases, initialProductDifferentiators]);

  return {
    productContexts,
    allProductFeatures,
    allProductUseCases,
    allProductDifferentiators
  };
};
