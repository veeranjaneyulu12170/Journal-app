import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import FloatingMenuBar from '../components/FloatingMenuBar';
import { COLORS } from '@/constants/theme';
import { saveJournalEntry } from '@/lib/storage';
import { generateUniqueId } from '@/utils/helpers';

const AddJournalEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please enter both a title and your journal entry.');
      return;
    }
    setError('');
    await saveJournalEntry({
      id: generateUniqueId(),
      title,
      content,
      mood: 'neutral',
      timestamp: new Date().toISOString(),
    });
    Alert.alert('Saved', 'Your journal entry has been saved!');
    setTitle('');
    setContent('');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Add Journal Entry</Text>
      <TextInput
        style={styles.input}
        placeholder="Title"
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, { minHeight: 100, textAlignVertical: 'top' }]}
        placeholder="Write your thoughts here..."
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={content}
        onChangeText={setContent}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Entry</Text>
      </TouchableOpacity>
      <FloatingMenuBar />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.hyggeBackground,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.hyggeText,
    marginBottom: 16,
    fontFamily: 'Inter-Bold',
  },
  input: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.hyggeLightBg,
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: COLORS.hyggeText,
    marginBottom: 16,
    fontFamily: 'Inter-Regular',
    borderWidth: 1,
    borderColor: COLORS.hyggePrimary,
  },
  button: {
    backgroundColor: COLORS.hyggePrimary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 64,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.hyggeText,
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
  },
  error: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
});

export default AddJournalEntry;
