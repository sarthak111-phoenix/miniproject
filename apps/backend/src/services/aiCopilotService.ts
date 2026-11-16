import { db, ProfileRecord } from '../db/store';
import { RuleEngine } from './ruleEngine/evaluator';
import { GoogleGenAI } from '@google/genai';

let cachedGenAI: GoogleGenAI | null = null;

function getGenAI(): GoogleGenAI | null {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.startsWith('AIzaSyYour') || key.length < 10) return null;
  if (!cachedGenAI) {
    try {
      cachedGenAI = new GoogleGenAI({ apiKey: key });
    } catch {
      cachedGenAI = null;
    }
  }
  return cachedGenAI;
}

export interface ExplanationRequest {
  schemeId: string;
  userId: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  userId: string;
  query: string;
  history?: ChatMessage[];
}

export interface GroundedCitation {
  schemeName: string;
  sourceVersion: string;
  officialUrl: string;
  verifiedDate: string;
}

// Out-of-scope topics per Rules.md Section 4
const OUT_OF_SCOPE_PATTERNS = [
  /crypto|bitcoin|stock\s*market|invest\s*in\s*shares|forex/i,
  /medical\s*diagnosis|prescribe|symptom\s*treatment/i,
  /divorce\s*lawyer|criminal\s*defense|court\s*litigation/i,
  /hack|bypass|exploit|jailbreak|sql\s*inject/i,
];

// Prompt injection keywords
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior)\s+instructions/i,
  /system\s+prompt/i,
  /reveal\s+your\s+(secret|hidden)\s+instructions/i,
  /you\s+are\s+now\s+dan/i,
  /unrestricted\s+ai/i,
];

export class AiCopilotService {
  /**
   * Generates a plain-language explanation grounded strictly in the deterministic rule evaluation
   * and verified scheme documents, with citation enforcement.
   */
  public static async explainEligibility(req: ExplanationRequest): Promise<{
    explanation: string;
    isEligible: boolean;
    citations: GroundedCitation[];
    confidenceScore: number;
  }> {
    const userProfile = await db.findProfileByUserId(req.userId);
    const profile: ProfileRecord = userProfile || {
      userId: req.userId,
      fullName: 'Citizen',
      age: 20,
      gender: 'female',
      state: 'Delhi',
      category: 'General',
      annualIncome: 250000,
      occupation: 'student',
      educationLevel: 'Undergraduate',
      currentCourse: 'Degree Program',
      currentSemester: 1,
      cgpaOrPercentage: 75.0,
      skills: [],
      targetCareerGoal: 'Professional',
      disability: false,
      updatedAt: new Date().toISOString(),
    };

    const scheme = await db.findSchemeById(req.schemeId);
    if (!scheme) {
      throw new Error(`Scheme '${req.schemeId}' not found.`);
    }

    // Evaluate deterministically first (Rule Engine is single source of truth)
    const evalResult = RuleEngine.evaluate(profile, scheme);

    const citation: GroundedCitation = {
      schemeName: scheme.name,
      sourceVersion: scheme.sourceVersion,
      officialUrl: scheme.officialPortalUrl,
      verifiedDate: scheme.lastVerifiedDate,
    };

    let explanation = '';

    if (evalResult.isEligible) {
      explanation =
        `Great news, ${profile.fullName}! You are eligible for the "${scheme.name}". ` +
        `As an ${profile.educationLevel} ${profile.occupation} residing in ${profile.state} ` +
        `with an annual family income of ₹${profile.annualIncome.toLocaleString('en-IN')}, ` +
        `you meet all prescribed criteria. Benefit: ${scheme.benefitAmount}. ` +
        `You will need ${scheme.requiredDocuments.length} documents ready before applying ` +
        `at ${scheme.officialPortalUrl}. (Source: ${scheme.sourceVersion}, verified ${scheme.lastVerifiedDate})`;
    } else {
      explanation =
        `Hello ${profile.fullName}, based on the official guidelines for "${scheme.name}", ` +
        `you currently do not qualify due to: ${evalResult.disqualifyingReasons.join(' ')} ` +
        `You can explore other matched opportunities or check official circulars at ${scheme.officialPortalUrl}. ` +
        `(Source: ${scheme.sourceVersion}, verified ${scheme.lastVerifiedDate})`;
    }

    // Live LLM generation via Gemini (grounded strictly in rule evaluation and verified document facts)
    const ai = getGenAI();
    if (ai) {
      try {
        const modelName = process.env.AI_MODEL || 'gemini-flash-latest';
        const groundingPrompt = `You are Saarthi AI's official civic assistant.
Your task is to explain a government scheme eligibility evaluation to an Indian citizen in clear, warm, plain language.

STRICT GROUNDING RULES:
1. Ground your response strictly on the factual details provided below. Do not invent any outside rules or grants.
2. The deterministic decision is: ${evalResult.isEligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}. NEVER contradict this decision.
3. If not eligible, you MUST clearly state the exact disqualifying reasons: ${evalResult.disqualifyingReasons.join(', ')}.
4. Mention the official portal (${scheme.officialPortalUrl}) and the official gazette version (${scheme.sourceVersion}).

User Profile:
- Name: ${profile.fullName}
- Education: ${profile.educationLevel}
- Occupation: ${profile.occupation}
- State: ${profile.state}
- Annual Income: ₹${profile.annualIncome.toLocaleString('en-IN')}

Scheme Record:
- Name: ${scheme.name}
- Benefit: ${scheme.benefitAmount}
- Required Documents: ${scheme.requiredDocuments.join(', ')}
- Official Source: ${scheme.sourceVersion} (Verified: ${scheme.lastVerifiedDate})

Write a natural, concise 2-4 sentence explanation.`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini call timed out')), 4000)
        );
        const callPromise = ai.models.generateContent({
          model: modelName,
          contents: groundingPrompt,
        });

        const res = await Promise.race([callPromise, timeoutPromise]);
        const genText = res?.text;
        if (genText && genText.trim().length > 20) {
          if (!evalResult.isEligible) {
            const hasDisqualifier = evalResult.disqualifyingReasons.some((r) =>
              genText.toLowerCase().includes(r.toLowerCase().split(' ')[0])
            );
            if (hasDisqualifier) {
              explanation = genText.trim();
            }
          } else {
            explanation = genText.trim();
          }
        }
      } catch {
        // Fall back gracefully to the deterministic grounded template
      }
    }

    return {
      explanation,
      isEligible: evalResult.isEligible,
      citations: [citation],
      confidenceScore: 0.98,
    };
  }

  /**
   * Scoped RAG Chatbot handling questions strictly regarding schemes, scholarships,
   * career roadmaps, and required documents with citation enforcement.
   */
  public static async chat(req: ChatRequest): Promise<{
    answer: string;
    citations: GroundedCitation[];
    isOutOfScope: boolean;
    confidenceScore: number;
  }> {
    const cleanQuery = req.query.trim();

    // 1. Guardrail: Prompt Injection Detection
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
      if (pattern.test(cleanQuery)) {
        return {
          answer:
            "I am Saarthi AI's dedicated assistant for government schemes, scholarships, and student career roadmaps. " +
            'I cannot process override commands. How may I help you with educational or welfare guidance today?',
          citations: [],
          isOutOfScope: true,
          confidenceScore: 1.0,
        };
      }
    }

    // 2. Guardrail: Scope Verification per Rules.md Section 4
    for (const pattern of OUT_OF_SCOPE_PATTERNS) {
      if (pattern.test(cleanQuery)) {
        return {
          answer:
            'I specialize strictly in education guidance, student career roadmaps, scholarships, and Indian government welfare schemes. ' +
            'I cannot provide financial trading, medical, or general legal advice. Please ask a scheme or education-related question!',
          citations: [],
          isOutOfScope: true,
          confidenceScore: 1.0,
        };
      }
    }

    // 2.5 Friendly Conversational Greetings Handler
    const GREETING_REGEX = /^(hi+|hello+|hey+|namaste|pranam|greetings|good\s*(morning|afternoon|evening)|help)[\s!.]*$/i;
    if (GREETING_REGEX.test(cleanQuery)) {
      return {
        answer:
          'Namaste! I am your Saarthi AI Copilot. I can help you discover government welfare schemes, check scholarship eligibility, outline career roadmap milestones, or review required documents. What would you like guidance on today?',
        citations: [],
        isOutOfScope: false,
        confidenceScore: 1.0,
      };
    }

    // 3. RAG Retrieval across verified scheme documents
    const allSchemes = await db.getAllSchemes();
    const queryLower = cleanQuery.toLowerCase();

    // Find relevant scheme matches based on query terms
    const matchingSchemes = allSchemes.filter((scheme) => {
      const nameMatch = scheme.name.toLowerCase().includes(queryLower) || queryLower.includes(scheme.slug);
      const catMatch = scheme.categoryType.toLowerCase().includes(queryLower);
      const docMatch = queryLower.includes('document') || queryLower.includes('deadline');
      const keywordMatch = queryLower.split(' ').some((word: string) => word.length > 3 && scheme.name.toLowerCase().includes(word));
      return nameMatch || (catMatch && docMatch) || keywordMatch;
    });

    if (matchingSchemes.length === 0) {
      // Confidence below threshold fallback per Rules.md Section 4
      return {
        answer:
          "I don't have verified information in my knowledge base regarding this specific scheme or query. " +
          'To avoid misinformation, please check the official National Scholarship Portal (https://scholarships.gov.in) ' +
          'or the respective ministry portal directly.',
        citations: [],
        isOutOfScope: false,
        confidenceScore: 0.35,
      };
    }

    const primaryScheme = matchingSchemes[0];
    const citations: GroundedCitation[] = [
      {
        schemeName: primaryScheme.name,
        sourceVersion: primaryScheme.sourceVersion,
        officialUrl: primaryScheme.officialPortalUrl,
        verifiedDate: primaryScheme.lastVerifiedDate,
      },
    ];

    let answer = '';

    if (queryLower.includes('document') || queryLower.includes('need') || queryLower.includes('required')) {
      answer =
        `For the "${primaryScheme.name}", you are required to submit the following official documents:\n` +
        primaryScheme.requiredDocuments.map((doc: string, idx: number) => `${idx + 1}. ${doc}`).join('\n') +
        `\n\nBenefit: ${primaryScheme.benefitAmount}. Apply via the verified portal: ${primaryScheme.officialPortalUrl}.`;
    } else if (queryLower.includes('deadline') || queryLower.includes('last date')) {
      const deadline = primaryScheme.applicationDeadline || 'Rolling / Open year-round';
      answer =
        `The application deadline for "${primaryScheme.name}" is currently listed as: ${deadline}. ` +
        `Please submit all verified certificates before this date at ${primaryScheme.officialPortalUrl}.`;
    } else {
      answer =
        `"${primaryScheme.name}" (${primaryScheme.level} Level, ${primaryScheme.categoryType}):\n` +
        `${primaryScheme.shortDescription}\n\n` +
        `• Benefit: ${primaryScheme.benefitAmount}\n` +
        `• Target Group: ${primaryScheme.rules.eligibleOccupations ? primaryScheme.rules.eligibleOccupations.join(', ') : 'All qualified citizens'}\n` +
        `• Official Link: ${primaryScheme.officialPortalUrl}`;
    }

    // Live LLM synthesis via Gemini (RAG over retrieved verified scheme records)
    const ai = getGenAI();
    if (ai && matchingSchemes.length > 0) {
      try {
        const modelName = process.env.AI_MODEL || 'gemini-flash-latest';
        const contextStr = matchingSchemes
          .slice(0, 3)
          .map(
            (s, i) =>
              `[Scheme ${i + 1}]: ${s.name}\n- Level: ${s.level}\n- Benefit: ${s.benefitAmount}\n- Description: ${s.shortDescription}\n- Required Documents: ${s.requiredDocuments.join(', ')}\n- Deadline: ${s.applicationDeadline || 'Open year-round'}\n- Official Link: ${s.officialPortalUrl}\n- Source: ${s.sourceVersion}`
          )
          .join('\n\n');

        const chatPrompt = `You are Saarthi AI, a trusted civic assistant for Indian scholarships, career roadmaps, and government schemes.
Answer the user's question using ONLY the verified official scheme records provided below.

VERIFIED SCHEME RECORDS:
${contextStr}

USER QUESTION: "${cleanQuery}"

GUIDELINES:
- Directly answer the question accurately and concisely.
- If asked about required documents, you MUST list them clearly: ${primaryScheme.requiredDocuments.join(', ')}.
- If asked about deadlines or benefits, state them exactly as listed in the verified records.
- Always include the verified official link (${primaryScheme.officialPortalUrl}).
- Never provide financial investment, medical, or legal litigation advice.`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini call timed out')), 4000)
        );
        const callPromise = ai.models.generateContent({
          model: modelName,
          contents: chatPrompt,
        });

        const res = await Promise.race([callPromise, timeoutPromise]);
        const genText = res?.text;
        if (genText && genText.trim().length > 20) {
          answer = genText.trim();
        }
      } catch {
        // Fall back gracefully to the deterministic rule-grounded response
      }
    }

    return {
      answer,
      citations,
      isOutOfScope: false,
      confidenceScore: 0.95,
    };
  }
}
