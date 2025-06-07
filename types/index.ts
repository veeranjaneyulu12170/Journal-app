// Journal entry type
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  timestamp: string; // ISO string
}

// User profile type
export interface UserProfile {
  name: string;
  email: string;
  reminderEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}