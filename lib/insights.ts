import { JournalEntry } from '@/types';
import { format, subDays } from 'date-fns';
import sentiment from 'sentiment';

/**
 * Analyzes journal entries to provide emotional insights
 */
export const analyzeEntries = async (entries: JournalEntry[]) => {
  // Count entries by mood
  const positiveCount = entries.filter(entry => entry.mood === 'positive').length;
  const neutralCount = entries.filter(entry => entry.mood === 'neutral').length;
  const negativeCount = entries.filter(entry => entry.mood === 'negative').length;
  
  // Calculate mood trends over time
  const moodOverTime = calculateMoodTrends(entries);
  
  // Extract common words from entries
  const commonWords = extractCommonWords(entries);
  
  return {
    positiveCount,
    neutralCount,
    negativeCount,
    moodOverTime,
    commonWords
  };
};

/**
 * Calculates mood trends over time from journal entries
 */
const calculateMoodTrends = (entries: JournalEntry[]) => {
  if (entries.length === 0) {
    return {
      labels: [],
      datasets: [{ data: [] }]
    };
  }
  
  // Sort entries by date
  const sortedEntries = [...entries].sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  // Extract up to 7 dates for display
  const displayEntries = sortedEntries.length <= 7 
    ? sortedEntries 
    : extractRepresentativeEntries(sortedEntries, 7);
  
  // Create labels and data points
  const labels = displayEntries.map(entry => 
    format(new Date(entry.timestamp), 'MM/dd')
  );
  
  const data = displayEntries.map(entry => {
    // Convert mood to numeric value for the chart
    switch (entry.mood) {
      case 'positive': return 3;
      case 'neutral': return 2;
      case 'negative': return 1;
      default: return 0;
    }
  });
  
  return {
    labels,
    datasets: [{ data }]
  };
};

/**
 * Extracts a representative sample of entries across the time range
 */
const extractRepresentativeEntries = (entries: JournalEntry[], count: number) => {
  if (entries.length <= count) return entries;
  
  const result: JournalEntry[] = [];
  const step = Math.floor(entries.length / (count - 1));
  
  // Always include first and last entry
  result.push(entries[0]);
  
  // Add evenly spaced entries in between
  for (let i = 1; i < count - 1; i++) {
    result.push(entries[i * step]);
  }
  
  result.push(entries[entries.length - 1]);
  
  return result;
};

/**
 * Extracts common words from all journal entries
 * Excludes common stop words
 */
const extractCommonWords = (entries: JournalEntry[]) => {
  if (entries.length === 0) return [];
  
  // Combine all entry content
  const allText = entries.map(entry => entry.content).join(' ');
  
  // Basic stopwords to exclude
  const stopWords = [
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 
    'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 
    'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 
    'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 
    'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 
    'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 
    'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 
    'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 
    'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 
    'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 
    'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 
    'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 
    'will', 'just', 'don', 'should', 'now'
  ];
  
  // Split into words, convert to lowercase, and filter out stop words and short words
  const wordsArray = allText
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
  
  // Count word frequency
  const wordCount: Record<string, number> = {};
  for (const word of wordsArray) {
    wordCount[word] = (wordCount[word] || 0) + 1;
  }
  
  // Convert to array and sort by frequency
  const sortedWords = Object.entries(wordCount)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
  
  return sortedWords.slice(0, 20); // Return top 20 words
};

/**
 * Performs sentiment analysis on a text string
 * Returns a score between -5 (very negative) and 5 (very positive)
 */
export const analyzeSentiment = (text: string): number => {
  const result = sentiment(text);
  
  // Normalize score to a range between -5 and 5
  let score = result.score;
  if (score > 5) score = 5;
  if (score < -5) score = -5;
  
  return score;
};