import { CompanyLink } from "@/types/storytelling";

export const buildClientAnalysisPrompt = (
  companyLinks: CompanyLink[],
  companyName: string
) => {
  const urls = companyLinks.map((link) => link.url).filter((url) => url.trim());

  const systemPrompt = `
  You are an expert data extraction agent specialized in analyzing company web content and public profiles. Your task is to visit the provided URLs—including the company website, LinkedIn company page, funding announcements, and other relevant sources—and extract detailed, structured information about the company's Category Point of View, Mission/Vision, Features (with benefits), Use Cases (with ICP/team context), and Differentiators (with competitor comparison). Return ONLY a JSON string with the following fields and structure, without any additional commentary or explanation:
  
  Format:
  {
  "categoryPOV": "string (succinct summary of the company's category point of view, 3-5 sentences, third-person)",
  "missionVision": {
    "mission": "string (company's mission statement, as found or summarized, third-person)",
    "vision": "string (company's vision statement, as found or summarized, third-person)"
  },
  "features": [
    {
      "featureName": "string (name of the feature)",
      "featureSummary": "string (1-2 sentence summary of the feature, third-person)",
      "benefits": [
        "string (benefit of the feature, 1-2 sentences, third-person)",
        ...
        "(at least 5-7 benefits per feature)"
      ]
    }
  ],
  "useCases": [
    {
      "useCaseTitle": "string (succinct use case title)",
      "useCaseSummary": "string (2-sentence summary describing the use case and the ICP/team it is for, third-person)"
    }
  ],
  "differentiators": [
    {
      "differentiatorTitle": "string (succinct title of the differentiator)",
      "differentiatorSummary": "string (summary of how this differentiator compares/is different from a specific competitor or group of competitors, 2-3 sentences, third-person)"
    }
  ]
}

- Extract and include at least 5-7 benefits for each feature in the features array.
- Ensure each useCaseSummary describes the use case and the ICP/team it is for in two sentences.
- For each differentiator, provide a comparison to a specific competitor or group of competitors.
- Use third-person language throughout.
- Do NOT include any text outside the JSON string.
- Do NOT explain your process or add commentary.
- Extract data only from the URLs provided by the user.
  `;

  const userPrompt = `Company Name: ${companyName}

User-Provided URLs: ${urls.map((url, index) => `- ${url}`).join("\n")}

Please extract the detailed company information from the website content that will be provided and return the structured JSON as specified. Remember to analyze ONLY the actual content provided, not any external or additional information.`;

  return { systemPrompt, userPrompt };
};

export const parseClientAnalysisContent = (content: string) => {
  console.log(
    "Parsing client analysis content from pre-fetched data:",
    content
  );

  // Enhanced error detection patterns for content-based analysis
  const contentIssuePatterns = [
    "not available in provided content",
    "no content was provided",
    "content is empty",
    "unable to find",
    "information not found",
    "not mentioned in the content",
    "no specific information",
    "content does not contain",
  ];

  const lowerContent = content.toLowerCase();

  // Try to extract JSON from the response using multiple strategies
  let jsonString = "";

  // Strategy 1: Look for JSON in code blocks
  const codeBlockMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/i);
  if (codeBlockMatch) {
    jsonString = codeBlockMatch[1];
  } else {
    // Strategy 2: Look for standalone JSON object
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonString = jsonMatch[0];
    }
  }

  console.log(jsonString, "We have JSON");

  if (!jsonString) {
    console.error("No JSON found in response:", content);

    // Check if response indicates content issues
    const hasContentIssue = contentIssuePatterns.some((pattern) =>
      lowerContent.includes(pattern)
    );
    if (hasContentIssue) {
      throw new Error(
        "The analysis indicates that the website content could not be properly extracted or contains insufficient information for analysis. Please verify the URLs contain the expected company information and are publicly accessible."
      );
    }

    // Check if response contains structured information but not in JSON format
    if (
      content.includes("company") ||
      content.includes("mission") ||
      content.includes("feature")
    ) {
      throw new Error(
        "The analysis service returned information but not in the expected JSON format. This may indicate an issue with content processing. Please try again."
      );
    }

    throw new Error(
      "The analysis service did not return the expected JSON format. The website content may not have been properly processed or may be insufficient for analysis."
    );
  }

  // Clean and parse JSON with enhanced error handling
  try {
    // Enhanced JSON cleaning
    let cleanedJson = jsonString
      .replace(/,(\s*[}\]])/g, "$1") // Remove trailing commas
      .replace(/([{,]\s*)(\w+):/g, '$1"$2":') // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Replace single quotes with double quotes
      .replace(/\\n/g, " ") // Replace newlines with spaces
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    const parsed = JSON.parse(cleanedJson);

    console.log(parsed, "Parsed JSON");

    // Enhanced validation for content-based analysis
    const hasValidData =
      parsed?.company_description ||
      parsed.categoryPOV ||
      parsed?.missionVision?.mission ||
      parsed?.missionVision?.vision ||
      (parsed?.features && parsed?.features?.length > 0) ||
      (parsed?.useCases && parsed?.useCases.length > 0) ||
      (parsed.differentiators && parsed.differentiators.length > 0);

    if (!hasValidData) {
      console.warn("Parsed data appears to be empty or minimal:", parsed);
      throw new Error(
        "The analysis returned minimal information from the website content. The websites may not contain sufficient accessible content for meaningful analysis, or the content structure may not be suitable for automated extraction."
      );
    }

    // Transform the data to match our internal structure
    const transformedData = {
      companySummary: parsed.company_description || "",
      categoryPOV: parsed.categoryPOV || "",
      companyMission: parsed.missionVision?.mission || "",
      uniqueInsight: parsed.missionVision?.vision || "",
      features: (parsed?.features ?? []).map((item: any) => ({
        name: item.featureName || "",
        summary: item?.featureSummary || "",
        benefits: Array.isArray(item.benefits) ? item.benefits : [],
      })),
      useCases: (parsed.useCases || []).map((item: any) => ({
        useCase: item.useCaseTitle || "",
        userRole: item?.role_title_team || "",
        description: item.useCaseSummary || "",
      })),
      differentiators: (parsed.differentiators || []).map((item: any) => ({
        name: item?.differentiatorTitle || "",
        description: item?.differentiatorSummary || "",
        competitorComparison: "",
      })),
      sources: parsed?.sources || [],
    };

    return transformedData;
  } catch (parseError) {
    console.error("JSON parsing failed:", parseError);
    console.error("Attempted to parse:", jsonString);

    // Provide more specific error messages based on the error type
    if (parseError instanceof SyntaxError) {
      throw new Error(
        "The analysis service returned malformed data from the website content. This may be due to complex content structure or processing issues. Please verify the website content is standard HTML and try again."
      );
    }

    throw new Error(
      "Failed to parse the analysis response from the website content. The content processing may have encountered issues with the website structure or format. Please verify the URLs contain standard, accessible content and try again."
    );
  }
};
