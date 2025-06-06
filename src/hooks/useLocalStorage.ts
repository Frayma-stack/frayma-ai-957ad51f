
import { useState, useEffect } from 'react';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { safeGetFromLocalStorage, safeSetToLocalStorage } from './useLocalStorageSafe';

export const useLocalStorage = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [ideas, setIdeas] = useState<GeneratedIdea[]>([]);
  const [icpScripts, setICPScripts] = useState<ICPStoryScript[]>([]);
  const [successStories, setSuccessStories] = useState<CustomerSuccessStory[]>([]);
  const [productContexts, setProductContexts] = useState<ProductContext[]>([]);

  // Load data from localStorage on mount with safe parsing
  useEffect(() => {
    const savedClients = safeGetFromLocalStorage('clients', []);
    setClients(savedClients);

    const savedAuthors = safeGetFromLocalStorage('authors', []);
    setAuthors(savedAuthors);

    const savedIdeas = safeGetFromLocalStorage('ideas', []);
    // Ensure all ideas have a clientId (migrate old data)
    const migratedIdeas = savedIdeas.map((idea: any) => ({
      ...idea,
      clientId: idea.clientId || null
    }));
    setIdeas(migratedIdeas);
    // Save migrated data back
    if (migratedIdeas.length > 0) {
      safeSetToLocalStorage('ideas', migratedIdeas);
    }

    const savedICPScripts = safeGetFromLocalStorage('icpScripts', []);
    // Ensure all scripts have a clientId (migrate old data)
    const migratedScripts = savedICPScripts.map((script: any) => ({
      ...script,
      clientId: script.clientId || null
    }));
    setICPScripts(migratedScripts);
    // Save migrated data back
    if (migratedScripts.length > 0) {
      safeSetToLocalStorage('icpScripts', migratedScripts);
    }

    const savedSuccessStories = safeGetFromLocalStorage('successStories', []);
    // Ensure all stories have a clientId (migrate old data)
    const migratedStories = savedSuccessStories.map((story: any) => ({
      ...story,
      clientId: story.clientId || null
    }));
    setSuccessStories(migratedStories);
    // Save migrated data back
    if (migratedStories.length > 0) {
      safeSetToLocalStorage('successStories', migratedStories);
    }

    const savedProductContexts = safeGetFromLocalStorage('productContexts', []);
    // Ensure all contexts have a clientId (migrate old data)
    const migratedContexts = savedProductContexts.map((context: any) => ({
      ...context,
      clientId: context.clientId || null
    }));
    setProductContexts(migratedContexts);
    // Save migrated data back
    if (migratedContexts.length > 0) {
      safeSetToLocalStorage('productContexts', migratedContexts);
    }
  }, []);

  const handleClientAdded = (client: Client) => {
    const updatedClients = [...clients, client];
    setClients(updatedClients);
    safeSetToLocalStorage('clients', updatedClients);
  };

  const handleClientUpdated = (updatedClient: Client) => {
    const updatedClients = clients.map(client => 
      client.id === updatedClient.id ? updatedClient : client
    );
    setClients(updatedClients);
    safeSetToLocalStorage('clients', updatedClients);
  };

  const handleClientDeleted = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    setClients(updatedClients);
    safeSetToLocalStorage('clients', updatedClients);
  };

  const handleAuthorAdded = (author: Author) => {
    const updatedAuthors = [...authors, author];
    setAuthors(updatedAuthors);
    safeSetToLocalStorage('authors', updatedAuthors);
  };

  const handleAuthorUpdated = (updatedAuthor: Author) => {
    const updatedAuthors = authors.map(author => 
      author.id === updatedAuthor.id ? updatedAuthor : author
    );
    setAuthors(updatedAuthors);
    safeSetToLocalStorage('authors', updatedAuthors);
  };

  const handleAuthorDeleted = (authorId: string) => {
    const updatedAuthors = authors.filter(author => author.id !== authorId);
    setAuthors(updatedAuthors);
    safeSetToLocalStorage('authors', updatedAuthors);
  };

  const handleIdeaAdded = (idea: GeneratedIdea) => {
    const updatedIdeas = [...ideas, idea];
    setIdeas(updatedIdeas);
    safeSetToLocalStorage('ideas', updatedIdeas);
  };

  const handleIdeaUpdated = (updatedIdea: GeneratedIdea) => {
    const updatedIdeas = ideas.map(idea => 
      idea.id === updatedIdea.id ? updatedIdea : idea
    );
    setIdeas(updatedIdeas);
    safeSetToLocalStorage('ideas', updatedIdeas);
  };

  const handleIdeaDeleted = (ideaId: string) => {
    const updatedIdeas = ideas.filter(idea => idea.id !== ideaId);
    setIdeas(updatedIdeas);
    safeSetToLocalStorage('ideas', updatedIdeas);
  };

  const handleICPScriptAdded = (script: ICPStoryScript) => {
    const updatedScripts = [...icpScripts, script];
    setICPScripts(updatedScripts);
    safeSetToLocalStorage('icpScripts', updatedScripts);
  };

  const handleICPScriptUpdated = (updatedScript: ICPStoryScript) => {
    const updatedScripts = icpScripts.map(script => 
      script.id === updatedScript.id ? updatedScript : script
    );
    setICPScripts(updatedScripts);
    safeSetToLocalStorage('icpScripts', updatedScripts);
  };

  const handleICPScriptDeleted = (scriptId: string) => {
    const updatedScripts = icpScripts.filter(script => script.id !== scriptId);
    setICPScripts(updatedScripts);
    safeSetToLocalStorage('icpScripts', updatedScripts);
  };

  const handleSuccessStoryAdded = (story: CustomerSuccessStory) => {
    const updatedStories = [...successStories, story];
    setSuccessStories(updatedStories);
    safeSetToLocalStorage('successStories', updatedStories);
  };

  const handleSuccessStoryUpdated = (updatedStory: CustomerSuccessStory) => {
    const updatedStories = successStories.map(story => 
      story.id === updatedStory.id ? updatedStory : story
    );
    setSuccessStories(updatedStories);
    safeSetToLocalStorage('successStories', updatedStories);
  };

  const handleSuccessStoryDeleted = (storyId: string) => {
    const updatedStories = successStories.filter(story => story.id !== storyId);
    setSuccessStories(updatedStories);
    safeSetToLocalStorage('successStories', updatedStories);
  };

  const handleProductContextAdded = (context: ProductContext) => {
    const updatedContexts = [...productContexts, context];
    setProductContexts(updatedContexts);
    safeSetToLocalStorage('productContexts', updatedContexts);
  };

  const handleProductContextUpdated = (updatedContext: ProductContext) => {
    const updatedContexts = productContexts.map(context => 
      context.id === updatedContext.id ? updatedContext : context
    );
    setProductContexts(updatedContexts);
    safeSetToLocalStorage('productContexts', updatedContexts);
  };

  const handleProductContextDeleted = (contextId: string) => {
    const updatedContexts = productContexts.filter(context => context.id !== contextId);
    setProductContexts(updatedContexts);
    safeSetToLocalStorage('productContexts', updatedContexts);
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
