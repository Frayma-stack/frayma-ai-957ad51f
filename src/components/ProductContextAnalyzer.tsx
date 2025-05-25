import { FC, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Upload, CheckCircle, FileText, Eye, EyeOff } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { ProductContext, ProductFeature, ProductUseCase, ProductDifferentiator } from '@/types/storytelling';
import { useQuery } from '@tanstack/react-query';
import { useChatGPT } from '@/contexts/ChatGPTContext';

interface AnalysisResult {
  features: string[];
  useCases: string[];
  differentiators: string[];
  categoryPOV: string;
  companyMission: string;
  uniqueInsight: string;
}

const parseAnalysisResult = (text: string): AnalysisResult | null => {
  try {
    const jsonString = text.substring(text.indexOf('{'), text.lastIndexOf('}') + 1);
    const parsed = JSON.parse(jsonString);
    return parsed as AnalysisResult;
  } catch (error) {
    console.error("Failed to parse analysis result:", error);
    return null;
  }
};

const extractUrls = (text: string): string[] => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = [];
  let match;
  while ((match = urlRegex.exec(text)) !== null) {
    urls.push(match[1]);
  }
  return urls;
};

interface ProductContextAnalyzerProps {
  onProductContextCreated: (productContext: ProductContext) => void;
  onClose: () => void;
}

const ProductContextAnalyzer: FC<ProductContextAnalyzerProps> = ({ 
  onProductContextCreated, 
  onClose 
}) => {
  const [input, setInput] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullText, setShowFullText] = useState(false);
  const { toast } = useToast();
  const { generateText } = useChatGPT();
  const [productName, setProductName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [urls, setUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setInput(text);
        setUrls(extractUrls(text));
      };
      reader.readAsText(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const analyzeText = async () => {
    setIsAnalyzing(true);
    try {
      const prompt = `Analyze the following text about a product and extract key information to populate a product context. Identify product features, use cases, differentiators, the company's category point of view, company mission, and unique insight. Return the result as a JSON object with the following structure:

      \`\`\`json
      {
        "features": ["feature 1", "feature 2", ...],
        "useCases": ["use case 1", "use case 2", ...],
        "differentiators": ["differentiator 1", "differentiator 2", ...],
        "categoryPOV": "company's point of view on the product category",
        "companyMission": "company's mission statement",
        "uniqueInsight": "unique insight about the product or market"
      }
      \`\`\`

      Here is the text to analyze:
      ${input}`;

      const analysis = await generateText(prompt);
      if (analysis) {
        const parsedResult = parseAnalysisResult(analysis);
        if (parsedResult) {
          setAnalysisResult(parsedResult);
        } else {
          toast({
            title: "Analysis Failed",
            description: "Could not parse the analysis result. Please ensure the text contains valid JSON.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Analysis Failed",
          description: "Failed to generate analysis. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error during analysis:", error);
      toast({
        title: "Analysis Failed",
        description: "An error occurred while analyzing the text.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    if (!analysisResult) {
      toast({
        title: "Missing Analysis",
        description: "Please analyze the text first.",
        variant: "destructive",
      });
      return;
    }

    if (!productName || !companyName) {
      toast({
        title: "Missing Information",
        description: "Please enter the product and company names.",
        variant: "destructive",
      });
      return;
    }

    const newProductContext: ProductContext = {
      id: crypto.randomUUID(),
      features: analysisResult.features.map(feature => ({
        id: crypto.randomUUID(),
        name: feature,
        benefits: [],
      })),
      useCases: analysisResult.useCases.map(useCase => ({
        id: crypto.randomUUID(),
        useCase: useCase,
        userRole: '',
        description: '',
      })),
      differentiators: analysisResult.differentiators.map(differentiator => ({
        id: crypto.randomUUID(),
        name: differentiator,
        description: '',
        competitorComparison: '',
      })),
      categoryPOV: analysisResult.categoryPOV,
      companyMission: analysisResult.companyMission,
      uniqueInsight: analysisResult.uniqueInsight,
      companyLinks: urls.map(url => ({ type: 'website', url })),
    };

    onProductContextCreated(newProductContext);
    toast({
      title: "Product Context Created",
      description: "The product context has been created successfully.",
    });
    onClose();
  };

  return (
    <Card className="bg-white shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Product Context Analyzer</CardTitle>
        <CardDescription>
          Upload a document or paste text to analyze and extract key product information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Product Name</label>
            <Input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <Input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
            />
          </div>
        </div>
        <div>
          <Textarea
            placeholder="Paste text here or upload a file to analyze..."
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setUrls(extractUrls(e.target.value));
            }}
            className="min-h-[150px]"
          />
          <div className="flex items-center justify-between mt-2">
            <Button
              variant="secondary"
              onClick={handleUploadClick}
              disabled={isAnalyzing}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload File
            </Button>
            <input
              type="file"
              accept=".txt,.pdf,.docx"
              onChange={handleFileSelect}
              className="hidden"
              ref={fileInputRef}
            />
            <p className="text-sm text-gray-500">
              Supported formats: .txt, .pdf, .docx
            </p>
          </div>
        </div>
        <div className="flex justify-between">
          <Button
            className="bg-gray-500 hover:bg-gray-700 text-white"
            onClick={onClose}
            disabled={isAnalyzing}
          >
            Cancel
          </Button>
          <Button
            className="bg-story-blue hover:bg-story-light-blue text-white"
            onClick={analyzeText}
            disabled={isAnalyzing || !input}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Analyze
              </>
            )}
          </Button>
        </div>
        {analysisResult && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Analysis Result:</h3>
            <div className="space-y-2">
              <div>
                <Badge variant="secondary">Features</Badge>
                <ul className="list-disc pl-5">
                  {analysisResult.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Badge variant="secondary">Use Cases</Badge>
                <ul className="list-disc pl-5">
                  {analysisResult.useCases.map((useCase, index) => (
                    <li key={index}>{useCase}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Badge variant="secondary">Differentiators</Badge>
                <ul className="list-disc pl-5">
                  {analysisResult.differentiators.map((differentiator, index) => (
                    <li key={index}>{differentiator}</li>
                  ))}
                </ul>
              </div>
              <div>
                <Badge variant="secondary">Category POV</Badge>
                <p>{analysisResult.categoryPOV}</p>
              </div>
              <div>
                <Badge variant="secondary">Company Mission</Badge>
                <p>{analysisResult.companyMission}</p>
              </div>
              <div>
                <Badge variant="secondary">Unique Insight</Badge>
                <p>{analysisResult.uniqueInsight}</p>
              </div>
            </div>
            <Button
              className="bg-story-blue hover:bg-story-light-blue text-white mt-4 w-full"
              onClick={handleSubmit}
            >
              Create Product Context
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductContextAnalyzer;
