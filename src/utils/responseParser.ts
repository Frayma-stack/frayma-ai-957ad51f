
import { ParsedAnalysisData } from '@/types/profileAnalyzer';

export const parseAnalysisContent = (content: string): ParsedAnalysisData => {
  console.log('Raw analysis response content:', content);
  
  // Try to find JSON in the response
  let jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || 
                  content.match(/```([\s\S]*?)```/) || 
                  content.match(/{[\s\S]*}/);
  
  if (jsonMatch) {
    const jsonString = jsonMatch[1] || jsonMatch[0];
    console.log('Extracted JSON string:', jsonString);
    try {
      return JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON format in the analysis response');
    }
  } 
  
  // If no JSON found, try to parse the entire content as JSON
  try {
    return JSON.parse(content);
  } catch (parseError) {
    console.error('Could not parse content as JSON:', content);
    console.error('Parse error:', parseError);
    
    // If AI refuses to generate content, return a helpful error
    if (content.includes("I can't access") || content.includes("I'm sorry") || content.includes("I cannot")) {
      throw new Error('Analysis service cannot access external websites. Please try a different approach or provide the information manually.');
    }
    
    throw new Error('Could not find valid JSON in the analysis response. Please try again.');
  }
};
