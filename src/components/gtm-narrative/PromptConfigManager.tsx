
import { FC, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Settings, RotateCcw, Upload, Download } from 'lucide-react';
import { usePromptConfig } from './usePromptConfig';
import { PromptCategory, PromptTemplate } from '@/types/prompts';
import { useToast } from "@/hooks/use-toast";

interface PromptConfigManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<PromptCategory, string> = {
  content_triggers: 'Content Discovery Triggers',
  headlines_generation: 'Headlines Generation',
  outline_sections: 'Outline Sections',
  intro_generation: 'Introduction Generation',
  body_generation: 'Body Generation',
  conclusion_generation: 'Conclusion Generation'
};

const PromptConfigManager: FC<PromptConfigManagerProps> = ({ isOpen, onClose }) => {
  const { prompts, updatePrompt, resetPrompt, resetAllPrompts, importPrompts } = usePromptConfig();
  const { toast } = useToast();
  const [activeCategory, setActiveCategory] = useState<PromptCategory>('content_triggers');

  const handlePromptChange = (category: PromptCategory, field: keyof PromptTemplate, value: string) => {
    updatePrompt(category, { [field]: value });
  };

  const handleImportPrompts = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string);
        importPrompts(importedData);
        toast({
          title: "Prompts imported successfully",
          description: "All prompt templates have been updated."
        });
      } catch (error) {
        toast({
          title: "Import failed",
          description: "Invalid JSON format. Please check your file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const handleExportPrompts = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'gtm_narrative_prompts.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            <CardTitle>Prompt Configuration Manager</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExportPrompts}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <label className="cursor-pointer">
              <Button variant="outline" size="sm" asChild>
                <span>
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </span>
              </Button>
              <input
                type="file"
                accept=".json"
                onChange={handleImportPrompts}
                className="hidden"
              />
            </label>
            <Button variant="outline" size="sm" onClick={resetAllPrompts}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset All
            </Button>
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-hidden">
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as PromptCategory)} className="h-full flex flex-col">
            <TabsList className="grid grid-cols-3 lg:grid-cols-6">
              {Object.entries(CATEGORY_LABELS).map(([category, label]) => (
                <TabsTrigger key={category} value={category} className="text-xs">
                  {label.split(' ')[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {Object.entries(prompts).map(([category, prompt]) => (
              <TabsContent key={category} value={category} className="flex-1 overflow-hidden">
                <div className="space-y-4 h-full flex flex-col">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{CATEGORY_LABELS[category as PromptCategory]}</h3>
                      <p className="text-sm text-gray-600">{prompt.description}</p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => resetPrompt(category as PromptCategory)}
                    >
                      Reset to Default
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        value={prompt.name}
                        onChange={(e) => handlePromptChange(category as PromptCategory, 'name', e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={prompt.description}
                        onChange={(e) => handlePromptChange(category as PromptCategory, 'description', e.target.value)}
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2 flex-1">
                      <Label htmlFor="template">Prompt Template</Label>
                      <Textarea
                        id="template"
                        value={prompt.template}
                        onChange={(e) => handlePromptChange(category as PromptCategory, 'template', e.target.value)}
                        className="min-h-[300px] font-mono text-sm"
                        placeholder="Enter your custom prompt template..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <Label>Available Variables</Label>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {prompt.variables.map((variable) => (
                          <Badge key={variable} variant="secondary" className="text-xs">
                            {`{{${variable}}}`}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default PromptConfigManager;
