// Journal entry type
export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: 'positive' | 'neutral' | 'negative';
  timestamp: string; // ISO string
  coverImage?: { id: number; uri: string; title: string } | null;
  textStyle?: JournalTextStyle;
  textColor?: string;
}

// Text style type for journal entries
export interface JournalTextStyle {
  bold: boolean;
  italic: boolean;
  underline: boolean;
}

// User profile type
export interface UserProfile {
  name: string;
  email: string;
  reminderEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}