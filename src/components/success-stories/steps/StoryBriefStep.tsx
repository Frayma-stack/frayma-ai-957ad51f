
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ICPStoryScript } from '@/types/storytelling';
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface StoryBriefStepProps {
  data: SuccessStoryFlowData;
  scripts: ICPStoryScript[];
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const StoryBriefStep: FC<StoryBriefStepProps> = ({ data, scripts, onDataChange }) => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <FileText className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Story Brief (Strategic Inputs)</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Capture the foundational success story direction and narrative angle</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Your Customer Name</label>
            <p className="text-xs text-gray-500 mb-2">Frayma AI's user client instance: Auto-selected</p>
            <Input 
              placeholder="Auto-selected from client context"
              value={data.customerName}
              onChange={(e) => onDataChange('customerName', e.target.value)}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profiled Customer Name *</label>
            <p className="text-xs text-gray-500 mb-2">Name of the featured company</p>
            <Input 
              placeholder="e.g., Acme Corporation"
              value={data.profiledCustomerName}
              onChange={(e) => onDataChange('profiledCustomerName', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Profiled Customer URL</label>
            <p className="text-xs text-gray-500 mb-2">Paste profiled customer's website url</p>
            <Input 
              placeholder="https://customer-website.com"
              value={data.profiledCustomerUrl}
              onChange={(e) => onDataChange('profiledCustomerUrl', e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Main Problem/Challenge *</label>
            <p className="text-xs text-gray-500 mb-2">What's the core pain point the customer faced before adopting your product/solution?</p>
            <Textarea 
              placeholder="Describe the primary challenge or pain point..."
              value={data.mainProblem}
              onChange={(e) => onDataChange('mainProblem', e.target.value)}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Most Significant Transformation/Outcome *</label>
            <p className="text-xs text-gray-500 mb-2">Describe the headline transformation or outcome that will anchor the success story</p>
            <Textarea 
              placeholder="Describe the most significant positive outcome..."
              value={data.significantTransformation}
              onChange={(e) => onDataChange('significantTransformation', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Additional Outcome 01</label>
            <p className="text-xs text-gray-500 mb-2">Another contextual improvement or win achieved post-adoption</p>
            <Textarea 
              placeholder="Additional positive outcome..."
              value={data.additionalOutcome01}
              onChange={(e) => onDataChange('additionalOutcome01', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Additional Outcome 02</label>
            <p className="text-xs text-gray-500 mb-2">Another contextual improvement or win achieved post-adoption</p>
            <Textarea 
              placeholder="Additional positive outcome..."
              value={data.additionalOutcome02}
              onChange={(e) => onDataChange('additionalOutcome02', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Additional Outcome 03</label>
            <p className="text-xs text-gray-500 mb-2">Another contextual improvement or win achieved post-adoption</p>
            <Textarea 
              placeholder="Additional positive outcome..."
              value={data.additionalOutcome03}
              onChange={(e) => onDataChange('additionalOutcome03', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Target ICP 01 *</label>
            <p className="text-xs text-gray-500 mb-2">The primary persona this story should resonate with</p>
            <Select value={data.targetIcp01} onValueChange={(value) => onDataChange('targetIcp01', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select primary ICP..." />
              </SelectTrigger>
              <SelectContent>
                {scripts.map((script) => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium">Target ICP 02 (optional)</label>
            <p className="text-xs text-gray-500 mb-2">A secondary relatable ICP</p>
            <Select value={data.targetIcp02} onValueChange={(value) => onDataChange('targetIcp02', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select secondary ICP..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {scripts.map((script) => (
                  <SelectItem key={script.id} value={script.id}>
                    {script.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Core Message (optional)</label>
            <p className="text-xs text-gray-500 mb-2">One-sentence summary of the story's message or positioning</p>
            <Textarea 
              placeholder="e.g., This story proves that fast-growing teams can scale GTM ops without hiring 10 more SDRs..."
              value={data.coreMessage}
              onChange={(e) => onDataChange('coreMessage', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StoryBriefStep;
