import AsyncStorage from '@react-native-async-storage/async-storage';
import { JournalEntry, UserProfile } from '@/types';

// Storage keys
const STORAGE_KEYS = {
  JOURNAL_ENTRIES: 'journal_entries',
  USER_PROFILE: 'user_profile',
};

/**
 * Saves a new journal entry to AsyncStorage
 */
export const saveJournalEntry = async (entry: JournalEntry): Promise<void> => {
  try {
    // Get existing entries
    const existingEntriesJSON = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    let entries: JournalEntry[] = [];
    
    if (existingEntriesJSON) {
      entries = JSON.parse(existingEntriesJSON);
    }
    
    // Check if entry already exists (for updates)
    const existingIndex = entries.findIndex(e => e.id === entry.id);
    
    if (existingIndex >= 0) {
      // Update existing entry
      entries[existingIndex] = entry;
    } else {
      // Add new entry
      entries.push(entry);
    }
    
    // Save updated entries back to storage
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving journal entry:', error);
    throw error;
  }
};

/**
 * Retrieves all journal entries from AsyncStorage
 */
export const getJournalEntries = async (): Promise<JournalEntry[]> => {
  try {
    const entriesJSON = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    
    if (!entriesJSON) {
      return [];
    }
    
    return JSON.parse(entriesJSON);
  } catch (error) {
    console.error('Error retrieving journal entries:', error);
    return [];
  }
};

/**
 * Deletes a journal entry by ID
 */
export const deleteJournalEntry = async (entryId: string): Promise<void> => {
  try {
    const entriesJSON = await AsyncStorage.getItem(STORAGE_KEYS.JOURNAL_ENTRIES);
    
    if (!entriesJSON) {
      return;
    }
    
    let entries: JournalEntry[] = JSON.parse(entriesJSON);
    
    // Filter out the entry with the given ID
    entries = entries.filter(entry => entry.id !== entryId);
    
    // Save the updated entries
    await AsyncStorage.setItem(STORAGE_KEYS.JOURNAL_ENTRIES, JSON.stringify(entries));
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    throw error;
  }
};

/**
 * Saves the user profile to AsyncStorage
 */
export const saveUserProfile = async (profile: UserProfile): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile:', error);
    throw error;
  }
};

/**
 * Retrieves the user profile from AsyncStorage
 */
export const getUserProfile = async (): Promise<UserProfile | null> => {
  try {
    const profileJSON = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    
    if (!profileJSON) {
      return null;
    }
    
    return JSON.parse(profileJSON);
  } catch (error) {
    console.error('Error retrieving user profile:', error);
    return null;
  }
};