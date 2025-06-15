
// API endpoint for chat functionality
export async function POST(request: Request) {
  try {
    const { prompt, maxTokens = 1500, temperature = 0.7 } = await request.json();
    
    // Check if we have an API key configured
    const apiKey = import.meta.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
    
    if (!apiKey) {
      console.error('🔑 No OpenAI API key found');
      return new Response(JSON.stringify({ 
        error: 'API key not configured',
        content: 'Please configure your OpenAI API key to use AI content generation features.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('🤖 Making OpenAI API request with prompt length:', prompt?.length || 0);

    // Make request to OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: maxTokens,
        temperature: temperature
      }),
    });

    console.log('🤖 OpenAI API response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('🤖 OpenAI API error:', response.status, errorText);
      return new Response(JSON.stringify({ 
        error: 'API request failed',
        content: 'Failed to generate content. Please try again later.',
        details: errorText
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || 'No content generated';

    console.log('🤖 OpenAI API success, content length:', content.length);

    return new Response(JSON.stringify({ content }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('🤖 Chat API error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      content: 'An unexpected error occurred. Please try again.',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
