import { toast } from "sonner";
import { GEMINI_API_KEY, GEMINI_API_URL, RAPIDAPI_KEY, RAPIDAPI_HOST } from "./config";

export async function getVideoDetails(youtubeUrl: string): Promise<string | null> {
  try {
    if (!youtubeUrl.includes('youtube.com/watch?v=') && !youtubeUrl.includes('youtu.be/')) {
      toast.error('Please enter a valid YouTube URL');
      return null;
    }

    // Extract video ID from URL
    let videoId = '';
    if (youtubeUrl.includes('youtube.com/watch?v=')) {
      const urlObj = new URL(youtubeUrl);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (youtubeUrl.includes('youtu.be/')) {
      videoId = youtubeUrl.split('youtu.be/')[1].split('?')[0];
    }

    if (!videoId) {
      toast.error('Could not extract video ID from URL');
      return null;
    }

    console.log("Fetching transcript for video ID:", videoId);

    // Use the new YouTube Transcript API
    const response = await fetch(
      `https://${RAPIDAPI_HOST}/api/transcript-with-url?lang=en&flat_text=true&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${videoId}`)}`,
      {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'x-rapidapi-host': RAPIDAPI_HOST,
          'x-rapidapi-key': RAPIDAPI_KEY
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Transcript API error:', errorText);
      toast.error('Failed to fetch video transcript');
      return null;
    }

    const data = await response.json();
    console.log("Transcript API response:", data);

    // Extract transcript text from response
    if (data && data.transcript) {
      return data.transcript;
    } else if (data && data.text) {
      return data.text;
    } else if (typeof data === 'string') {
      return data;
    }

    toast.error('No transcript available for this video');
    return null;
  } catch (error) {
    console.error('Error fetching video details:', error);
    toast.error('Failed to fetch video transcript');
    return null;
  }
}

export function getVideoSummary(youtubeUrl: string): Promise<string | null> {
  return new Promise(async (resolve, reject) => {
    try {
      const transcript = await getVideoDetails(youtubeUrl);
      if (transcript) {
        resolve(transcript);
      } else {
        reject('Failed to get transcript');
      }
    } catch (error) {
      console.error('Error getting video summary:', error);
      reject(error);
    }
  });
}

export async function getProcessedSummary(rawApiResponse: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    let transcript = "";
    console.log("Processing raw API response:", rawApiResponse.substring(0, 100) + "...");
    
    try {
      // Try to parse the API response
      const apiData = JSON.parse(rawApiResponse);
      console.log("Successfully parsed API response:", apiData);
      
      if (apiData && apiData.transcript) {
        console.log("Found transcript in API response");
        transcript = apiData.transcript;
      } else if (apiData && apiData.text) {
        console.log("Found text in API response");
        transcript = apiData.text;
      } else if (typeof apiData === 'string') {
        transcript = rawApiResponse;
      }
    } catch (e) {
      // If parsing fails, use the raw response
      console.log('Using raw response as transcript');
      transcript = rawApiResponse;
    }
    
    console.log("Sending to Gemini for formatting...");
    const formattedSummary = await formatSummaryWithGemini(transcript, language);
    
    if (!formattedSummary) {
      toast.error("Failed to format summary with Gemini");
      return transcript;
    }
    
    return formattedSummary;
  } catch (error) {
    console.error("Error processing summary:", error);
    toast.error('Failed to process summary');
    return null;
  }
}

async function formatSummaryWithGemini(content: string, language: 'english' | 'hindi' | 'hinglish' = 'english'): Promise<string | null> {
  try {
    let languageInstructions = '';
    if (language === 'hindi') {
      languageInstructions = 'Translate and format the summary in Hindi language.';
    } else if (language === 'hinglish') {
      languageInstructions = 'Translate and format the summary in Hinglish language (mix of Hindi and English words, like "kya kar rhe ho" instead of pure Hindi). Use Roman script with Hindi words rather than Devanagari script.';
    }

    const prompt = `The following is content from a YouTube video transcript or summary. 
    Format it into a well-structured, easy-to-read summary:

    "${content}"

    Format the response with:
    - CAPITALIZED WORDS for main headings
    - CAPITALIZED PHRASES WITH COLON: for subheadings
    - Use bullet points (* or -) for lists where appropriate
    - Use numbered points (1., 2., etc.) for sequential information
    - Use **double asterisks** for important concepts
    - Leave blank lines between paragraphs and sections
    
    ${languageInstructions}
    
    The response should be educational and clearly formatted.`;

    console.log("Sending prompt to Gemini API...");

    // Use X-goog-api-key header as per the working curl command
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          temperature: 0.3,
          maxOutputTokens: 2048
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini API error response:", errorText);
      throw new Error(`API request failed with status ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log("Gemini API response data:", data);
    
    const formattedContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!formattedContent) {
      console.error("No valid content in Gemini response:", data);
      throw new Error('No content returned from API');
    }

    return formattedContent;
  } catch (error) {
    console.error('Error formatting summary with Gemini:', error);
    toast.error('Failed to format summary');
    return null;
  }
}
