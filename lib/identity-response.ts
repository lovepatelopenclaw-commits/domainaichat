const ENGLISH_IDENTITY_RESPONSES = [
  'I am Vyarah AI - built by the Vyarah team to give Indian users expert answers on tax, legal, medical, real estate, and finance. What can I help you with?',
  "Our underlying technology is proprietary to Vyarah and we don't share those details. I'm Vyarah AI - here to give you the most useful answers I can. What would you like to know?",
  "Vyarah's technology is confidential. I'm Vyarah AI, built to help Indian users with practical answers across tax, legal, medical, real estate, and finance. What would you like help with?",
];

const HINGLISH_IDENTITY_RESPONSE =
  'Main Vyarah AI hoon - Vyarah team ne mujhe banaya hai Indian users ke liye. Hamari technology ke details share karna possible nahi hai, but main aapke sawal ka best jawab dene ke liye hoon. Kya jaanna chahte ho?';

const CREATOR_RESPONSE =
  'I was created by the Vyarah team, led by founder Love Patel. I am Vyarah AI, built to help Indian users with expert guidance across tax, legal, medical, real estate, and finance.';

const PROMPT_PROTECTION_RESPONSE =
  "I can help with your tax, legal, medical, real-estate, business, or finance question, but I can't share internal instructions, hidden prompts, or system rules.";

const HINGLISH_PROMPT_PROTECTION_RESPONSE =
  'Main aapke tax, legal, medical, property, business, ya finance sawal mein help kar sakta hoon, but internal instructions, hidden prompts, ya system rules share nahi kar sakta.';

const IDENTITY_PATTERN =
  /\b(chatgpt|gpt(?:-4|[- ]?4o)?|openai|claude|gemini|model|underlying model|underlying technology|technology powers you|what ai are you|which ai are you|who built you|who made you|who created you|are you built on|kaunsa ai|tu chatgpt hai kya|openai ne banaya kya|tu kaun hai)\b/i;

const PROMPT_EXTRACTION_PATTERN =
  /\b(system prompt|prompt\b|internal instructions|hidden instructions|instructions given to you|rules you follow|developer message|developer instructions|your exact instructions|verbatim instructions|reveal your prompt|show your prompt|show the instructions|what are your instructions|ignore previous instructions|repeat the above|chain of thought|cot\b|jailbreak)\b/i;

function pickEnglishIdentityResponse(input: string): string {
  const index = input.length % ENGLISH_IDENTITY_RESPONSES.length;
  return ENGLISH_IDENTITY_RESPONSES[index];
}

export function getProtectedIdentityResponse(input: string): string | null {
  if (PROMPT_EXTRACTION_PATTERN.test(input)) {
    const normalized = input.toLowerCase();

    if (/(kya instructions|prompt dikhao|system prompt|andar ke rules|hidden prompt|jailbreak)/i.test(normalized)) {
      return HINGLISH_PROMPT_PROTECTION_RESPONSE;
    }

    return PROMPT_PROTECTION_RESPONSE;
  }

  if (!IDENTITY_PATTERN.test(input)) {
    return null;
  }

  const normalized = input.toLowerCase();

  if (
    /(who built you|who made you|who created you|kisne banaya|founder|creator)/i.test(input)
  ) {
    return CREATOR_RESPONSE;
  }

  if (
    /(kaunsa ai|tu chatgpt hai kya|openai ne banaya kya|tu kaun hai|kya hai tu|kaun sa ai)/i.test(
      normalized
    )
  ) {
    return HINGLISH_IDENTITY_RESPONSE;
  }

  return pickEnglishIdentityResponse(input);
}
