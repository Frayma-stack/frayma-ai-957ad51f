
import { ParsedAnalysisData } from '@/types/profileAnalyzer';

export const parseAnalysisContent = (content: string): ParsedAnalysisData => {
  console.log('Raw analysis response content:', content);
  
  // Try to find JSON in the response with multiple patterns
  let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                  content.match(/```([\s\S]*?)```/) || 
                  content.match(/{[\s\S]*}/);
  
  if (jsonMatch) {
    const jsonString = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonString);
    try {
      const parsed = JSON.parse(jsonString);
      
      // Validate the parsed data has the expected structure
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Parsed data is not a valid object');
      }
      
      // Ensure arrays exist even if empty
      if (!Array.isArray(parsed.experiences)) {
        parsed.experiences = [];
      }
      if (!Array.isArray(parsed.writingTones)) {
        parsed.writingTones = [];
      }
      if (!Array.isArray(parsed.productBeliefs)) {
        parsed.productBeliefs = [];
      }
      
      return parsed;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse JSON string:', jsonString);
      throw new Error('Invalid JSON format in the analysis response');
    }
  } 
  
  // If no JSON found, try to parse the entire content as JSON
  try {
    const parsed = JSON.parse(content);
    
    // Ensure arrays exist even if empty
    if (!Array.isArray(parsed.experiences)) {
      parsed.experiences = [];
    }
    if (!Array.isArray(parsed.writingTones)) {
      parsed.writingTones = [];
    }
    if (!Array.isArray(parsed.productBeliefs)) {
      parsed.productBeliefs = [];
    }
    
    return parsed;
  } catch (parseError) {
    console.error('Could not parse content as JSON:', content);
    console.error('Parse error:', parseError);
    
    // If AI refuses to generate content, return a helpful error
    if (content.includes("I can't access") || content.includes("I'm sorry") || content.includes("I cannot")) {
      throw new Error('Analysis service cannot access external websites. Please try a different approach or provide the information manually.');
    }
    
    // Check if the response contains any meaningful data we can extract
    if (content.includes('currentTitle') || content.includes('experiences') || content.includes('writingTones')) {
      // Attempt to fix common JSON formatting issues
      let fixedContent = content
        .replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3') // Add quotes to unquoted keys
        .replace(/:\s*([^",{\[\]}\s][^",{\[\]}\n]*[^",{\[\]}\s])\s*([,}])/g, ': "$1"$2') // Quote unquoted string values
        .trim();
      
      try {
        return JSON.parse(fixedContent);
      } catch (fixError) {
        console.error('Failed to fix and parse JSON:', fixError);
      }
    }
    
    throw new Error('Could not find valid JSON in the analysis response. The analysis service may have returned an unexpected format. Please try again.');
  }
};
