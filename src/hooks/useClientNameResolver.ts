
import { useState, useEffect } from 'react';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';

interface UseClientNameResolverProps {
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
}

export const useClientNameResolver = ({
  scripts,
  authors,
  successStories
}: UseClientNameResolverProps) => {
  const [clientName, setClientName] = useState<string | null>(null);

  // Determine client name
  useEffect(() => {
    if (scripts.length > 0 || authors.length > 0 || successStories.length > 0) {
      const scriptClientId = scripts.length > 0 ? scripts[0].clientId : undefined;
      const authorClientId = authors.length > 0 ? authors[0].clientId : undefined;
      const storyClientId = successStories.length > 0 ? successStories[0].clientId : undefined;
      
      const clientId = scriptClientId || authorClientId || storyClientId;
      if (clientId) {
        const savedClients = localStorage.getItem('clients');
        if (savedClients) {
          const clients = JSON.parse(savedClients);
          const client = clients.find((c: any) => c.id === clientId);
          if (client) {
            setClientName(client.name);
          }
        }
      } else {
        setClientName("All Clients");
      }
    } else {
      setClientName(null);
    }
  }, [scripts, authors, successStories]);

  return { clientName };
};
