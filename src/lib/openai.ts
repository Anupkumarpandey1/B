import { GEMINI_API_KEY } from './config';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// Candidate models in order of stability
const STABLE_GEMINI_MODELS = [
  "gemini-3.8-flash",
  "gemini-3.7-flash",
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-flash-latest",
  "gemini-pro-latest"
];

// Helper to make resilient Gemini API calls with automatic model fallback
export const callGeminiAPI = async (prompt: string): Promise<string> => {
  let lastError: any = null;
  
  for (const model of STABLE_GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;
      
      console.log(`Trying model: ${model}`);
      
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });
      
      const data = await response.json();
      console.log(`Model ${model} response:`, data);
      
      if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
        console.log(`✅ Model ${model} succeeded`);
        return data.candidates[0].content.parts[0].text;
      }
      
      lastError = new Error(data.error?.message || `Model ${model} returned status ${response.status}`);
      console.warn(`Model ${model} warning (${response.status}):`, data.error?.message || response.statusText);
    } catch (err) {
      lastError = err;
      console.warn(`Fetch error for model ${model}:`, err);
    }
  }
  
  throw lastError || new Error("Failed to communicate with Gemini API across all candidate models.");
};

// Helper to safely extract and parse JSON from AI responses
export const safeParseJSON = <T>(text: string, fallback: T): T => {
  if (!text) return fallback;
  
  // Clean markdown block wrappers if present
  let cleanText = text.trim();
  if (cleanText.startsWith('```')) {
    cleanText = cleanText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }
  
  // 1. Try direct parse
  try {
    return JSON.parse(cleanText);
  } catch (_) { }
  
  // 2. Try extracting JSON array [ ... ]
  const arrayStart = cleanText.indexOf('[');
  const arrayEnd = cleanText.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    try {
      return JSON.parse(cleanText.substring(arrayStart, arrayEnd + 1));
    } catch (e) {
      console.warn("Array JSON extraction failed:", e);
    }
  }
  
  // 3. Try extracting JSON object { ... }
  const objStart = cleanText.indexOf('{');
  const objEnd = cleanText.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(cleanText.substring(objStart, objEnd + 1));
    } catch (e) {
      console.warn("Object JSON extraction failed:", e);
    }
  }
  
  return fallback;
};

// API Health Check Function
export async function checkAPIHealth(): Promise<{ gemini: boolean; errors: string[] }> {
  const errors: string[] = [];
  let geminiHealthy = false;

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${GEMINI_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY 
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: 'Test message' }] }]
      })
    });
    
    if (response.ok) {
      geminiHealthy = true;
      console.log('✅ Gemini API is healthy');
    } else {
      const errorText = await response.text();
      errors.push(`Gemini API error: ${response.status} - ${errorText}`);
      console.error('❌ Gemini API error:', response.status, errorText);
    }
  } catch (error) {
    errors.push(`Gemini API connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.error('❌ Gemini API connection failed:', error);
  }

  return { gemini: geminiHealthy, errors };
}

export async function getTeacherResponse(message: string): Promise<string | null> {
  try {
    const systemPrompt = `You are an expert teacher. Your job is to provide helpful, accurate, and engaging responses to student questions. Keep your answers concise and easy to understand.`;

    return await callGeminiAPI(`${systemPrompt}\n\nUser question: ${message}`);
  } catch (error) {
    console.error("Error getting teacher response:", error);
    return null;
  }
}

export interface QuizData {
  questions: QuizQuestion[];
  title?: string;
  description?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  topic?: string;
}

export interface QuizQuestion {
  question: string;
  options: {
    text: string;
    correct: boolean;
    explanation: string;
  }[];
}

// Function to extract content from YouTube videos
export async function extractFromYouTube(youtubeUrl: string): Promise<string | null> {
  try {
    const { getVideoDetails } = await import('@/lib/youtube');
    return await getVideoDetails(youtubeUrl);
  } catch (error) {
    console.error("Error extracting from YouTube:", error);
    return null;
  }
}

// Function to get a summary from YouTube
export async function getSummaryFromYouTube(youtubeUrl: string): Promise<string | null> {
  try {
    const { getVideoSummary } = await import('@/lib/youtube');
    return await getVideoSummary(youtubeUrl);
  } catch (error) {
    console.error("Error getting summary from YouTube:", error);
    return null;
  }
}

// Function to process YouTube summary
export async function getProcessedSummaryFromYouTube(rawSummary: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    const { getProcessedSummary } = await import('@/lib/youtube');
    return await getProcessedSummary(rawSummary, language);
  } catch (error) {
    console.error("Error processing YouTube summary:", error);
    return null;
  }
}

// Function to analyze image with Gemini API
export async function analyzeImageWithGemini(imageBase64: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    console.log("Analyzing image with Gemini API...");
    return `This is an image analysis placeholder. In a real implementation, this would be the text extracted from the image using Google's Gemini API in ${language} language.`;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    return null;
  }
}

// Function to process extracted text
export async function processExtractedText(extractedText: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    console.log("Processing extracted text...");
    return `Processed text: ${extractedText} (Language: ${language})`;
  } catch (error) {
    console.error("Error processing extracted text:", error);
    return null;
  }
}

// Fallback quiz generator
const createFallbackQuiz = (text: string, numQuestions: number): QuizData => {
  const topic = text.trim();
  const title = topic.length > 30 ? topic.substring(0, 30) + "..." : topic;
  
  return {
    questions: Array.from({ length: numQuestions }, (_, i) => ({
      question: `Which statement accurately describes core principle #${i + 1} of ${title}?`,
      options: [
        { text: `Efficient approach for ${title}`, correct: i === 0, explanation: i === 0 ? "This is the correct answer." : "" },
        { text: `A redundant method`, correct: false, explanation: "" },
        { text: `An obsolete framework`, correct: false, explanation: "" },
        { text: `None of the above`, correct: i !== 0, explanation: i !== 0 ? "This is the correct answer." : "" }
      ]
    })),
    difficulty: 'medium' as const
  };
};

export async function generateQuiz(
  prompt: string, 
  numQuestions: number = 5, 
  numOptions: number = 4,
  difficultyOrLanguage: 'easy' | 'medium' | 'hard' | 'english' | 'hindi' | 'hinglish' = 'medium'
): Promise<QuizData | null> {
  try {
    const isDifficulty = ['easy', 'medium', 'hard'].includes(difficultyOrLanguage);
    const difficulty = isDifficulty ? difficultyOrLanguage as 'easy' | 'medium' | 'hard' : 'medium';
    const language = !isDifficulty ? difficultyOrLanguage : 'english';
    
    let languageInstruction = '';
    if (language === 'hindi') {
      languageInstruction = 'Generate the quiz in Hindi language.';
    } else if (language === 'hinglish') {
      languageInstruction = 'Generate the quiz in Hinglish (mix of Hindi and English).';
    }

    console.log("Generating quiz with prompt:", prompt);
    console.log("Difficulty:", difficulty, "Language:", language);

    const geminiPrompt = `Generate ${numQuestions} multiple-choice quiz questions based on the following topic: "${prompt}".

Format your response as a JSON object with this exact structure:
{
  "questions": [
    {
      "question": "Question text here?",
      "options": [
        {"text": "Option A", "correct": false, "explanation": ""},
        {"text": "Option B", "correct": true, "explanation": "Why this is correct"},
        {"text": "Option C", "correct": false, "explanation": ""},
        {"text": "Option D", "correct": false, "explanation": ""}
      ]
    }
  ]
}

Requirements:
- ${numOptions} options per question
- ${difficulty} difficulty level
- Only ONE option should be correct
- Provide explanation only for the correct answer
- ${languageInstruction}

Return ONLY the JSON object, no markdown or additional text.`;

    const generatedText = await callGeminiAPI(geminiPrompt);
    console.log(" ========== RAW GEMINI RESPONSE ==========");
    console.log(generatedText);
    console.log("==========================================");
    
    const quizData = safeParseJSON<any>(generatedText, null);
    
    if (quizData && quizData.questions && Array.isArray(quizData.questions)) {
      console.log("✅ Successfully parsed quiz data from Gemini API");
      return {
        ...quizData,
        difficulty
      };
    }
    
    throw new Error("Failed to parse quiz response from Gemini API.");
    
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw error;
  }
}
