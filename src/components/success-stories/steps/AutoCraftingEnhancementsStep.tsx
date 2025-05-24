
import { FC } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Palette, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Author, ProductContext } from '@/types/storytelling';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface AutoCraftingEnhancementsStepProps {
  data: SuccessStoryFlowData;
  authors: Author[];
  productContext: ProductContext | null;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const writingTones = [
  'Professional and authoritative',
  'Conversational and approachable',
  'Technical and detailed',
  'Executive and strategic',
  'Casual and friendly',
  'Academic and research-focused'
];

const narrativePovOptions = [
  'First-person from the brand',
  'First-person from author',
  'First-person from customer',
  'Third-person narrative',
  'Hybrid perspective'
];

const AutoCraftingEnhancementsStep: FC<AutoCraftingEnhancementsStepProps> = ({ 
  data, 
  authors, 
  productContext, 
  onDataChange 
}) => {
  const selectedAuthor = authors.find(author => author.id === data.selectedAuthor);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Palette className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Auto-Crafting Enhancements</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Personalize the tone and perspective of your success story</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Author *</label>
            <p className="text-xs text-gray-500 mb-2">Choose the author voice for this story</p>
            <Select value={data.selectedAuthor} onValueChange={(value) => onDataChange('selectedAuthor', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select author..." />
              </SelectTrigger>
              <SelectContent>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={author.id}>
                    {author.name} - {author.role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Writing Tone *</label>
            <p className="text-xs text-gray-500 mb-2">Select the overall writing style</p>
            <Select value={data.writingTone} onValueChange={(value) => onDataChange('writingTone', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select writing tone..." />
              </SelectTrigger>
              <SelectContent>
                {writingTones.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Credibility 01</label>
            <p className="text-xs text-gray-500 mb-2">Select author experience to lean on</p>
            <Select value={data.credibility01} onValueChange={(value) => onDataChange('credibility01', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience..." />
              </SelectTrigger>
              <SelectContent>
                {selectedAuthor?.experiences.map((experience) => (
                  <SelectItem key={experience.id} value={experience.id}>
                    {experience.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Credibility 02 (optional)</label>
            <p className="text-xs text-gray-500 mb-2">Select additional author experience</p>
            <Select value={data.credibility02} onValueChange={(value) => onDataChange('credibility02', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {selectedAuthor?.experiences.map((experience) => (
                  <SelectItem key={experience.id} value={experience.id}>
                    {experience.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Credibility 03 (optional)</label>
            <p className="text-xs text-gray-500 mb-2">Select additional author experience</p>
            <Select value={data.credibility03} onValueChange={(value) => onDataChange('credibility03', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select experience..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {selectedAuthor?.experiences.map((experience) => (
                  <SelectItem key={experience.id} value={experience.id}>
                    {experience.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Narrative POV *</label>
            <p className="text-xs text-gray-500 mb-2">Choose the narrative perspective</p>
            <Select value={data.narrativePov} onValueChange={(value) => onDataChange('narrativePov', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select narrative POV..." />
              </SelectTrigger>
              <SelectContent>
                {narrativePovOptions.map((pov) => (
                  <SelectItem key={pov} value={pov}>
                    {pov}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Product Differentiator to Lean On</label>
            <p className="text-xs text-gray-500 mb-2">Select the differentiator this story should emphasize</p>
            <Select value={data.productDifferentiator} onValueChange={(value) => onDataChange('productDifferentiator', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select differentiator..." />
              </SelectTrigger>
              <SelectContent>
                {productContext?.differentiators.map((differentiator) => (
                  <SelectItem key={differentiator.id} value={differentiator.id}>
                    {differentiator.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default AutoCraftingEnhancementsStep;
