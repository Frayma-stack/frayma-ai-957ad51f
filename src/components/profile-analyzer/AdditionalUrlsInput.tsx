
import { FC } from 'react';

interface AdditionalUrlsInputProps {
  additionalUrls: string;
  onAdditionalUrlsChange: (value: string) => void;
}

const AdditionalUrlsInput: FC<AdditionalUrlsInputProps> = ({ 
  additionalUrls, 
  onAdditionalUrlsChange 
}) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Additional URLs (optional)</label>
      <textarea 
        className="min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        placeholder="Enter additional URLs (one per line)"
        value={additionalUrls}
        onChange={(e) => onAdditionalUrlsChange(e.target.value)}
      />
      <p className="text-xs text-gray-500">
        Add links to blog posts, articles, or other content written by the author.
      </p>
    </div>
  );
};

export default AdditionalUrlsInput;
