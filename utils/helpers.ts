/**
 * Generates a unique ID for journal entries
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
};