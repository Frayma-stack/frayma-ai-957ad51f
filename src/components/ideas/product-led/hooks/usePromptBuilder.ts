
import { ICPStoryScript, ProductContext } from '@/types/storytelling';
import { ProductContextInputs, TriggerInput } from './types';

export const usePromptBuilder = () => {
  const buildInitialPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined,
    productContext?: ProductContext | null
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
    
    let prompt = `🧠 About Product-Led Storytelling (PLS):
PLS is a B2B content approach that crafts first-person, narrative-led GTM assets that resonate with ICPs through the 3Rs Formula:

**🎯 RESONANCE**: Anchor content on ICP beliefs, pains, struggles, and desired transformations
**📊 RELEVANCE**: Weave in lived product value through stories, not sales pitches  
**🎯 RESULTS**: Drive readers to feel, think, and act through compelling POV-driven narratives

PLS uses structured storytelling frameworks (ICP StoryScripts, StoryBriefs & Outlines) to subtly show, not tell, a product's unique value. The goal is to move readers through compelling, point-of-view-driven narratives that match how buyers think and decide.

---

You are Frayma AI, a world-class Product-Led Storytelling engine. Generate 15 rare, non-obvious content ideas that subtly weave in product value without sounding salesy.

**🎭 Trigger/Thesis/Anti-Thesis**: ${triggerInput.content}

**👥 Target ICP**: ${selectedICP?.name || 'Not specified'}
${selectedICP?.demographics ? `Demographics: ${selectedICP.demographics}` : ''}

**🎪 Narrative Anchor to Address**: ${productInputs.narrativeAnchor.toUpperCase()} 
"${narrativeTypeContents.join('; ')}"

**🏢 Business Context to Weave In Naturally**:`;

    // Add detailed business context based on selection
    if (productInputs.businessContextItem === 'category_pov' && productContext) {
      prompt += `\nCategory POV: "${productContext.categoryPOV}"
Use this strategic positioning to guide the narrative and show how your product/company views the market differently.`;
    }

    if (productInputs.businessContextItem === 'unique_insight' && productContext) {
      prompt += `\nUnique Insight: "${productContext.uniqueInsight}"
Leverage this insight to create content that reveals non-obvious truths or perspectives that resonate with the target ICP.`;
    }

    if (productInputs.businessContextItem === 'mission_vision' && productContext) {
      prompt += `\nMission/Vision: "${productContext.companyMission}"
Infuse this mission-driven perspective to create content that shows the bigger purpose behind the work.`;
    }

    if (productInputs.businessContextItem === 'success_story' && productInputs.selectedSuccessStory) {
      const story = productInputs.selectedSuccessStory;
      prompt += `\nCustomer Success Story: "${story.title}"
Before State: ${story.beforeSummary}
After State: ${story.afterSummary}`;
      if (story.quotes && story.quotes.length > 0) {
        prompt += `\nKey Quotes: ${story.quotes.map((q: any) => `"${q.quote}" - ${q.author}, ${q.role}`).join('; ')}`;
      }
      if (story.features && story.features.length > 0) {
        prompt += `\nFeatures Used: ${story.features.map((f: any) => f.name).join(', ')}`;
      }
      prompt += `\nUse this transformation story to create narrative content that shows similar potential outcomes for prospects.`;
    }

    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length > 0) {
      prompt += `\nProduct Features & Benefits:`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `\n• ${feature.name}: ${feature.benefits.join(', ')}`;
      });
      prompt += `\nWeave these features naturally into stories that show their value without being product-heavy.`;
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length > 0) {
      prompt += `\nSpecific Use Cases:`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `\n• ${useCase.useCase} (${useCase.userRole}): ${useCase.description}`;
      });
      prompt += `\nCreate content that naturally showcases these use cases through real-world scenarios and applications.`;
    }

    if (productInputs.businessContextItem === 'differentiator' && productInputs.selectedDifferentiators.length > 0) {
      prompt += `\nKey Differentiators:`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `\n• ${diff.name}: ${diff.description}`;
      });
      prompt += `\nHighlight these differentiators through narrative content that shows why this approach is uniquely valuable.`;
    }

    if (productInputs.customPOV.trim()) {
      prompt += `\nThe user's personal POV or perspective to shape the tone of ideas:\nPOV: ${productInputs.customPOV}`;
    }

    if (productInputs.povNarrativeDirection.trim()) {
      prompt += `\n\n**🧑‍💼 Author POV/Narrative Direction**: 
"${productInputs.povNarrativeDirection}"
Integrate this perspective to shape the voice and angle of the content ideas.`;
    }

    prompt += `\n\n---

🎨 **For Each of the 15 Ideas, Return This Structure:**

**Title** – Punchy, specific, first-person style (not generic, not clickbait)
**Narrative** – What tension or belief does this challenge/advance? Provide clear direction on the narrative angle and storytelling approach (minimum 2 sentences with specific guidance)
**Product Tie-in** – How this naturally surfaces the selected product's unique value without being sales-heavy
**CTA** – One specific, low-friction action that matches the reader's awareness stage

---

🎯 **Quality Guidelines:**
• Make each idea strategically targeted to ${selectedICP?.name || 'the target ICP'} 
• Think like a narrative strategist helping a category-defining founder stand out
• Avoid generic marketing fluff—focus on rare, non-obvious angles
• Each idea should feel like the seed of a breakthrough point of view
• Show don't tell product value through lived experience and transformation stories
• Anchor every idea in the selected narrative tension: ${productInputs.narrativeAnchor} themes

Return the ideas formatted clearly with each section labeled.`;

    return prompt;
  };

  const buildRegenerationPrompt = (
    triggerInput: TriggerInput,
    productInputs: ProductContextInputs,
    selectedICP: ICPStoryScript | undefined,
    regenerationDirection: string,
    productContext?: ProductContext | null
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

    let prompt = `🔄 You are Frayma AI, a strategic Product-Led Storytelling engine.

The user has requested a **COMPLETE REGENERATION** with fresh context and direction.

**📋 Your Task:**
• Completely discard the prior approach and angle
• Use the new ICP, business context, and narrative direction provided
• Apply the Product-Led Storytelling 3Rs Formula: Resonance → Relevance → Results
• Generate 15 fresh ideas that subtly show product value through first-person narratives

---

**📚 Product-Led Storytelling Framework:**
PLS crafts content grounded in how real buyers think and decide through the 3Rs:
- **RESONANCE**: Anchor in ICP's beliefs, pains, struggles, transformations
- **RELEVANCE**: Weave in lived product value through stories, not pitches
- **RESULTS**: Drive action through compelling POV-driven narratives

PLS avoids generic tactics by framing content through specific author voice and perspective.

---

**🔥 NEW Narrative Direction:**
"${regenerationDirection}"

---

**🎯 Updated Target ICP:**
${selectedICP?.name || 'Not specified'}
${selectedICP?.demographics ? `
ICP Profile: ${selectedICP.demographics}
Core Pain Points: ${selectedICP.internalPains?.slice(0, 3).map(item => item.content).join(' • ') || 'Not specified'}
External Challenges: ${selectedICP.externalStruggles?.slice(0, 3).map(item => item.content).join(' • ') || 'Not specified'}
Core Beliefs: ${selectedICP.coreBeliefs?.slice(0, 3).map(item => item.content).join(' • ') || 'Not specified'}
Desired Outcomes: ${selectedICP.desiredTransformations?.slice(0, 3).map(item => item.content).join(' • ') || 'Not specified'}` : ''}

**🧠 Narrative Anchor Focus:**
${productInputs.narrativeAnchor.toUpperCase()} → "${narrativeTypeContents.join(' • ')}"

**🏢 Business Context to Weave In:**`;

    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length > 0) {
      prompt += `\n- Product Features & Benefits: `;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `${feature.name}: ${feature.benefits.join(', ')}; `;
      });
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length > 0) {
      prompt += `\n- Use Cases: `;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `${useCase.useCase} (${useCase.userRole}): ${useCase.description}; `;
      });
    }

    // Add additional business context sections similar to initial prompt
    if (productInputs.businessContextItem === 'category_pov' && productContext) {
      prompt += `\nCategory POV: "${productContext.categoryPOV}"`;
    }

    if (productInputs.businessContextItem === 'unique_insight' && productContext) {
      prompt += `\nUnique Insight: "${productContext.uniqueInsight}"`;
    }

    if (productInputs.businessContextItem === 'mission_vision' && productContext) {
      prompt += `\nMission/Vision: "${productContext.companyMission}"`;
    }

    if (productInputs.businessContextItem === 'success_story' && productInputs.selectedSuccessStory) {
      const story = productInputs.selectedSuccessStory;
      prompt += `\nCustomer Success Story: "${story.title}"
Before State: ${story.beforeSummary}
After State: ${story.afterSummary}`;
      if (story.quotes && story.quotes.length > 0) {
        prompt += `\nKey Quotes: ${story.quotes.map((q: any) => `"${q.quote}" - ${q.author}, ${q.role}`).join('; ')}`;
      }
    }

    if (productInputs.businessContextItem === 'feature' && productInputs.selectedFeatures.length > 0) {
      prompt += `\nProduct Features & Benefits:`;
      productInputs.selectedFeatures.forEach(feature => {
        prompt += `\n• ${feature.name}: ${feature.benefits.join(', ')}`;
      });
    }

    if (productInputs.businessContextItem === 'use_case' && productInputs.selectedUseCases.length > 0) {
      prompt += `\nSpecific Use Cases:`;
      productInputs.selectedUseCases.forEach(useCase => {
        prompt += `\n• ${useCase.useCase} (${useCase.userRole}): ${useCase.description}`;
      });
    }

    if (productInputs.businessContextItem === 'differentiator' && productInputs.selectedDifferentiators.length > 0) {
      prompt += `\nKey Differentiators:`;
      productInputs.selectedDifferentiators.forEach(diff => {
        prompt += `\n• ${diff.name}: ${diff.description}`;
      });
    }

    if (productInputs.povNarrativeDirection.trim()) {
      prompt += `\n\n**🧑‍💼 Author POV/Narrative Direction**: 
"${productInputs.povNarrativeDirection}"`;
    }

    prompt += `\n\n---

**🎨 For Each of the 15 Ideas, Return:**
• **Title** – Punchy, specific, first-person style (never generic)
• **Narrative** – The belief tension or story hook with clear narrative direction (minimum 2 detailed sentences)
• **Product Tie-In** – How this naturally surfaces product value without being sales-heavy  
• **CTA** – Clear, low-friction action matching awareness stage

---

**🔍 Enhanced Regeneration Guidelines:**
• Be laser-focused on the NEW narrative direction provided
• Think like a category-defining founder trying to break through market noise
• Each idea should feel like a breakthrough POV—not recycled marketing angles
• Anchor everything in the updated ICP context and business elements
• Show product value through transformation stories and lived experiences
• Make each narrative strategically different from generic B2B content

**Return the ideas clearly formatted with section headers.**`;

    return prompt;
  };

  return {
    buildInitialPrompt,
    buildRegenerationPrompt
  };
};
