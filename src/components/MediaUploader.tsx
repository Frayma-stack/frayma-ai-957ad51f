
import { FC, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { MediaAttachment } from '@/types/storytelling';
import { Plus, Trash, Image, FileVideo } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

interface MediaUploaderProps {
  media: MediaAttachment[];
  onMediaChange: (media: MediaAttachment[]) => void;
  maxFiles?: number;
}

const MediaUploader: FC<MediaUploaderProps> = ({ media, onMediaChange, maxFiles = 5 }) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (media.length + files.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can upload a maximum of ${maxFiles} files.`,
        variant: "destructive"
      });
      return;
    }
    
    // Convert FileList to Array and process each file
    Array.from(files).forEach(file => {
      // Check file type
      let fileType: 'image' | 'video' | 'gif' = 'image';
      if (file.type.startsWith('video/')) {
        fileType = 'video';
      } else if (file.type === 'image/gif') {
        fileType = 'gif';
      } else if (!file.type.startsWith('image/')) {
        toast({
          title: "Unsupported file type",
          description: "Please upload only images, GIFs, or videos.",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (limit to 5MB for simplicity)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload files smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      // Create object URL for preview
      const url = URL.createObjectURL(file);
      
      // Add new media to the list
      onMediaChange([
        ...media,
        {
          id: crypto.randomUUID(),
          type: fileType,
          url,
          description: description || file.name.split('.')[0],
          fileName: file.name
        }
      ]);
      
      // Reset description
      setDescription('');
    });
    
    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };
  
  const removeMedia = (id: string) => {
    const updatedMedia = media.filter(item => item.id !== id);
    onMediaChange(updatedMedia);
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex gap-2">
          <Textarea 
            placeholder="Add a description for your upload"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="flex-1"
            rows={2}
          />
          <div className="flex flex-col gap-2">
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              disabled={media.length >= maxFiles}
              className="h-full flex-1"
            >
              <Plus className="h-4 w-4 mr-1" /> Upload
            </Button>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="hidden"
          accept="image/*,video/*"
          multiple
        />
        <p className="text-xs text-gray-500 mt-1">
          Upload images (.jpg, .png), GIFs, or videos (.mp4) to enhance your content.
          Max {maxFiles} files, each under 5MB.
        </p>
      </div>
      
      {media.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {media.map(item => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-video bg-gray-100 relative">
                {item.type === 'image' || item.type === 'gif' ? (
                  <img 
                    src={item.url} 
                    alt={item.description} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <video 
                    src={item.url} 
                    controls
                    className="w-full h-full object-contain"
                  />
                )}
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => removeMedia(item.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
                {item.type === 'image' ? (
                  <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded">
                    <Image className="h-4 w-4" />
                  </div>
                ) : (
                  <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded">
                    <FileVideo className="h-4 w-4" />
                  </div>
                )}
              </div>
              <CardContent className="p-3">
                <p className="text-sm font-medium truncate">{item.fileName}</p>
                <p className="text-xs text-gray-500 line-clamp-2">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
