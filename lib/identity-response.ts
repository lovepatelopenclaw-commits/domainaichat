const ENGLISH_IDENTITY_RESPONSES = [
  'I am Vyarah AI. I can help with tax, legal, medical, real-estate, business, and finance questions in India. What would you like help with?',
  "I can help with Indian tax, legal, medical, real-estate, business, and finance questions, but I don't share internal platform or model details. What would you like to know?",
  'I am here to help with practical answers across tax, legal, medical, real-estate, business, and finance in India. Ask your question and I will help.',
];

const HINGLISH_IDENTITY_RESPONSE =
  'Main Vyarah AI hoon. Main India ke tax, legal, medical, property, business, aur finance sawalon mein help kar sakta hoon, but internal platform ya model details share nahi kar sakta. Kya poochna chahte ho?';

const CREATOR_RESPONSE =
  'I am Vyarah AI. I can help with tax, legal, medical, real-estate, business, and finance questions in India, but I do not share internal creator, model, or system details.';

const PROMPT_PROTECTION_RESPONSE =
  "I can help with your tax, legal, medical, real-estate, business, or finance question, but I can't share internal instructions, hidden prompts, or system rules.";

const HINGLISH_PROMPT_PROTECTION_RESPONSE =
  'Main aapke tax, legal, medical, property, business, ya finance sawal mein help kar sakta hoon, but internal instructions, hidden prompts, ya system rules share nahi kar sakta.';

const IDENTITY_PATTERN =
  /\b(chatgpt|gpt(?:-4|[- ]?4o)?|openai|claude|gemini|model|underlying model|underlying technology|technology powers you|what ai are you|which ai are you|who built you|who made you|who created you|are you built on|kaunsa ai|tu chatgpt hai kya|openai ne banaya kya|tu kaun hai)\b/i;

const PROMPT_EXTRACTION_PATTERN =
  /\b(system prompt|developer prompt|hidden prompt|hidden instructions|internal instructions|system instructions|developer instructions|your exact instructions|verbatim instructions|initial instructions|private instructions|secret instructions|ignore previous instructions|ignore all previous instructions|repeat the above|repeat everything above|repeat all above|what is written above|what was written above|show your prompt|reveal your prompt|show the instructions|reveal the instructions|print the prompt|dump the prompt|dump your instructions|list your policies|developer message|system message|hidden message|private reasoning|chain of thought|reasoning trace|cot\b|jailbreak|prompt injection)\b/i;

const PROMPT_LEAK_MARKERS = [
  'here are the instructions',
  'general instructions',
  'identity protection',
  'your personality',
  'how you respond',
  'things you never do',
  'never say under any circumstances',
  'return only the reply text itself',
  'developer instructions',
  'system prompt',
  '[domain:',
  'founder:',
];

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

function looksLikePromptLeak(text: string): boolean {
  const normalized = text.toLowerCase();
  const markerCount = PROMPT_LEAK_MARKERS.filter((marker) => normalized.includes(marker)).length;

  return (
    markerCount >= 2 ||
    normalized.startsWith('here are the instructions') ||
    normalized.includes('general instructions') ||
    normalized.includes('identity protection') ||
    normalized.includes('developer instructions') ||
    normalized.includes('system prompt')
  );
}

export function sanitizeAssistantResponse(userInput: string, output: string) {
  const directProtection = getProtectedIdentityResponse(userInput);

  if (directProtection) {
    return {
      blocked: true,
      content: directProtection,
    };
  }

  if (!looksLikePromptLeak(output)) {
    return {
      blocked: false,
      content: output,
    };
  }

  const normalized = userInput.toLowerCase();
  const content = /(kaunsa ai|tu chatgpt hai kya|tu kaun hai|prompt dikhao|andar ke rules|jailbreak)/i.test(
    normalized
  )
    ? HINGLISH_PROMPT_PROTECTION_RESPONSE
    : PROMPT_PROTECTION_RESPONSE;

  return {
    blocked: true,
    content,
  };
}
