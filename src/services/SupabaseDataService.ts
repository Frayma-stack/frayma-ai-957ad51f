
import { clientService } from './ClientService';
import { authorService } from './AuthorService';
import { icpScriptService } from './ICPScriptService';
import { successStoryService } from './SuccessStoryService';
import { productContextService } from './ProductContextService';
import { ideaService } from './IdeaService';

export class SupabaseDataService {
  // Client operations
  getClients = clientService.getClients.bind(clientService);
  createClient = clientService.createClient.bind(clientService);
  updateClient = clientService.updateClient.bind(clientService);
  deleteClient = clientService.deleteClient.bind(clientService);

  // Author operations
  getAuthors = authorService.getAuthors.bind(authorService);
  createAuthor = authorService.createAuthor.bind(authorService);
  updateAuthor = authorService.updateAuthor.bind(authorService);
  deleteAuthor = authorService.deleteAuthor.bind(authorService);

  // ICP Script operations
  getICPScripts = icpScriptService.getICPScripts.bind(icpScriptService);
  createICPScript = icpScriptService.createICPScript.bind(icpScriptService);
  updateICPScript = icpScriptService.updateICPScript.bind(icpScriptService);
  deleteICPScript = icpScriptService.deleteICPScript.bind(icpScriptService);

  // Success Story operations
  getSuccessStories = successStoryService.getSuccessStories.bind(successStoryService);
  createSuccessStory = successStoryService.createSuccessStory.bind(successStoryService);
  updateSuccessStory = successStoryService.updateSuccessStory.bind(successStoryService);
  deleteSuccessStory = successStoryService.deleteSuccessStory.bind(successStoryService);

  // Product Context operations
  getProductContexts = productContextService.getProductContexts.bind(productContextService);
  createProductContext = productContextService.createProductContext.bind(productContextService);
  updateProductContext = productContextService.updateProductContext.bind(productContextService);
  deleteProductContext = productContextService.deleteProductContext.bind(productContextService);

  // Ideas operations
  getIdeas = ideaService.getIdeas.bind(ideaService);
  createIdea = ideaService.createIdea.bind(ideaService);
  updateIdea = ideaService.updateIdea.bind(ideaService);
  deleteIdea = ideaService.deleteIdea.bind(ideaService);
}

export const supabaseDataService = new SupabaseDataService();
