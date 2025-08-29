// API Keys (in a real app, these should be environment variables)
export const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY || 'sk-example-key-replace-with-your-own';
export const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyAWFGHhI3vjvkjpzM70sDOBQsW_L5w5QdY';

// API URLs
export const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
export const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

// Debug logging for development (moved after all constants are declared)
if (process.env.NODE_ENV === 'development') {
  console.log('Config loaded:');
  console.log('Gemini API Key:', GEMINI_API_KEY ? 'Present' : 'Missing');
  console.log('OpenAI API Key:', OPENAI_API_KEY ? 'Present' : 'Missing');
  console.log('Gemini API URL:', GEMINI_API_URL);
  console.log('OpenAI API URL:', OPENAI_API_URL);
}

// Model configurations
export const AI_MODELS = {
  quizGenerator: "gemini-1.5-flash", // Primary: Gemini, Fallback: OpenAI
  teacherChat: "gemini-1.5-flash",
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
