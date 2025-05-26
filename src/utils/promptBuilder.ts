
export const buildAnalysisPrompt = (urls: string[]) => {
  const urlsString = urls.join('\n');
  
  return `You are an expert data extraction agent specialized in analyzing social profiles and related web content. Your task is to visit the provided URLs—including LinkedIn, X (Twitter), and specified blog posts—and extract detailed, structured information about the person's current title/role, career backstory, experiences, writing tones, and product beliefs. Return ONLY a JSON string with the following fields and structure, without any additional commentary or explanation:

- currentTitle: string (current job title/role)
- careerBackstory: string (summary in seven sentences or less, first-person)
- experiences: array of objects, each with:
    - title: string (job title/role)
    - company: string
    - duration: string (time spent at company)
    - summary: string (what was done in the role, five sentences or less, first-person)
- writingTones: array of objects, each with:
    - toneTitle: string (succinct title of the writing tone)
    - toneSummary: string (summary of writing tone, four sentences or less, first-person)
- productBeliefs: array of objects, each with:
    - beliefTitle: string (succinct title of the product belief)
    - beliefSummary: string (summary of product belief, five sentences or less, first-person)

Use first-person language as if the person is telling someone about themselves. Do NOT include any text outside the JSON string. Do NOT explain your process.

CONTENT URLs:
${urlsString}

Extract data only from these URLs.`;
};
