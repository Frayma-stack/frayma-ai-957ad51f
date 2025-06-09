
import { ProductCampaignPromptTemplate } from '@/types/productCampaignPrompts';

// LinkedIn Post Outline Prompts
export const LINKEDIN_OUTLINE_PROMPTS: Record<string, ProductCampaignPromptTemplate> = {
  linkedin_founder: {
    id: 'pc_linkedin_outline_founder',
    name: 'LinkedIn Post Outline - Founder Voice',
    description: 'Generate strategic LinkedIn post outline in founder voice',
    template: `You are a B2B SaaS narrative strategist creating a LinkedIn post outline for a Founder using the Product-Led Storytelling (PLS) approach.

**FOUNDER CONTEXT:**
Founder: {{founderName}}
Title: {{founderTitle}}
Company: {{companyName}}
Founder Voice: {{founderVoice}} - {{founderTone}}
Personal POV: {{founderPersonalPOV}}
Experience/Credibility: {{founderExperience}}

**STRATEGIC CONTEXT:**
Product Update: {{productUpdate}}
Strategic Insight: {{strategicInsight}}
Market Context: {{marketContext}}
Company Vision Tie-in: {{visionTieIn}}

**ICP INTELLIGENCE:**
Primary ICP Pains: {{primaryICPPains}}
Secondary ICP Pains: {{secondaryICPPains}}
Transformation Goal: {{transformationGoal}}
Belief System: {{icpBeliefSystem}}

**POST PARAMETERS:**
Soft CTA: {{softCTA}}
Visual Assets: {{visualAssets}}
Engagement Goal: {{engagementGoal}}

Generate a LinkedIn post outline using PLS structure:

**HOOK OPTIONS (3 variations):**
1. Personal insight hook connecting founder experience to ICP challenge
2. Market observation hook that positions the founder as thought leader
3. Behind-the-scenes hook showing founder perspective on product decision

**BODY STRUCTURE (PLS Flow):**
- **Resonance Section**: Personal story/insight that connects to ICP beliefs and pains
- **Relevance Section**: Product update introduction with strategic context and "why we built this"
- **Results Section**: Vision of transformation and impact, with soft call to engagement

**CONTENT ELEMENTS:**
- Founder voice authenticity markers
- Industry insight that showcases thought leadership
- Product update integration that feels natural, not promotional
- Visual/screenshot callouts for maximum engagement
- Strategic hashtag suggestions
- Comment spark questions

**TONE GUIDELINES:**
- {{founderVoice}} voice with {{founderTone}} approach
- Personal yet professional, sharing founder perspective
- Thought leadership positioning without overselling
- Authentic vulnerability showing founder journey
- Vision-forward while being grounded in current reality

Ensure outline reflects founder-level strategic thinking and authentic personal voice.`,
    variables: [
      'founderName', 'founderTitle', 'companyName', 'founderVoice', 'founderTone',
      'founderPersonalPOV', 'founderExperience', 'productUpdate', 'strategicInsight',
      'marketContext', 'visionTieIn', 'primaryICPPains', 'secondaryICPPains',
      'transformationGoal', 'icpBeliefSystem', 'softCTA', 'visualAssets', 'engagementGoal'
    ],
    category: 'linkedin_post',
    outputType: 'outline',
    assetType: 'linkedin_founder',
    authorType: 'founder',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};

// Twitter Thread Outline Prompts
export const TWITTER_OUTLINE_PROMPTS: Record<string, ProductCampaignPromptTemplate> = {
  twitter_founder: {
    id: 'pc_twitter_outline_founder',
    name: 'X Thread Outline - Founder Voice',
    description: 'Generate strategic X/Twitter thread outline in founder voice',
    template: `You are a B2B SaaS narrative strategist creating an X (Twitter) thread outline for a Founder using the Product-Led Storytelling (PLS) approach.

**FOUNDER CONTEXT:**
Founder: {{founderName}}
Twitter Handle: {{twitterHandle}}
Founder Voice: {{founderVoice}}
Personal Brand: {{personalBrand}}
Expertise Areas: {{expertiseAreas}}

**STRATEGIC CONTEXT:**
Product Update: {{productUpdate}}
Big Idea/Hook: {{bigIdeaHook}}
Strategic Insight: {{strategicInsight}}
Market Timing: {{marketTiming}}

**ICP INTELLIGENCE:**
Core ICP: {{coreICP}}
Pain Points: {{icpPainPoints}}
Transformation Desire: {{transformationDesire}}
Current Context: {{currentContext}}

**THREAD PARAMETERS:**
Target Length: {{targetLength}} tweets
Primary CTA: {{primaryCTA}}
Visual Elements: {{visualElements}}

Generate a strategic thread outline using PLS narrative structure:

**THREAD STRUCTURE:**

**Tweet 1 - Big Idea Hook:**
3 hook variations:
- Personal insight that immediately grabs attention
- Contrarian market observation
- Behind-the-scenes founder perspective

**Tweets 2-4 - Problem Context (Resonance):**
- Tweet 2: Pain point articulation using ICP language
- Tweet 3: Context of why this matters now / market timing
- Tweet 4: Stakes/consequences of not solving this

**Tweets 5-8 - Solution Reveal (Relevance):**
- Tweet 5: Product update introduction with strategic context
- Tweet 6: Key feature highlight with user benefit
- Tweet 7: Use case example showing transformation
- Tweet 8: Differentiator that makes this solution unique

**Tweets 9-10 - Results & CTA (Results):**
- Tweet 9: Vision of transformation and future state
- Tweet 10: Strategic CTA with clear next step

**THREAD ELEMENTS:**
- Visual embed suggestions (screenshots, GIFs, charts)
- Engagement hooks throughout thread
- Strategic hashtag placement
- Reply thread opportunities
- RT-worthy quotable moments

**VOICE GUIDELINES:**
- {{founderVoice}} authentic voice throughout
- Personal stories and insights woven naturally
- Technical depth balanced with accessibility
- Thought leadership positioning
- Community-building language

Ensure thread builds narrative momentum toward transformation outcome while maintaining authentic founder voice.`,
    variables: [
      'founderName', 'twitterHandle', 'founderVoice', 'personalBrand', 'expertiseAreas',
      'productUpdate', 'bigIdeaHook', 'strategicInsight', 'marketTiming',
      'coreICP', 'icpPainPoints', 'transformationDesire', 'currentContext',
      'targetLength', 'primaryCTA', 'visualElements'
    ],
    category: 'twitter_thread',
    outputType: 'outline',
    assetType: 'twitter_founder',
    authorType: 'founder',
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
};
