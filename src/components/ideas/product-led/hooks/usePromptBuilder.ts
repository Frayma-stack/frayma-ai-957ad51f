
import { ICPStoryScript } from '@/types/storytelling';
import { ProductContextInputs, TriggerInput } from './types';

export const usePromptBuilder = () => {
  const buildInitialPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined
  ): string => {
    const narrativeTypeContents = productInputs.selectedNarrativeTypes.map(typeId => {
      const narrativeTypes = selectedICP ? (() => {
        switch (productInputs.narrativeAnchor) {
          case 'belief': return selectedICP.coreBeliefs;
          case 'pain': return selectedICP.internalPains;
          case 'struggle': return selectedICP.externalStruggles;
          case 'transformation': return selectedICP.desiredTransformations;
          default: return [];
        }
      })() : [];
      return narrativeTypes.find(n => n.id === typeId)?.content || '';
    }).filter(content => content);
    
    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach that crafts first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's, but through compelling, point-of-view-driven narratives that match how buyers think and decide.

You are a world-class narrative strategist helping B2B SaaS teams craft compelling, resonant GTM narratives. Using the Product-Led Storytelling approach above, generate 15 rare, non-obvious content ideas (for articles, newsletters, sales emails, and LinkedIn posts) that subtly weave in product value without sounding salesy.

Trigger/thesis/anti-thesis: ${triggerInput.content}
Target audience: ${selectedICP?.name || 'Not specified'}
Narrative angle to address: ${productInputs.narrativeAnchor} — "${narrativeTypeContents.join('; ')}"`;

    if (productInputs.productContextType === 'features' && productInputs.selectedFeatures.length > 0) {
      prompt += `\nProduct features and/or benefits:\n`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `• ${feature.name}: ${feature.benefits.join(', ')}\n`;
      });
    }

    if (productInputs.productContextType === 'usecases' && productInputs.selectedUseCases.length > 0) {
      prompt += `\nSpecific use cases to subtly highlight:\n`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `• ${useCase.useCase} (${useCase.userRole}): ${useCase.description}\n`;
      });
    }

    if (productInputs.customPOV.trim()) {
      prompt += `\nThe user's personal POV or perspective to shape the tone of ideas:\nPOV: ${productInputs.customPOV}`;
    }

    prompt += `\n\nFor each idea, return the following structure:
Title – punchy and specific (not generic, not clickbait).
Narrative – what's the tension or belief this idea challenges or advances? This should be at least two sentences that provide clear direction on the narrative angle and storytelling approach the user should take.
Product Tie-in – how can this idea naturally surface the selected product's unique value?
CTA – one specific, low-friction action the reader would be compelled to take.

Make each idea smart, thoughtful strategic, and tailored to ${selectedICP?.name || 'the target ICP'}—as if you're helping them see themselves in the story.
Avoid generic fluff. Think like a narrative strategist trying to flag down and guide a category-defining founder or Head of Marketing toward achieving their goals.`;

    return prompt;
  };

  const buildRegenerationPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined,
    regenerationDirection: string
  ): string => {
    const narrativeTypeContents = productInputs.selectedNarrativeTypes.map(typeId => {
      const narrativeTypes = selectedICP ? (() => {
        switch (productInputs.narrativeAnchor) {
          case 'belief': return selectedICP.coreBeliefs;
          case 'pain': return selectedICP.internalPains;
          case 'struggle': return selectedICP.externalStruggles;
          case 'transformation': return selectedICP.desiredTransformations;
          default: return [];
        }
      })() : [];
      return narrativeTypes.find(n => n.id === typeId)?.content || '';
    }).filter(content => content);

    let prompt = `You are Frayma AI, a strategic GTM content engine trained on the Product-Led Storytelling (PLS) approach.

The user previously generated GTM narrative ideas but has requested a **complete regeneration** using **a new POV, narrative direction, or lens** they've just provided.

Your task is to:
• Discard the prior angle or direction  
• Use the new guidance to reframe the content ideas  
• Ensure each idea subtly shows product value in a first-person, narrative-driven way

---

📚 About Product-Led Storytelling (PLS):
PLS is a GTM storytelling approach that crafts content grounded in how real buyers think and decide. It starts with narrative resonance (anchored in the ICP's beliefs, internal pains, external struggles, and desired transformations), delivers relevance (by weaving in lived product value, not sales pitches), and ends in real results (a CTA that aligns with the reader's journey).

PLS avoids generic tactics. It frames each piece through a specific author's voice and POV—so it resonates more deeply and feels more trustworthy.

---

🔁 NEW Narrative Direction from the user:
**${regenerationDirection}**

---

🎯 Target ICP:
${selectedICP?.name || 'Not specified'}
${selectedICP?.demographics ? `ICP description: ${selectedICP.demographics}` : ''}

🧠 Narrative Anchor to address:
${productInputs.narrativeAnchor} → "${narrativeTypeContents.join('; ')}"

💡 Product elements to tie in:`;

    if (productInputs.productContextType === 'features' && productInputs.selectedFeatures.length > 0) {
      prompt += `\n- Product Features & Benefits: `;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `${feature.name}: ${feature.benefits.join(', ')}; `;
      });
    }

    if (productInputs.productContextType === 'usecases' && productInputs.selectedUseCases.length > 0) {
      prompt += `\n- Use Cases: `;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `${useCase.useCase} (${useCase.userRole}): ${useCase.description}; `;
      });
    }

    if (productInputs.customPOV.trim()) {
      prompt += `\n\n🧑‍💼 Author POV or unique belief to shape voice:\n"${productInputs.customPOV}"`;
    }

    prompt += `\n\n---

🎨 For Each of the 15 Ideas, Return:
• **Title** – punchy and specific, never generic
• **Narrative** – the belief tension or story hook that frames the idea. This should be at least two sentences that provide clear direction on the narrative angle and storytelling approach the user should take.
• **Product Tie-In** – how this idea can naturally surface product value
• **CTA** – a clear, low-friction action that matches the stage of awareness

---

🔍 Style Guidelines:
• Be sharp, original, and ICP-specific
• Think like a founder or GTM strategist trying to stand out in a noisy, lookalike market
• Each idea should feel like the seed of a category-defining point of view—not a recycled marketing angle

Return the ideas as a list titled:  
**"Regenerated GTM Narrative Ideas Based on New Direction"**`;

    return prompt;
  };

  return {
    buildInitialPrompt,
    buildRegenerationPrompt
  };
};
