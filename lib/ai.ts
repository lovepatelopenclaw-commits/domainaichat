import OpenAI from 'openai';

const openRouterClient = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY!,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': 'https://vyarah.com',
    'X-Title': 'Vyarah AI HelpDesk',
  },
});

const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_NIM_API_KEY!,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

const OPENROUTER_MODEL = 'nvidia/llama-3.3-nemotron-super-49b-v1.5';
const NVIDIA_MODEL = 'nvidia/llama-3.1-nemotron-70b-instruct';
const CHAT_TEMPERATURE = 0.2;
const FOLLOW_UP_TEMPERATURE = 0.4;

export type AIMessage = {
  role: 'user' | 'assistant' | 'system';
  content: string;
};

interface StreamChatOptions {
  messages: AIMessage[];
  systemPrompt: string;
  documentContext?: string;
}

function buildMessages({
  messages,
  systemPrompt,
  documentContext,
}: StreamChatOptions): AIMessage[] {
  const fullMessages: AIMessage[] = [
    { role: 'system', content: systemPrompt },
  ];

  if (documentContext) {
    fullMessages.push({
      role: 'system',
      content: `The user uploaded a document. Use this extracted content while answering:\n\n${documentContext}`,
    });
  }

  fullMessages.push(...messages);

  return fullMessages;
}

async function createStream(messages: AIMessage[]) {
  try {
    const stream = await openRouterClient.chat.completions.create({
      model: OPENROUTER_MODEL,
      stream: true,
      messages,
      max_tokens: 1500,
      reasoning_effort: 'none',
      temperature: CHAT_TEMPERATURE,
    });

    return { provider: 'openrouter' as const, stream };
  } catch {
    try {
      const stream = await nvidiaClient.chat.completions.create({
        model: NVIDIA_MODEL,
        stream: true,
        messages,
        max_tokens: 1500,
        temperature: CHAT_TEMPERATURE,
      });

      return { provider: 'nvidia' as const, stream };
    } catch {
      throw new Error('AI_UNAVAILABLE');
    }
  }
}

async function createCompletion(messages: AIMessage[]) {
  try {
    return await openRouterClient.chat.completions.create({
      model: OPENROUTER_MODEL,
      messages,
      max_tokens: 256,
      reasoning_effort: 'none',
      temperature: FOLLOW_UP_TEMPERATURE,
    });
  } catch {
    return nvidiaClient.chat.completions.create({
      model: NVIDIA_MODEL,
      messages,
      max_tokens: 256,
      temperature: FOLLOW_UP_TEMPERATURE,
    });
  }
}

export async function streamChat(options: StreamChatOptions) {
  return createStream(buildMessages(options));
}

export async function generateFollowUpQuestions(
  domain: string,
  lastAnswer: string
): Promise<string[]> {
  try {
    const response = await createCompletion([
      {
        role: 'system',
        content: `Based on the ${domain} domain and the last answer, generate exactly 3 short follow-up questions as a JSON array of strings. Return JSON only.`,
      },
      {
        role: 'user',
        content: `Last answer: ${lastAnswer.substring(0, 500)}`,
      },
    ]);

    const content = response.choices[0]?.message?.content || '[]';
    return JSON.parse(content);
  } catch {
    return [];
  }
}
