import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator, CompanyLink } from '@/types/storytelling';
import { parseClientAnalysisContent } from '@/utils/clientAnalysisUtils';
import { AnalysisServiceResponse } from '@/types/clientAnalysis';

export class ClientAnalysisResponseProcessor {
  static extractContent(data: AnalysisServiceResponse): string {
    // Extract content from Perplexity API response
    if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
      return data.choices[0].message.content;
    } else if (typeof data === 'string') {
      return data;
    } else if (data.content) {
      return data.content;
    } else {
      console.error('Invalid response structure:', data);
      throw new Error('Invalid response format from analysis service');
    }
  }

  static transformToProductContext(parsedData: any, validLinks: CompanyLink[], name: string = 'Product Context'): ProductContext {
    // Transform parsed data into ProductContext with enhanced mapping
    const features: ProductFeature[] = (parsedData.features || []).map((feature: any) => ({
      id: crypto.randomUUID(),
      name: feature.name || '',
      description: feature.description || '',
      benefits: Array.isArray(feature.benefits) ? feature.benefits.filter(Boolean) : [],
      media: []
    }));
    
    const useCases: ProductUseCase[] = (parsedData.useCases || []).map((useCase: any) => ({
      id: crypto.randomUUID(),
      useCase: useCase.useCase || useCase.userRole || '',
      userRole: useCase.userRole || useCase.useCase || '',
      description: useCase.description || '',
      media: []
    }));
    
    const differentiators: ProductDifferentiator[] = (parsedData.differentiators || []).map((diff: any) => ({
      id: crypto.randomUUID(),
      name: diff.name || '',
      description: diff.description || '',
      competitorComparison: diff.competitorComparison || ''
    }));
    
    const extractedName = parsedData.name || '';
    const extractedDescription = parsedData.description || '';
    const extractedCategoryPOV = parsedData.categoryPOV || '';
    const extractedCompanyMission = parsedData.companyMission || '';
    const extractedUniqueInsight = parsedData.uniqueInsight || '';
    
    const companyLinks = validLinks.filter(link => link.name === 'Client Analysis');
    
    const productContext: ProductContext = {
      id: crypto.randomUUID(),
      clientId: '',
      name: extractedName,
      description: extractedDescription,
      features,
      useCases,
      differentiators,
      categoryPOV: extractedCategoryPOV,
      companyMission: extractedCompanyMission,
      uniqueInsight: extractedUniqueInsight,
      companyLinks
    };
    
    return productContext;
  }
}
