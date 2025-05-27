
import { useState, useEffect } from 'react';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

export const useLocalStorage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [icpScripts, setICPScripts] = useState<ICPStoryScript[]>([]);
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }

    const savedAuthors = localStorage.getItem('authors');
    if (savedAuthors) {
      setAuthors(JSON.parse(savedAuthors));
    }

    const savedIdeas = localStorage.getItem('ideas');
    if (savedIdeas) {
      const parsedIdeas = JSON.parse(savedIdeas) as GeneratedIdea[];
      // Ensure all ideas have a clientId (migrate old data)
      const migratedIdeas = parsedIdeas.map(idea => ({
        ...idea,
        clientId: idea.clientId || null
      }));
      setIdeas(migratedIdeas);
      // Save migrated data back
      localStorage.setItem('ideas', JSON.stringify(migratedIdeas));
    }

    const savedICPScripts = localStorage.getItem('icpScripts');
    if (savedICPScripts) {
      const parsedScripts = JSON.parse(savedICPScripts) as ICPStoryScript[];
      // Ensure all scripts have a clientId (migrate old data)
      const migratedScripts = parsedScripts.map(script => ({
        ...script,
        clientId: script.clientId || null
      }));
      setICPScripts(migratedScripts);
      // Save migrated data back
      localStorage.setItem('icpScripts', JSON.stringify(migratedScripts));
    }

    const savedSuccessStories = localStorage.getItem('successStories');
    if (savedSuccessStories) {
      const parsedStories = JSON.parse(savedSuccessStories) as CustomerSuccessStory[];
      // Ensure all stories have a clientId (migrate old data)
      const migratedStories = parsedStories.map(story => ({
        ...story,
        clientId: story.clientId || null
      }));
      setSuccessStories(migratedStories);
      // Save migrated data back
      localStorage.setItem('successStories', JSON.stringify(migratedStories));
    }

    const savedProductContexts = localStorage.getItem('productContexts');
    if (savedProductContexts) {
      const parsedContexts = JSON.parse(savedProductContexts) as ProductContext[];
      // Ensure all contexts have a clientId (migrate old data)
      const migratedContexts = parsedContexts.map(context => ({
        ...context,
        clientId: context.clientId || null
      }));
      setProductContexts(migratedContexts);
      // Save migrated data back
      localStorage.setItem('productContexts', JSON.stringify(migratedContexts));
    }
  }, []);

  const handleClientAdded = (client: Client) => {
    const updatedClients = [...clients, client];
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleClientUpdated = (updatedClient: Client) => {
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleClientDeleted = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleAuthorAdded = (author: Author) => {
    const updatedAuthors = [...authors, author];
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleAuthorUpdated = (updatedAuthor: Author) => {
    const updatedAuthors = authors.map(author => 
      author.id === updatedAuthor.id ? updatedAuthor : author
    );
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleAuthorDeleted = (authorId: string) => {
    const updatedAuthors = authors.filter(author => author.id !== authorId);
    setAuthors(updatedAuthors);
    localStorage.setItem('authors', JSON.stringify(updatedAuthors));
  };

  const handleIdeaAdded = (idea: GeneratedIdea) => {
    const updatedIdeas = [...ideas, idea];
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const handleIdeaUpdated = (updatedIdea: GeneratedIdea) => {
    const updatedIdeas = ideas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    );
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const handleIdeaDeleted = (ideaId: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== ideaId);
    setIdeas(updatedIdeas);
    localStorage.setItem('ideas', JSON.stringify(updatedIdeas));
  };

  const handleICPScriptAdded = (script: ICPStoryScript) => {
    const updatedScripts = [...icpScripts, script];
    setICPScripts(updatedScripts);
    localStorage.setItem('icpScripts', JSON.stringify(updatedScripts));
  };

  const handleICPScriptUpdated = (updatedScript: ICPStoryScript) => {
    const updatedScripts = icpScripts.map(script => 
      script.id === updatedScript.id ? updatedScript : script
    );
    setICPScripts(updatedScripts);
    localStorage.setItem('icpScripts', JSON.stringify(updatedScripts));
  };

  const handleICPScriptDeleted = (scriptId: string) => {
    const updatedScripts = icpScripts.filter(script => script.id !== scriptId);
    setICPScripts(updatedScripts);
    localStorage.setItem('icpScripts', JSON.stringify(updatedScripts));
  };

  const handleSuccessStoryAdded = (story: CustomerSuccessStory) => {
    const updatedStories = [...successStories, story];
    setSuccessStories(updatedStories);
    localStorage.setItem('successStories', JSON.stringify(updatedStories));
  };

  const handleSuccessStoryUpdated = (updatedStory: CustomerSuccessStory) => {
    const updatedStories = successStories.map(story => 
      story.id === updatedStory.id ? updatedStory : story
    );
    setSuccessStories(updatedStories);
    localStorage.setItem('successStories', JSON.stringify(updatedStories));
  };

  const handleSuccessStoryDeleted = (storyId: string) => {
    const updatedStories = successStories.filter(story => story.id !== storyId);
    setSuccessStories(updatedStories);
    localStorage.setItem('successStories', JSON.stringify(updatedStories));
  };

  const handleProductContextAdded = (context: ProductContext) => {
    const updatedContexts = [...productContexts, context];
    setProductContexts(updatedContexts);
    localStorage.setItem('productContexts', JSON.stringify(updatedContexts));
  };

  const handleProductContextUpdated = (updatedContext: ProductContext) => {
    const updatedContexts = productContexts.map(context => 
      context.id === updatedContext.id ? updatedContext : context
    );
    setProductContexts(updatedContexts);
    localStorage.setItem('productContexts', JSON.stringify(updatedContexts));
  };

  const handleProductContextDeleted = (contextId: string) => {
    const updatedContexts = productContexts.filter(context => context.id !== contextId);
    setProductContexts(updatedContexts);
    localStorage.setItem('productContexts', JSON.stringify(updatedContexts));
  };

  return {
    clients,
    authors,
    ideas,
    icpScripts,
    successStories,
    productContexts,
    handleClientAdded,
    handleClientUpdated,
    handleClientDeleted,
    handleAuthorAdded,
    handleAuthorUpdated,
    handleAuthorDeleted,
    handleIdeaAdded,
    handleIdeaUpdated,
    handleIdeaDeleted,
    handleICPScriptAdded,
    handleICPScriptUpdated,
    handleICPScriptDeleted,
    handleSuccessStoryAdded,
    handleSuccessStoryUpdated,
    handleSuccessStoryDeleted,
    handleProductContextAdded,
    handleProductContextUpdated,
    handleProductContextDeleted,
  };
};
