
import { useChatGPT } from '@/contexts/ChatGPTContext';
import { ICPStoryScript, Author, CustomerSuccessStory } from '@/types/storytelling';
import { ContentGoal } from '../types';

interface EmailGeneratorProps {
  selectedICP: string;
  selectedAuthor: string;
  selectedAuthorTone: string;
  selectedAuthorExperience: string;
  selectedSuccessStory: string;
  narrativeSelections: any[];
  contentGoal: ContentGoal;
  emailCount: number;
  additionalContext: string;
  triggerInput: string;
  scripts: ICPStoryScript[];
  authors: Author[];
  successStories: CustomerSuccessStory[];
  setIsGenerating: (value: boolean) => void;
  setGeneratedContent: (content: string) => void;
}

export const useEmailContentGenerator = () => {
  const { generateContent } = useChatGPT();

  const buildEmailPrompt = (props: EmailGeneratorProps): string => {
    const script = props.scripts.find(s => s.id === props.selectedICP);
    const author = props.authors.find(a => a.id === props.selectedAuthor);
    const successStory = props.successStories.find(s => s.id === props.selectedSuccessStory);

    // Get narrative anchors from selections
    const beliefNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'belief')
      .map(sel => script?.coreBeliefs.find(b => b.id === sel.itemId)?.content)
      .filter(Boolean);

    const painNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'pain')
      .map(sel => script?.internalPains.find(p => p.id === sel.itemId)?.content)
      .filter(Boolean);

    const struggleNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'struggle')
      .map(sel => script?.externalStruggles.find(s => s.id === sel.itemId)?.content)
      .filter(Boolean);

    const transformationNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'transformation')
      .map(sel => script?.desiredTransformations.find(t => t.id === sel.itemId)?.content)
      .filter(Boolean);

    let prompt = `About Product-Led Storytelling (PLS):
PLS is a B2B content approach that crafts first-person, narrative-led GTM assets that resonate with ICPs by anchoring content on their beliefs, pains, and goals. It uses structured storytelling frameworks (like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula: Resonance, Relevance, Results) to subtly show, not tell, a product's unique value. The goal is to move readers to feel, think, and act—not through generic how-to's or salesy pitches, but through compelling, point-of-view-driven narratives that match how buyers think and decide.

Using the Product-Led Storytelling approach above, craft a ${props.emailCount}-part cold outbound sales email sequence targeting ${script?.name || 'the target ICP'}`;

    if (script?.demographics) {
      prompt += `, who fits this description:\nDemographics: ${script.demographics}`;
    }

    prompt += `\n\nThe emails should resonate with this ICP by addressing the following narrative anchors:`;

    if (beliefNarratives.length > 0) {
      prompt += `\nBelief: "${beliefNarratives.join('; ')}"`;
    }

    if (painNarratives.length > 0) {
      prompt += `\nInternal Pain: "${painNarratives.join('; ')}"`;
    }

    if (struggleNarratives.length > 0) {
      prompt += `\nExternal Struggle: "${struggleNarratives.join('; ')}"`;
    }

    if (transformationNarratives.length > 0) {
      prompt += `\nDesired Transformation: "${transformationNarratives.join('; ')}"`;
    }

    if (author) {
      prompt += `\n\nUse the voice and tone of ${author.name}`;
      if (author.title) prompt += `, a ${author.title}`;
      
      const selectedTone = author.tones?.find(t => t.id === props.selectedAuthorTone);
      if (selectedTone) {
        prompt += `, who typically writes in a ${selectedTone.tone} style.`;
      }

      const selectedExperience = author.experiences?.find(e => e.id === props.selectedAuthorExperience);
      if (selectedExperience) {
        prompt += `\nIncorporate the author's lived experience: ${selectedExperience.title} - ${selectedExperience.description}`;
      }
    }

    if (successStory) {
      prompt += `\n\nUse real proof point to build trust by extracting relevant info from here:\n${successStory.title}: ${successStory.beforeSummary} to ${successStory.afterSummary}`;
      if (successStory.quotes.length > 0) {
        prompt += `\nQuote: "${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}`;
      }
    }

    prompt += `\n\nThe goal of this sequence is to:\n${props.contentGoal.description}`;

    if (props.additionalContext && !props.additionalContext.startsWith('Based on saved idea:')) {
      prompt += `\n\nOptional extra context to consider:\n${props.additionalContext}`;
    }

    if (props.triggerInput) {
      prompt += `\n\nTrigger/thesis context:\n${props.triggerInput}`;
    }

    prompt += `\n\nTone + Style Guidelines:
Keep each email below 125 words. Don't use generic openers like, as a [ICP_NAME], just go straight into the reason for the outreach with a narrative that hooks the ${script?.name || 'target ICP'}.
Use a mix of first-person and second-person voice where it makes sense, AND always make it sound like a real human (not a marketer or salesperson).
Each email should feel helpful, not salesy. Think: "thoughtful peer nudging a colleague."
Start with resonance: Show you get the reader's situation before pitching anything.
One message per email: Avoid cramming too much in. Focus on one narrative angle per email.
Vary structure: Make use of short sentences, smart formatting, and conversational flow.

Output Format:
Return a sequence of ${props.emailCount} cold emails, clearly labeled:
Email 1 – Subject line:
Body...
Email 2 – Subject line:
Body...
...and so on.`;

    return prompt;
  };

  const buildEmailRecraftingPrompt = (
    props: EmailGeneratorProps,
    newDirection: string,
    existingContent: string
  ): string => {
    const script = props.scripts.find(s => s.id === props.selectedICP);
    const author = props.authors.find(a => a.id === props.selectedAuthor);
    const successStory = props.successStories.find(s => s.id === props.selectedSuccessStory);

    // Get narrative anchors from selections
    const beliefNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'belief')
      .map(sel => script?.coreBeliefs.find(b => b.id === sel.itemId)?.content)
      .filter(Boolean);

    const painNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'pain')
      .map(sel => script?.internalPains.find(p => p.id === sel.itemId)?.content)
      .filter(Boolean);

    const struggleNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'struggle')
      .map(sel => script?.externalStruggles.find(s => s.id === sel.itemId)?.content)
      .filter(Boolean);

    const transformationNarratives = props.narrativeSelections
      .filter(sel => sel.type === 'transformation')
      .map(sel => script?.desiredTransformations.find(t => t.id === sel.itemId)?.content)
      .filter(Boolean);

    let prompt = `You are Frayma AI, a GTM content engine trained on the Product-Led Storytelling (PLS) approach and the 3Rs Formula: Resonance, Relevance, and Results.

The user previously generated a cold outbound sales email sequence but now requests a complete rewrite using a new direction or narrative point of view. Your task is to:

→ Discard the original narrative framing.  
→ Recraft the sequence from scratch using the NEW narrative/POV input provided.  
→ Maintain all other context: ICP, Author voice, Narrative Anchors, Success Story (if provided), CTA, and Tone.  
→ Keep the final output clear, relevant, and personal—not templated or robotic.

---

📚 About Product-Led Storytelling (PLS):
PLS is a GTM narrative method that anchors content in the emotional and strategic realities of a target ICP—guiding them to action through a sharp point of view, not polished persuasion. It uses frameworks like ICP StoryScripts, StoryBriefs & Outlines, and the 3Rs Formula to help B2B companies craft GTM content that feels deeply personal.

• **Resonance** = Address beliefs, internal pains, external struggles, and desired transformations.
• **Relevance** = Educate and guide with lived insight—not tactics.
• **Results** = End with a believable, motivating invitation to act—without forcing it.

---

🔁 New Narrative / POV Direction (from user):
Use this as the narrative spine for recrafting the sequence:
**${newDirection}**

---

🎯 Target ICP:
${script?.name || 'Not specified'}`;

    if (script?.demographics) {
      prompt += `\n(Demographic summary: ${script.demographics})`;
    }

    prompt += `\n\n📍 Narrative Anchors to address:`;

    if (beliefNarratives.length > 0) {
      prompt += `\n- Belief → ${beliefNarratives.join('; ')}`;
    }

    if (painNarratives.length > 0) {
      prompt += `\n- Internal Pain → ${painNarratives.join('; ')}`;
    }

    if (struggleNarratives.length > 0) {
      prompt += `\n- External Struggle → ${struggleNarratives.join('; ')}`;
    }

    if (transformationNarratives.length > 0) {
      prompt += `\n- Desired Transformation → ${transformationNarratives.join('; ')}`;
    }

    if (author) {
      prompt += `\n\n🧑‍💼 Author Profile:
- Name: ${author.name}`;
      if (author.title) prompt += `\n- Role: ${author.title}`;
      
      const selectedExperience = author.experiences?.find(e => e.id === props.selectedAuthorExperience);
      if (selectedExperience) {
        prompt += `\n- Experience: ${selectedExperience.title} - ${selectedExperience.description}`;
      }
      
      const selectedTone = author.tones?.find(t => t.id === props.selectedAuthorTone);
      if (selectedTone) {
        prompt += `\n- Writing Tone: ${selectedTone.tone} - ${selectedTone.description}`;
      }
    }

    if (successStory) {
      prompt += `\n\n📎 Success Story for Proof:
**${successStory.title}**
Before: ${successStory.beforeSummary}
After: ${successStory.afterSummary}`;
      if (successStory.quotes.length > 0) {
        prompt += `\nQuote: "${successStory.quotes[0].quote}" - ${successStory.quotes[0].author}`;
      }
    }

    prompt += `\n\n🎯 Content Goal / CTA:
${props.contentGoal.description}

📝 Email Sequence Length:
${props.emailCount} emails

---

✅ Tone + Style Guidelines:
Keep each email below 125 words. Don't use generic openers like, as a [ICP_NAME], just go straight into the reason for the outreach with a narrative that hooks the ${script?.name || 'target ICP'}.
Use a mix of first-person and second-person voice where it makes sense, AND always make it sound like a real human (not a marketer or salesperson).
Emails should feel like messages from a thoughtful peer who "gets it."
Start with empathy and insight—only then weave in product relevance.
One strong message per email. Don't cram too much.
Vary structure and format across emails for rhythm and readability.
Where relevant, weave in subtle references to the author's product, proof points, or unique insight—but **never pitch first**.

---

📤 Output Format:
Return a cold outbound sequence of ${props.emailCount} emails.

Label each like this:
**Email 1 – Subject line:**  
Body...  
**Email 2 – Subject line:**  
Body...  
...and so on.`;

    return prompt;
  };

  const generateEmailContent = async (props: EmailGeneratorProps): Promise<string> => {
    const prompt = buildEmailPrompt(props);
    return await generateContent(prompt);
  };

  const generateEmailRecrafting = async (
    props: EmailGeneratorProps,
    newDirection: string,
    existingContent: string
  ): Promise<string> => {
    const prompt = buildEmailRecraftingPrompt(props, newDirection, existingContent);
    return await generateContent(prompt);
  };

  return {
    generateEmailContent,
    generateEmailRecrafting,
    buildEmailPrompt,
    buildEmailRecraftingPrompt
  };
};
