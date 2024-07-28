import { supabase } from '../integrations/supabase';

export async function callOpenAILLM(prompt, model = 'gpt-4o') {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('User not authenticated');
    }

    console.log('Session data:', session);  // Debug log

    const systemVersion = session.system_version || 'https://lov-p-33afc4d2-8ae8-4a62-b1f1-0561e587db8e.fly.dev';
    console.log('System version:', systemVersion);  // Debug log

    const response = await fetch(`${systemVersion}/openai/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: 'You are an AI assistant impersonating a user interacting with a GPT Engineer system. When you want to send a request to the system, use the <lov-chat-request> XML tag.' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 1000
      })
    });

    console.log('Response status:', response.status);  // Debug log

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI LLM:', error);
    throw error;
  }
}
