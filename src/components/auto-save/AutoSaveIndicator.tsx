
import { FC } from 'react';
import { Save, Clock, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  className?: string;
}

const AutoSaveIndicator: FC<AutoSaveIndicatorProps> = ({
  isSaving,
  lastSaved,
  className
}) => {
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  if (isSaving) {
    return (
      <Badge variant="secondary" className={cn("gap-1", className)}>
        <Save className="h-3 w-3 animate-pulse" />
        Saving...
      </Badge>
    );
  }

  if (lastSaved) {
    return (
      <Badge variant="outline" className={cn("gap-1", className)}>
        <Clock className="h-3 w-3" />
        Saved {getTimeAgo(lastSaved)}
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className={cn("gap-1", className)}>
      <AlertCircle className="h-3 w-3" />
      Not saved
    </Badge>
  );
};

export default AutoSaveIndicator;
