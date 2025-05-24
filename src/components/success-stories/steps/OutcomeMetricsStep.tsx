
import { FC } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SuccessStoryFlowData } from '../useSuccessStoryFlowData';

interface OutcomeMetricsStepProps {
  data: SuccessStoryFlowData;
  onDataChange: (field: keyof SuccessStoryFlowData, value: string) => void;
}

const ctaOptions = [
  'Book a demo',
  'Start free trial',
  'Join waitlist',
  'Contact sales',
  'Get started',
  'Learn more',
  'Schedule consultation',
  'Request pricing'
];

const OutcomeMetricsStep: FC<OutcomeMetricsStepProps> = ({ data, onDataChange }) => {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center mb-6">
          <TrendingUp className="h-5 w-5 text-brand-primary mr-2" />
          <h3 className="text-lg font-semibold text-brand-primary">Outcome Metrics + Persuasive Close</h3>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 ml-2 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs max-w-xs">Surface proof and end the story with confidence</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium">Before & After Metrics *</label>
            <p className="text-xs text-gray-500 mb-2">Specific KPIs, contextually explained</p>
            <Textarea 
              placeholder="e.g., Avg onboarding time dropped from 14 to 3 days"
              value={data.beforeAfterMetrics}
              onChange={(e) => onDataChange('beforeAfterMetrics', e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">Unexpected Win 01</label>
              <p className="text-xs text-gray-500 mb-2">Second-order outcomes or surprises</p>
              <Textarea 
                placeholder="What positive outcome wasn't expected?"
                value={data.unexpectedWin01}
                onChange={(e) => onDataChange('unexpectedWin01', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Unexpected Win 02</label>
              <p className="text-xs text-gray-500 mb-2">Second-order outcomes or surprises</p>
              <Textarea 
                placeholder="What positive outcome wasn't expected?"
                value={data.unexpectedWin02}
                onChange={(e) => onDataChange('unexpectedWin02', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Unexpected Win 03</label>
              <p className="text-xs text-gray-500 mb-2">Second-order outcomes or surprises</p>
              <Textarea 
                placeholder="What positive outcome wasn't expected?"
                value={data.unexpectedWin03}
                onChange={(e) => onDataChange('unexpectedWin03', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-md font-medium">Customer Endorsement Quotes</h4>
            
            <div>
              <label className="text-sm font-medium">Customer Endorsement Quote 01 *</label>
              <p className="text-xs text-gray-500 mb-2">Final powerful quote summarizing the value</p>
              <Textarea 
                placeholder="e.g., John Doe, VP of Sales, said: 'We wouldn't be where we are without X...'"
                value={data.endorsementQuote01}
                onChange={(e) => onDataChange('endorsementQuote01', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Customer Endorsement Quote 02</label>
              <p className="text-xs text-gray-500 mb-2">Additional powerful quote summarizing the value</p>
              <Textarea 
                placeholder="e.g., Jane Smith, Head of Operations, said: 'This completely transformed how we...'"
                value={data.endorsementQuote02}
                onChange={(e) => onDataChange('endorsementQuote02', e.target.value)}
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Customer Endorsement Quote 03</label>
              <p className="text-xs text-gray-500 mb-2">Additional powerful quote summarizing the value</p>
              <Textarea 
                placeholder="e.g., Mike Johnson, CTO, said: 'The ROI was immediate and sustained...'"
                value={data.endorsementQuote03}
                onChange={(e) => onDataChange('endorsementQuote03', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium">CTA to Reader *</label>
              <p className="text-xs text-gray-500 mb-2">Choose from dropdown or customize</p>
              <Select value={data.ctaToReader} onValueChange={(value) => onDataChange('ctaToReader', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select CTA..." />
                </SelectTrigger>
                <SelectContent>
                  {ctaOptions.map((cta) => (
                    <SelectItem key={cta} value={cta}>
                      {cta}
                    </SelectItem>
                  ))}
                  <SelectItem value="custom">Custom CTA</SelectItem>
                </SelectContent>
              </Select>
              {data.ctaToReader === 'custom' && (
                <Input 
                  placeholder="Enter custom CTA"
                  value={data.ctaToReader}
                  onChange={(e) => onDataChange('ctaToReader', e.target.value)}
                  className="mt-2"
                />
              )}
            </div>

            <div>
              <label className="text-sm font-medium">Final Nudging Message</label>
              <p className="text-xs text-gray-500 mb-2">1–2 sentence summary to close out the story</p>
              <Textarea 
                placeholder="Link the ICP's reality to the transformation shown..."
                value={data.finalNudgingMessage}
                onChange={(e) => onDataChange('finalNudgingMessage', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default OutcomeMetricsStep;
