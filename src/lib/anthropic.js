import { supabase } from '../integrations/supabase';

export async function callOpenAILLM(messages, model = 'gpt-4') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const systemVersion = 'http://localhost:8000';

    const requestBody = {
      model: model,
      messages: messages,
      max_tokens: 1000
    };

    // Log the LLM request
    console.log('LLM Request:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(`${systemVersion}/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Log the LLM response
    console.log('LLM Response:', JSON.stringify(data, null, 2));

    // Extract the content from the response
    const content = data.choices[0].message.content;

    // Parse the XML content to extract the chat request
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(content, "text/xml");
    const chatRequest = xmlDoc.getElementsByTagName('lov-chat-request')[0]?.textContent.trim();

    if (!chatRequest) {
      throw new Error('No valid chat request found in LLM response');
    }

    return chatRequest;
  } catch (error) {
    console.error('Error calling OpenAI LLM:', error);
    throw error;
  }
}
