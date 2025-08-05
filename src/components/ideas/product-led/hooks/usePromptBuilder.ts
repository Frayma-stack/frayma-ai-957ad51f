
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { ProductContextInputs, TriggerInput } from './types';

export const usePromptBuilder = () => {
  const buildInitialPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined,
    productContext?: ProductContext | null
  ): string => {
    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach leveraged for crafting first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not just tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's, but through compelling, point-of-view-driven narratives that match how busy B2B buyers think and decide.

You are a world-class narrative strategist helping B2B SaaS teams craft compelling, resonant GTM narratives. Using the Product-Led Storytelling approach above, generate 30 rare, non-obvious content ideas (for articles, newsletters, sales enablement assets, GTM video content scripts, and LinkedIn posts) that subtly weave in product value without sounding salesy.

NARRATIVE TRIGGER
- Idea Trigger: ${triggerInput.content}`;

    if (productInputs.povNarrativeDirection.trim()) {
      prompt += `
- Optional Narrative Direction/POV: ${productInputs.povNarrativeDirection}`;
    }

    prompt += `\n\n---

📈 BUSINESS CONTEXT ITEM

`;

    // Add detailed business context based on selection with all metadata
    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length > 0) {
      prompt += `**Selected Feature:**`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `
- Name: ${feature.name}
- Description: ${feature.description || 'Feature that enhances user productivity and workflow efficiency through intuitive design and powerful capabilities.'}
- Benefits: ${feature.benefits.join(', ')}`;
      });
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length > 0) {
      prompt += `**Selected Use Case:**`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `
- Title: ${useCase.useCase}
- Target ICP/Team: ${useCase.userRole}
- Use case summary: ${useCase.description || 'This use case demonstrates how teams leverage our solution to streamline complex workflows, reduce manual effort, and achieve measurable improvements in their daily operations.'}`;
      });
    }

    if (productInputs.businessContextItem === 'differentiator' && productInputs.selectedDifferentiators.length > 0) {
      prompt += `**Selected Differentiator:**`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `
- Name: ${diff.name}
- 2-sentence uniqueness: ${diff.description || 'Our unique approach fundamentally changes how teams approach this challenge. Unlike traditional solutions, we provide a more intuitive and powerful way to achieve results.'}
- 3-sentence comparison: While competitors focus on basic functionality, we deliver comprehensive value through innovative design and deep user understanding. Our solution addresses root causes rather than symptoms, providing sustainable long-term benefits. This approach results in higher adoption rates and measurable business impact for our customers.`;
      });
    }

    if (productInputs.businessContextItem === 'category_pov' && productContext) {
      prompt += `**Selected Category POV:**
- Statement: ${productContext.categoryPOV}
- Strategic relevance: This positioning differentiates us in the market by challenging conventional thinking and establishing thought leadership that resonates with forward-thinking buyers.`;
    }

    if (productInputs.businessContextItem === 'unique_insight' && productContext) {
      prompt += `**Selected Unique Insight:**
- Summary: ${productContext.uniqueInsight}
- Origin: This insight emerged from deep customer research and market analysis, revealing non-obvious truths that drive meaningful business transformation.`;
    }

    if (productInputs.businessContextItem === 'mission_vision' && productContext) {
      prompt += `**Selected Mission/Vision:**
- Mission: ${productContext.companyMission}
- Vision: To become the leading platform that empowers teams to achieve their full potential through innovative technology.
- Strategic GTM Relevance: This mission-driven approach creates authentic connections with prospects who share similar values and aspirations, differentiating us from purely product-focused competitors.`;
    }

    if (productInputs.businessContextItem === 'success_story' && productInputs.selectedSuccessStory) {
      const story = productInputs.selectedSuccessStory;
      prompt += `**Selected Success Story:**
- 3–5 sentence story: ${story.title}. ${story.beforeSummary} The transformation involved implementing our solution to address their core challenges. ${story.afterSummary} This success demonstrates the tangible value and ROI that similar organizations can achieve.
- 2-sentence transformation: The customer experienced significant improvements in their key metrics and operational efficiency. This transformation showcases the real-world impact our solution delivers for organizations facing similar challenges.`;
      
      if (story.features && story.features.length > 0) {
        prompt += `
- Feature/use case tie-in: Key features utilized included ${story.features.map((f: any) => f.name).join(', ')}, demonstrating practical application and value delivery.`;
      } else {
        prompt += `
- Feature/use case tie-in: The success leveraged core platform capabilities to deliver measurable business outcomes and operational improvements.`;
      }
    }

    prompt += `\n\nFor each idea, return the following structure:
**Title** – punchy and specific (not generic, not clickbait).
**Narrative** – Your thoughtful instructions for how to approach this content idea (3–4 sentences). Guide the user on what tension or belief this idea should challenge or advance, and specifically how you recommend they frame the narrative to resonate with ${selectedICP?.name || '[ICP_NAME]'}. Explain the mindset shift you want to create in their audience and why this particular angle will cut through the noise. Make this feel like strategic counsel from an expert narrative strategist who understands their market positioning.
**Product Tie-in** – Your specific guidance for naturally weaving in their selected business context (3–4 sentences). Walk them through exactly how you recommend they subtly surface their unique value without being salesy. Explain the natural bridge between the narrative angle and their business context, and give them confidence in how to make this connection feel organic and compelling. Make this feel like you're personally coaching them on the art of subtle product integration.
**CTA** – what's one specific, low-friction action the reader would be compelled (and should be prompted) to take during or after the GTM content piece crafted with this idea, based on Product Tie-in?

Make each idea smart, thoughtful, strategic, and tailored to ${selectedICP?.name || '[ICP_NAME]'}—as if you're Frayma AI personally guiding them to see themselves in the story and helping them flag down their ideal prospects in a crowded space.

Write the Narrative and Product Tie-in sections as if you're their trusted narrative strategist, speaking directly to them with specific, actionable guidance that acknowledges their chosen business context and target audience. Make it feel personal, insightful, and reassuring—not generic or template-like.

Avoid generic fluff. Think like Frayma AI providing personalized strategic counsel to a category-defining founder or Head of Marketing who trusts you to guide them toward achieving their ambitious goals.`;

    return prompt;
  };

  const buildRegenerationPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined,
    regenerationDirection: string,
    productContext?: ProductContext | null
  ): string => {
    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach leveraged for crafting first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not just tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's, but through compelling, point-of-view-driven narratives that match how busy B2B buyers think and decide.

You are a world-class narrative strategist helping B2B SaaS teams craft compelling, resonant GTM narratives. Using the Product-Led Storytelling approach above, generate 30 rare, non-obvious content ideas (for articles, newsletters, sales enablement assets, GTM video content scripts, and LinkedIn posts) that subtly weave in product value without sounding salesy.

🔄 **COMPLETE REGENERATION** with fresh context and direction.

NARRATIVE TRIGGER
- Idea Trigger: ${triggerInput.content}
- NEW Narrative Direction/POV: ${regenerationDirection}

---

📈 BUSINESS CONTEXT ITEM

`;

    // Add detailed business context based on selection with all metadata
    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length > 0) {
      prompt += `**Selected Feature:**`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `
- Name: ${feature.name}
- Description: ${feature.description || 'Feature that enhances user productivity and workflow efficiency through intuitive design and powerful capabilities.'}
- Benefits: ${feature.benefits.join(', ')}`;
      });
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length > 0) {
      prompt += `**Selected Use Case:**`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `
- Title: ${useCase.useCase}
- Target ICP/Team: ${useCase.userRole}
- Use case summary: ${useCase.description || 'This use case demonstrates how teams leverage our solution to streamline complex workflows, reduce manual effort, and achieve measurable improvements in their daily operations.'}`;
      });
    }

    if (productInputs.businessContextItem === 'differentiator' && productInputs.selectedDifferentiators.length > 0) {
      prompt += `**Selected Differentiator:**`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `
- Name: ${diff.name}
- 2-sentence uniqueness: ${diff.description || 'Our unique approach fundamentally changes how teams approach this challenge. Unlike traditional solutions, we provide a more intuitive and powerful way to achieve results.'}
- 3-sentence comparison: While competitors focus on basic functionality, we deliver comprehensive value through innovative design and deep user understanding. Our solution addresses root causes rather than symptoms, providing sustainable long-term benefits. This approach results in higher adoption rates and measurable business impact for our customers.`;
      });
    }

    if (productInputs.businessContextItem === 'category_pov' && productContext) {
      prompt += `**Selected Category POV:**
- Statement: ${productContext.categoryPOV}
- Strategic relevance: This positioning differentiates us in the market by challenging conventional thinking and establishing thought leadership that resonates with forward-thinking buyers.`;
    }

    if (productInputs.businessContextItem === 'unique_insight' && productContext) {
      prompt += `**Selected Unique Insight:**
- Summary: ${productContext.uniqueInsight}
- Origin: This insight emerged from deep customer research and market analysis, revealing non-obvious truths that drive meaningful business transformation.`;
    }

    if (productInputs.businessContextItem === 'mission_vision' && productContext) {
      prompt += `**Selected Mission/Vision:**
- Mission: ${productContext.companyMission}
- Vision: To become the leading platform that empowers teams to achieve their full potential through innovative technology.
- Strategic GTM Relevance: This mission-driven approach creates authentic connections with prospects who share similar values and aspirations, differentiating us from purely product-focused competitors.`;
    }

    if (productInputs.businessContextItem === 'success_story' && productInputs.selectedSuccessStory) {
      const story = productInputs.selectedSuccessStory;
      prompt += `**Selected Success Story:**
- 3–5 sentence story: ${story.title}. ${story.beforeSummary} The transformation involved implementing our solution to address their core challenges. ${story.afterSummary} This success demonstrates the tangible value and ROI that similar organizations can achieve.
- 2-sentence transformation: The customer experienced significant improvements in their key metrics and operational efficiency. This transformation showcases the real-world impact our solution delivers for organizations facing similar challenges.`;
      
      if (story.features && story.features.length > 0) {
        prompt += `
- Feature/use case tie-in: Key features utilized included ${story.features.map((f: any) => f.name).join(', ')}, demonstrating practical application and value delivery.`;
      } else {
        prompt += `
- Feature/use case tie-in: The success leveraged core platform capabilities to deliver measurable business outcomes and operational improvements.`;
      }
    }

    prompt += `\n\nFor each idea, return the following structure:
**Title** – punchy and specific (not generic, not clickbait).
**Narrative** – Your thoughtful instructions for how to approach this content idea (3–4 sentences). Guide the user on what tension or belief this idea should challenge or advance, and specifically how you recommend they frame the narrative to resonate with ${selectedICP?.name || '[ICP_NAME]'}. Explain the mindset shift you want to create in their audience and why this particular angle will cut through the noise. Make this feel like strategic counsel from an expert narrative strategist who understands their market positioning.
**Product Tie-in** – Your specific guidance for naturally weaving in their selected business context (3–4 sentences). Walk them through exactly how you recommend they subtly surface their unique value without being salesy. Explain the natural bridge between the narrative angle and their business context, and give them confidence in how to make this connection feel organic and compelling. Make this feel like you're personally coaching them on the art of subtle product integration.
**CTA** – what's one specific, low-friction action the reader would be compelled (and should be prompted) to take during or after the GTM content piece crafted with this idea, based on Product Tie-in?

Make each idea smart, thoughtful, strategic, and tailored to ${selectedICP?.name || '[ICP_NAME]'}—as if you're Frayma AI personally guiding them to see themselves in the story and helping them flag down their ideal prospects in a crowded space.

Write the Narrative and Product Tie-in sections as if you're their trusted narrative strategist, speaking directly to them with specific, actionable guidance that acknowledges their chosen business context and target audience. Make it feel personal, insightful, and reassuring—not generic or template-like.

Avoid generic fluff. Think like Frayma AI providing personalized strategic counsel to a category-defining founder or Head of Marketing who trusts you to guide them toward achieving their ambitious goals.`;

    return prompt;
  };

  return {
    buildInitialPrompt,
    buildRegenerationPrompt
  };
};
