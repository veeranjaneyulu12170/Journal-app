import { platform } from 'react-native';

const QUOTE_API_URL = 'https://api.quotable.io/random';

/**
 * Fetches a random inspirational quote from the API
 * @returns Promise with quote text and author
 */
export const fetchDailyQuote = async (): Promise<{ text: string; author: string }> => {
  try {
    const response = await fetch(QUOTE_API_URL);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      text: data.content,
      author: data.author
    };
  } catch (error) {
    console.error('Error fetching quote:', error);
    // Return fallback quote if API fails
    return {
      text: "Believe you can and you're halfway there.",
      author: "Theodore Roosevelt"
    };
  }
};

/**
 * This would be the place to add other API methods for AI insights
 * if using a remote API instead of local sentiment analysis
 */