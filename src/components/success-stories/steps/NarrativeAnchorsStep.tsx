
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Users, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface NarrativeAnchorsStepProps {
  data: SuccessStoryFlowData;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const NarrativeAnchorsStep: FC<NarrativeAnchorsStepProps> = ({ data, onDataChange }) => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <Users className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Narrative Anchors + Customer Voice</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Help Frayma AI humanize the story and embed relatable tension</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium">Customer Industry/Segment *</label>
            <p className="text-xs text-gray-500 mb-2">What industry or vertical the profiled company belongs to</p>
            <Input 
              placeholder="e.g., SaaS, Healthcare, E-commerce"
              value={data.customerIndustry}
              onChange={(e) => onDataChange('customerIndustry', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Profiled Customer Company Size</label>
            <p className="text-xs text-gray-500 mb-2">Employee count or team structure for context</p>
            <Input 
              placeholder="e.g., 50-100 employees, Series B startup"
              value={data.customerCompanySize}
              onChange={(e) => onDataChange('customerCompanySize', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Job Role of Champion User/Buyer 01 *</label>
            <p className="text-xs text-gray-500 mb-2">e.g., John Doe, VP of Engineering</p>
            <Input 
              placeholder="Name and title of primary champion"
              value={data.championRole01}
              onChange={(e) => onDataChange('championRole01', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Customer Quote 01 *</label>
            <p className="text-xs text-gray-500 mb-2">Direct quote from Champion Buyer/User 01</p>
            <Textarea 
              placeholder="Paste direct quote from interviews, Slack, DMs, email, etc."
              value={data.customerQuote01}
              onChange={(e) => onDataChange('customerQuote01', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Job Role of Champion User/Buyer 02</label>
            <p className="text-xs text-gray-500 mb-2">e.g., Jane Smith, Growth Marketing Manager</p>
            <Input 
              placeholder="Name and title of secondary champion"
              value={data.championRole02}
              onChange={(e) => onDataChange('championRole02', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Customer Quote 02</label>
            <p className="text-xs text-gray-500 mb-2">Direct quote from Champion Buyer/User 02</p>
            <Textarea 
              placeholder="Paste direct quote from interviews, Slack, DMs, email, etc."
              value={data.customerQuote02}
              onChange={(e) => onDataChange('customerQuote02', e.target.value)}
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Job Role of Champion User/Buyer 03</label>
            <p className="text-xs text-gray-500 mb-2">e.g., Mike Johnson, VP of Sales</p>
            <Input 
              placeholder="Name and title of third champion"
              value={data.championRole03}
              onChange={(e) => onDataChange('championRole03', e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Customer Quote 03</label>
            <p className="text-xs text-gray-500 mb-2">Direct quote from Champion Buyer/User 03</p>
            <Textarea 
              placeholder="Paste direct quote from interviews, Slack, DMs, email, etc."
              value={data.customerQuote03}
              onChange={(e) => onDataChange('customerQuote03', e.target.value)}
              rows={3}
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-sm font-medium">Pain Point (Narrative Framing) *</label>
            <p className="text-xs text-gray-500 mb-2">Describe the pain in real terms</p>
            <Textarea 
              placeholder="e.g., They were struggling to onboard devs fast enough to keep up with growth."
              value={data.painPointFraming}
              onChange={(e) => onDataChange('painPointFraming', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default NarrativeAnchorsStep;
