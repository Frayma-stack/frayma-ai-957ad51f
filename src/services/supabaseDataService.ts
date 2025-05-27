
import { supabase } from '@/integrations/supabase/client';
import { 
  Client, 
  Author, 
  ICPStoryScript, 
  CustomerSuccessStory, 
  ProductContext,
  CompanyLink,
  AuthorExperience,
  AuthorToneItem,
  AuthorBelief,
  AuthorSocialLink,
  ICPStoryScriptItem
} from '@/types/storytelling';
import { GeneratedIdea } from '@/types/ideas';

export class SupabaseDataService {
  // Client operations
  async getClients(): Promise<Client[]> {
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(client => ({
      id: client.id,
      name: client.name,
      description: client.description,
      companyLinks: Array.isArray(client.company_links) ? client.company_links as CompanyLink[] : [],
      createdAt: client.created_at
    }));
  }

  async createClient(client: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .insert({
        name: client.name,
        description: client.description || null,
        company_links: client.companyLinks || []
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      companyLinks: Array.isArray(data.company_links) ? data.company_links as CompanyLink[] : [],
      createdAt: data.created_at
    };
  }

  async updateClient(client: Client): Promise<Client> {
    const { data, error } = await supabase
      .from('clients')
      .update({
        name: client.name,
        description: client.description || null,
        company_links: client.companyLinks || []
      })
      .eq('id', client.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      companyLinks: Array.isArray(data.company_links) ? data.company_links as CompanyLink[] : [],
      createdAt: data.created_at
    };
  }

  async deleteClient(clientId: string): Promise<void> {
    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', clientId);
    
    if (error) throw error;
  }

  // Author operations
  async getAuthors(): Promise<Author[]> {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(author => ({
      id: author.id,
      name: author.name,
      role: author.role,
      organization: author.organization,
      backstory: author.backstory,
      experiences: Array.isArray(author.experiences) ? author.experiences as AuthorExperience[] : [],
      tones: Array.isArray(author.tones) ? author.tones as AuthorToneItem[] : [],
      beliefs: Array.isArray(author.beliefs) ? author.beliefs as AuthorBelief[] : [],
      socialLinks: Array.isArray(author.social_links) ? author.social_links as AuthorSocialLink[] : [],
      clientId: author.client_id
    }));
  }

  async createAuthor(author: Omit<Author, 'id'>): Promise<Author> {
    const { data, error } = await supabase
      .from('authors')
      .insert({
        name: author.name,
        role: author.role,
        organization: author.organization,
        backstory: author.backstory,
        experiences: author.experiences || [],
        tones: author.tones || [],
        beliefs: author.beliefs || [],
        social_links: author.socialLinks || [],
        client_id: author.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      organization: data.organization,
      backstory: data.backstory,
      experiences: Array.isArray(data.experiences) ? data.experiences as AuthorExperience[] : [],
      tones: Array.isArray(data.tones) ? data.tones as AuthorToneItem[] : [],
      beliefs: Array.isArray(data.beliefs) ? data.beliefs as AuthorBelief[] : [],
      socialLinks: Array.isArray(data.social_links) ? data.social_links as AuthorSocialLink[] : [],
      clientId: data.client_id
    };
  }

  async updateAuthor(author: Author): Promise<Author> {
    const { data, error } = await supabase
      .from('authors')
      .update({
        name: author.name,
        role: author.role,
        organization: author.organization,
        backstory: author.backstory,
        experiences: author.experiences || [],
        tones: author.tones || [],
        beliefs: author.beliefs || [],
        social_links: author.socialLinks || [],
        client_id: author.clientId || null
      })
      .eq('id', author.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      role: data.role,
      organization: data.organization,
      backstory: data.backstory,
      experiences: Array.isArray(data.experiences) ? data.experiences as AuthorExperience[] : [],
      tones: Array.isArray(data.tones) ? data.tones as AuthorToneItem[] : [],
      beliefs: Array.isArray(data.beliefs) ? data.beliefs as AuthorBelief[] : [],
      socialLinks: Array.isArray(data.social_links) ? data.social_links as AuthorSocialLink[] : [],
      clientId: data.client_id
    };
  }

  async deleteAuthor(authorId: string): Promise<void> {
    const { error } = await supabase
      .from('authors')
      .delete()
      .eq('id', authorId);
    
    if (error) throw error;
  }

  // ICP Story Script operations
  async getICPScripts(): Promise<ICPStoryScript[]> {
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(script => ({
      id: script.id,
      name: script.name,
      demographics: script.demographics,
      coreBeliefs: Array.isArray(script.core_beliefs) ? script.core_beliefs as ICPStoryScriptItem[] : [],
      internalPains: Array.isArray(script.internal_pains) ? script.internal_pains as ICPStoryScriptItem[] : [],
      externalStruggles: Array.isArray(script.external_struggles) ? script.external_struggles as ICPStoryScriptItem[] : [],
      desiredTransformations: Array.isArray(script.desired_transformations) ? script.desired_transformations as ICPStoryScriptItem[] : [],
      clientId: script.client_id
    }));
  }

  async createICPScript(script: Omit<ICPStoryScript, 'id'>): Promise<ICPStoryScript> {
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .insert({
        name: script.name,
        demographics: script.demographics,
        core_beliefs: script.coreBeliefs || [],
        internal_pains: script.internalPains || [],
        external_struggles: script.externalStruggles || [],
        desired_transformations: script.desiredTransformations || [],
        client_id: script.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      demographics: data.demographics,
      coreBeliefs: Array.isArray(data.core_beliefs) ? data.core_beliefs as ICPStoryScriptItem[] : [],
      internalPains: Array.isArray(data.internal_pains) ? data.internal_pains as ICPStoryScriptItem[] : [],
      externalStruggles: Array.isArray(data.external_struggles) ? data.external_struggles as ICPStoryScriptItem[] : [],
      desiredTransformations: Array.isArray(data.desired_transformations) ? data.desired_transformations as ICPStoryScriptItem[] : [],
      clientId: data.client_id
    };
  }

  async updateICPScript(script: ICPStoryScript): Promise<ICPStoryScript> {
    const { data, error } = await supabase
      .from('icp_story_scripts')
      .update({
        name: script.name,
        demographics: script.demographics,
        core_beliefs: script.coreBeliefs || [],
        internal_pains: script.internalPains || [],
        external_struggles: script.externalStruggles || [],
        desired_transformations: script.desiredTransformations || [],
        client_id: script.clientId || null
      })
      .eq('id', script.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      name: data.name,
      demographics: data.demographics,
      coreBeliefs: Array.isArray(data.core_beliefs) ? data.core_beliefs as ICPStoryScriptItem[] : [],
      internalPains: Array.isArray(data.internal_pains) ? data.internal_pains as ICPStoryScriptItem[] : [],
      externalStruggles: Array.isArray(data.external_struggles) ? data.external_struggles as ICPStoryScriptItem[] : [],
      desiredTransformations: Array.isArray(data.desired_transformations) ? data.desired_transformations as ICPStoryScriptItem[] : [],
      clientId: data.client_id
    };
  }

  async deleteICPScript(scriptId: string): Promise<void> {
    const { error } = await supabase
      .from('icp_story_scripts')
      .delete()
      .eq('id', scriptId);
    
    if (error) throw error;
  }

  // Success Story operations
  async getSuccessStories(): Promise<CustomerSuccessStory[]> {
    const { data, error } = await supabase
      .from('success_stories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(story => ({
      id: story.id,
      title: story.title,
      url: story.url,
      beforeSummary: story.before_summary,
      afterSummary: story.after_summary,
      quotes: Array.isArray(story.quotes) ? story.quotes as any[] : [],
      features: Array.isArray(story.features) ? story.features as any[] : [],
      clientId: story.client_id,
      createdAt: story.created_at
    }));
  }

  async createSuccessStory(story: Omit<CustomerSuccessStory, 'id'>): Promise<CustomerSuccessStory> {
    const { data, error } = await supabase
      .from('success_stories')
      .insert({
        title: story.title,
        url: story.url || null,
        before_summary: story.beforeSummary,
        after_summary: story.afterSummary,
        quotes: story.quotes || [],
        features: story.features || [],
        client_id: story.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      beforeSummary: data.before_summary,
      afterSummary: data.after_summary,
      quotes: Array.isArray(data.quotes) ? data.quotes as any[] : [],
      features: Array.isArray(data.features) ? data.features as any[] : [],
      clientId: data.client_id,
      createdAt: data.created_at
    };
  }

  async updateSuccessStory(story: CustomerSuccessStory): Promise<CustomerSuccessStory> {
    const { data, error } = await supabase
      .from('success_stories')
      .update({
        title: story.title,
        url: story.url || null,
        before_summary: story.beforeSummary,
        after_summary: story.afterSummary,
        quotes: story.quotes || [],
        features: story.features || [],
        client_id: story.clientId || null
      })
      .eq('id', story.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      url: data.url,
      beforeSummary: data.before_summary,
      afterSummary: data.after_summary,
      quotes: Array.isArray(data.quotes) ? data.quotes as any[] : [],
      features: Array.isArray(data.features) ? data.features as any[] : [],
      clientId: data.client_id,
      createdAt: data.created_at
    };
  }

  async deleteSuccessStory(storyId: string): Promise<void> {
    const { error } = await supabase
      .from('success_stories')
      .delete()
      .eq('id', storyId);
    
    if (error) throw error;
  }

  // Product Context operations
  async getProductContexts(): Promise<ProductContext[]> {
    const { data, error } = await supabase
      .from('product_contexts')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(context => ({
      id: context.id,
      features: Array.isArray(context.features) ? context.features as any[] : [],
      useCases: Array.isArray(context.use_cases) ? context.use_cases as any[] : [],
      differentiators: Array.isArray(context.differentiators) ? context.differentiators as any[] : [],
      categoryPOV: context.category_pov,
      companyMission: context.company_mission,
      uniqueInsight: context.unique_insight,
      companyLinks: Array.isArray(context.company_links) ? context.company_links as CompanyLink[] : [],
      clientId: context.client_id
    }));
  }

  async createProductContext(context: Omit<ProductContext, 'id'>): Promise<ProductContext> {
    const { data, error } = await supabase
      .from('product_contexts')
      .insert({
        features: context.features || [],
        use_cases: context.useCases || [],
        differentiators: context.differentiators || [],
        category_pov: context.categoryPOV,
        company_mission: context.companyMission,
        unique_insight: context.uniqueInsight,
        company_links: context.companyLinks || [],
        client_id: context.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      features: Array.isArray(data.features) ? data.features as any[] : [],
      useCases: Array.isArray(data.use_cases) ? data.use_cases as any[] : [],
      differentiators: Array.isArray(data.differentiators) ? data.differentiators as any[] : [],
      categoryPOV: data.category_pov,
      companyMission: data.company_mission,
      uniqueInsight: data.unique_insight,
      companyLinks: Array.isArray(data.company_links) ? data.company_links as CompanyLink[] : [],
      clientId: data.client_id
    };
  }

  async updateProductContext(context: ProductContext): Promise<ProductContext> {
    const { data, error } = await supabase
      .from('product_contexts')
      .update({
        features: context.features || [],
        use_cases: context.useCases || [],
        differentiators: context.differentiators || [],
        category_pov: context.categoryPOV,
        company_mission: context.companyMission,
        unique_insight: context.uniqueInsight,
        company_links: context.companyLinks || [],
        client_id: context.clientId || null
      })
      .eq('id', context.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      features: Array.isArray(data.features) ? data.features as any[] : [],
      useCases: Array.isArray(data.use_cases) ? data.use_cases as any[] : [],
      differentiators: Array.isArray(data.differentiators) ? data.differentiators as any[] : [],
      categoryPOV: data.category_pov,
      companyMission: data.company_mission,
      uniqueInsight: data.unique_insight,
      companyLinks: Array.isArray(data.company_links) ? data.company_links as CompanyLink[] : [],
      clientId: data.client_id
    };
  }

  async deleteProductContext(contextId: string): Promise<void> {
    const { error } = await supabase
      .from('product_contexts')
      .delete()
      .eq('id', contextId);
    
    if (error) throw error;
  }

  // Ideas operations
  async getIdeas(): Promise<GeneratedIdea[]> {
    const { data, error } = await supabase
      .from('ideas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return (data || []).map(idea => ({
      id: idea.id,
      title: idea.title,
      narrative: idea.narrative || '',
      productTieIn: idea.product_tie_in || '',
      cta: idea.cta || '',
      createdAt: idea.created_at,
      score: idea.score ? { value: idea.score as 0 | 1 | 2 | 3, label: `${idea.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: idea.client_id,
      // Default values for required fields
      icpId: '',
      narrativeAnchor: 'belief' as const,
      narrativeItemId: '',
      productFeatures: []
    }));
  }

  async createIdea(idea: Omit<GeneratedIdea, 'id'>): Promise<GeneratedIdea> {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        title: idea.title,
        narrative: idea.narrative || null,
        product_tie_in: idea.productTieIn || null,
        cta: idea.cta || null,
        score: idea.score?.value || 1,
        client_id: idea.clientId || null
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      narrative: data.narrative || '',
      productTieIn: data.product_tie_in || '',
      cta: data.cta || '',
      createdAt: data.created_at,
      score: data.score ? { value: data.score as 0 | 1 | 2 | 3, label: `${data.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: data.client_id,
      icpId: '',
      narrativeAnchor: 'belief' as const,
      narrativeItemId: '',
      productFeatures: []
    };
  }

  async updateIdea(idea: GeneratedIdea): Promise<GeneratedIdea> {
    const { data, error } = await supabase
      .from('ideas')
      .update({
        title: idea.title,
        narrative: idea.narrative || null,
        product_tie_in: idea.productTieIn || null,
        cta: idea.cta || null,
        score: idea.score?.value || 1,
        client_id: idea.clientId || null
      })
      .eq('id', idea.id)
      .select()
      .single();
    
    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      narrative: data.narrative || '',
      productTieIn: data.product_tie_in || '',
      cta: data.cta || '',
      createdAt: data.created_at,
      score: data.score ? { value: data.score as 0 | 1 | 2 | 3, label: `${data.score}` } : null,
      source: { type: 'text' as const, content: 'Stored in database' },
      clientId: data.client_id,
      icpId: idea.icpId,
      narrativeAnchor: idea.narrativeAnchor,
      narrativeItemId: idea.narrativeItemId,
      productFeatures: idea.productFeatures
    };
  }

  async deleteIdea(ideaId: string): Promise<void> {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', ideaId);
    
    if (error) throw error;
  }
}

export const supabaseDataService = new SupabaseDataService();
