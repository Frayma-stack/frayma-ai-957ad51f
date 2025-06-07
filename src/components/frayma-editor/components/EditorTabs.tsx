
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, List, Image, Eye } from 'lucide-react';
import { EditorTab } from '../types';

interface EditorTabsProps {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

export const EditorTabs: React.FC<EditorTabsProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <div className="border-b bg-gray-50">
      <Tabs value={activeTab} onValueChange={(value) => onTabChange(value as EditorTab)}>
        <TabsList className="grid w-full grid-cols-4 bg-transparent">
          <TabsTrigger value="outline" className="flex items-center space-x-2">
            <List className="h-4 w-4" />
            <span>Outline</span>
          </TabsTrigger>
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Editor</span>
          </TabsTrigger>
          <TabsTrigger value="visuals" className="flex items-center space-x-2">
            <Image className="h-4 w-4" />
            <span>Visuals</span>
          </TabsTrigger>
          <TabsTrigger value="review" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Review</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};
