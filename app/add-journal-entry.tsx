import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Alert, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FloatingMenuBar from '../components/FloatingMenuBar';
import { COLORS } from '@/constants/theme';
import { saveJournalEntry, getJournalEntries, deleteJournalEntry } from '@/lib/storage';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { JournalEntry } from '@/types';
import { generateUniqueId } from '@/utils/helpers';

const AddJournalEntry = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [currentQuote, setCurrentQuote] = useState('');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [insertedImages, setInsertedImages] = useState<Array<{ uri: string }>>([]);
  const router = useRouter();
  const params = useLocalSearchParams();
  const idParam = Array.isArray(params.id) ? params.id[0] : params.id;
  const [editId, setEditId] = useState<string | null>(idParam ?? null);

  // Inspirational quotes array
  const inspirationalQuotes = [
    "It takes courage to be kind",
    "The best way to find yourself is to lose yourself in the service of others",
    "Be yourself; everyone else is already taken",
    "In a world where you can be anything, be kind",
    "The only way to do great work is to love what you do",
    "Life is what happens to you while you're busy making other plans",
    "The future belongs to those who believe in the beauty of their dreams",
    "Success is not final, failure is not fatal: it is the courage to continue that counts",
    "The only impossible journey is the one you never begin",
    "Happiness can be found even in the darkest of times, if one only remembers to turn on the light",
    "Be the change you wish to see in the world",
    "Yesterday is history, tomorrow is a mystery, today is a gift",
    "The greatest glory in living lies not in never falling, but in rising every time we fall",
    "It is during our darkest moments that we must focus to see the light",
    "The way to get started is to quit talking and begin doing",
    "Don't judge each day by the harvest you reap but by the seeds that you plant",
    "The future depends on what you do today",
    "Life is really simple, but we insist on making it complicated",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us",
    "You must be the change you wish to see in the world"
  ];

  // Generate random quote
  const generateNewQuote = () => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setCurrentQuote(inspirationalQuotes[randomIndex]);
  };

  // Initialize with random quote on component mount
  useEffect(() => {
    generateNewQuote();
  }, []);

  // Load entry for editing
  useEffect(() => {
    if (editId) {
      (async () => {
        const entries = await getJournalEntries();
        const entry = entries.find(e => e.id === editId);
        if (entry) {
          setTitle(entry.title);
          setContent(entry.content);
          // Optionally: set formatting, images, etc.
        }
      })();
    }
  }, [editId]);

  // Save: update if editing, create if new
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Please enter both a title and your journal entry.');
      return;
    }
    setError('');
    const entry: JournalEntry = {
      id: editId || generateUniqueId(),
      title,
      content,
      mood: 'neutral',
      timestamp: editId ? new Date().toISOString() : new Date().toISOString(),
    };
    await saveJournalEntry(entry);
    Alert.alert('Saved', 'Your journal entry has been saved!');
    setTitle('');
    setContent('');
    setEditId(null);
    router.back();
  };

  // Delete entry
  const handleDelete = async () => {
    if (!editId) return;
    Alert.alert('Delete Entry', 'Are you sure you want to delete this journal entry?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteJournalEntry(editId);
        setTitle('');
        setContent('');
        setEditId(null);
        router.back();
      }}
    ]);
  };

  // Formatting handlers
  const toggleBold = () => setIsBold((b) => !b);
  const toggleItalic = () => setIsItalic((i) => !i);
  const toggleUnderline = () => setIsUnderline((u) => !u);

  // Image insert handler
  const handleInsertImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.7 });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setInsertedImages([...insertedImages, { uri: result.assets[0].uri }]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Quote Header */}
      <View style={styles.quoteHeader}>
        <Text style={styles.dailyQuote}>"{currentQuote}"</Text>
        <TouchableOpacity style={styles.refreshQuote} onPress={generateNewQuote}>
          <Text style={styles.refreshIcon}>🔄</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Add Journal Entry</Text>
      {/* Formatting Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity style={[styles.toolbarBtn, isBold && styles.activeToolbarBtn]} onPress={toggleBold}>
          <Text style={[styles.toolbarBtnText, { fontWeight: 'bold' }]}>B</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarBtn, isItalic && styles.activeToolbarBtn]} onPress={toggleItalic}>
          <Text style={[styles.toolbarBtnText, { fontStyle: 'italic' }]}>I</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toolbarBtn, isUnderline && styles.activeToolbarBtn]} onPress={toggleUnderline}>
          <Text style={[styles.toolbarBtnText, { textDecorationLine: 'underline' }]}>U</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn} onPress={handleInsertImage}>
          <Text style={styles.toolbarBtnText}>🖼️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.toolbarBtn} onPress={() => Alert.alert('Feature coming soon', 'Font size, color, bullet list, alignment, etc.')}> 
          <Text style={styles.toolbarBtnText}>⋯</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder="It takes courage to be kind"
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={title}
        onChangeText={setTitle}
      />
      {/* Adaptive scrollable content area (unstyled, no box) */}
      <ScrollView style={styles.contentScrollNoBox} contentContainerStyle={{ padding: 0 }}>
        <Text
          style={{
            fontWeight: isBold ? 'bold' : 'normal',
            fontStyle: isItalic ? 'italic' : 'normal',
            textDecorationLine: isUnderline ? 'underline' : 'none',
            color: COLORS.hyggeText,
            fontSize: 20,
            fontFamily: 'Inter-Regular',
            lineHeight: 30,
            paddingHorizontal: 0,
            backgroundColor: 'transparent',
          }}
        >
          {content || 'Today, I found myself reflecting on the power of kindness...'}
        </Text>
        {insertedImages.map((img, idx) => (
          <Image key={idx} source={{ uri: img.uri }} style={styles.insertedImage} />
        ))}
      </ScrollView>
      <TextInput
        style={{ display: 'none' }}
        value={content}
        onChangeText={setContent}
        multiline
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>{editId ? 'Update Entry' : '🙂‍↔️Save🙂‍↔️'}</Text>
      </TouchableOpacity>
      {editId && (
        <TouchableOpacity style={[styles.button, { backgroundColor: '#F44336', marginTop: 0 }]} onPress={handleDelete}>
          <Text style={[styles.buttonText, { color: 'white' }]}>Delete Entry</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.footerText}>
        Keep your story unfolding.{"\n"}Just tap to continue!
      </Text>
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
  quoteHeader: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.hyggeLightBg,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.hyggePrimary + '30',
    position: 'relative',
    alignItems: 'center',
  },
  dailyQuote: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.hyggeText,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: 'Inter-SemiBold',
    fontStyle: 'italic',
    paddingRight: 40,
  },
  refreshQuote: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.hyggePrimary + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  refreshIcon: {
    fontSize: 14,
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
  toolbar: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    backgroundColor: COLORS.hyggePrimary + '20',
    borderRadius: 12,
    width: '100%',
    maxWidth: 340,
  },
  toolbarBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarBtnText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.hyggeText,
    fontFamily: 'Inter-Bold',
  },
  button: {
    backgroundColor: COLORS.hyggePrimary,
    borderRadius: 24,
    paddingVertical: 14,
    paddingHorizontal: 64,
    marginTop: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    textAlign: 'center',
  },
  footerText: {
    color: COLORS.hyggeText + '99',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  insertedImage: {
    width: '100%',
    maxWidth: 340,
    height: 120,
    borderRadius: 12,
    marginVertical: 8,
  },
  activeToolbarBtn: {
    backgroundColor: COLORS.hyggePrimary,
    borderColor: COLORS.hyggePrimary,
  },
  contentScrollNoBox: {
    width: '100%',
    maxWidth: 340,
    minHeight: 120,
    maxHeight: 220,
    backgroundColor: 'transparent',
    borderRadius: 0,
    marginBottom: 16,
    paddingHorizontal: 0,
    elevation: 0,
    borderWidth: 0,
  },
});

export default AddJournalEntry;