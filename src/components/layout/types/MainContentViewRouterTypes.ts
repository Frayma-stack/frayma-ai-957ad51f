
import { ContentType, ArticleSubType } from '@/components/ContentTypeSelector';
import { Client, Author, ICPStoryScript, CustomerSuccessStory, ProductContext } from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';
import { ViewType } from '@/components/layout/AppLayout';

export interface MainContentViewRouterProps {
  currentView: ViewType;
  selectedType: ContentType | null;
  selectedArticleSubtype: ArticleSubType | null;
  selectedClientId: string | null;
  clients: Client[];
  filteredAuthors: Author[];
  filteredICPScripts: ICPStoryScript[];
  filteredSuccessStories: CustomerSuccessStory[];
  currentProductContext: ProductContext | null;
  ideas: GeneratedIdea[];
  onContentTypeSelect: (type: ContentType) => void;
  onArticleSubtypeSelect: (subtype: ArticleSubType) => void;
  onBack: () => void;
  onClientAdded: (client: Client, productContext?: ProductContext) => void;
  onClientUpdated: (client: Client, productContext?: ProductContext) => void;
  onClientDeleted: (clientId: string) => void;
  onClientSelected: (clientId: string | null) => void;
  onViewClientAssets: (clientId: string, assetType: string) => void;
  onAuthorAdded: (author: Author) => void;
  onAuthorUpdated: (author: Author) => void;
  onAuthorDeleted: (authorId: string) => void;
  onIdeaAdded: (idea: GeneratedIdea) => void;
  onIdeaUpdated: (idea: GeneratedIdea) => void;
  onIdeaDeleted: (ideaId: string) => void;
  onICPScriptAdded: (script: ICPStoryScript) => void;
  onICPScriptUpdated: (script: ICPStoryScript) => void;
  onICPScriptDeleted: (scriptId: string) => void;
  onSuccessStoryAdded: (story: CustomerSuccessStory) => void;
  onSuccessStoryUpdated: (story: CustomerSuccessStory) => void;
  onSuccessStoryDeleted: (storyId: string) => void;
  onProductContextAdded: (context: ProductContext) => void;
  onProductContextUpdated: (context: ProductContext) => void;
  onProductContextDeleted: (contextId: string) => void;
  onIdeaContentTypeSelect: (ideaId: string, contentType: string) => void;
  onNavigateToIdeasBank?: () => void;
}
