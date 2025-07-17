import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the document file from the request
    const formData = await req.formData();
    const documentFile = formData.get('document') as File;
    
    if (!documentFile) {
      throw new Error('No document file provided');
    }

    console.log('📄 Processing document file:', {
      name: documentFile.name,
      size: documentFile.size,
      type: documentFile.type
    });

    let extractedText = '';

    // Handle different file types
    if (documentFile.type === 'text/plain' || documentFile.name.endsWith('.txt')) {
      // Simple text file
      extractedText = await documentFile.text();
    } else if (documentFile.name.endsWith('.docx')) {
      // For DOCX files, we'll need to implement a parser or use an external service
      // For now, we'll return an error suggesting to use plain text
      throw new Error('DOCX files are not yet supported. Please save as .txt or paste the content directly.');
    } else if (documentFile.name.endsWith('.pdf')) {
      // For PDF files, we'll need to implement a parser or use an external service
      // For now, we'll return an error suggesting to use plain text
      throw new Error('PDF files are not yet supported. Please save as .txt or paste the content directly.');
    } else {
      throw new Error('Unsupported file type. Please use .txt files or paste the content directly.');
    }

    if (!extractedText.trim()) {
      throw new Error('No text content found in the document');
    }

    console.log('✅ Document text extraction completed:', {
      textLength: extractedText.length,
      preview: extractedText.substring(0, 100) + '...'
    });

    return new Response(
      JSON.stringify({ 
        text: extractedText,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('❌ Error in extract-document-text function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});