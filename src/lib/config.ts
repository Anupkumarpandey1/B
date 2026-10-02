// API Keys - All keys must be provided via environment variables
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  console.warn('VITE_GEMINI_API_KEY is not set. AI features will not work.');
}

// API URLs
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

// YouTube and RapidAPI Configuration
export const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;
export const RAPIDAPI_HOST = import.meta.env.VITE_RAPIDAPI_HOST || 'youtube-transcript3.p.rapidapi.com';

if (!RAPIDAPI_KEY) {
  console.warn('VITE_RAPIDAPI_KEY is not set. YouTube transcript features will not work.');
}

// Debug logging for development
if (process.env.NODE_ENV === 'development') {
  console.log('Config loaded:');
  console.log('Gemini API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');
  console.log('RapidAPI Key:', RAPIDAPI_KEY ? 'Present' : 'Missing');
  console.log('Gemini API URL:', GEMINI_API_URL);
}

// Model configurations
export const AI_MODELS = {
  quizGenerator: "gemini-flash-latest",
  teacherChat: "gemini-flash-latest",
};

// Quiz generation parameters
export const DEFAULT_QUIZ_PARAMS = {
  numQuestions: 5,
  numOptions: 4,
  temperature: 0.7,
  maxTokens: 2000,
};

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { id: 'english', name: 'English' },
  { id: 'hindi', name: 'Hindi' },
  { id: 'hinglish', name: 'Hinglish' }
];
