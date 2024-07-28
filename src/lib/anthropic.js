import { supabase } from '../integrations/supabase';

export async function callOpenAILLM(prompt, model = 'gpt-4') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    const systemVersion = import.meta.env.VITE_SYSTEM_VERSION || 'http://localhost:8000';

    const requestBody = {
      model: model,
      messages: [
        { role: 'system', content: 'You are an AI assistant impersonating a user interacting with a GPT Engineer system. When you want to send a request to the system, use the <lov-chat-request> XML tag.' },
        { role: 'user', content: prompt }
      ],
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

    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI LLM:', error);
    throw error;
  }
}