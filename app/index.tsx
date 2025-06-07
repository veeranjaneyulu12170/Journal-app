import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  useColorScheme,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Save, Smile, Frown, Meh } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { saveJournalEntry } from '@/lib/storage';
import { JournalEntry } from '@/types';
import { generateUniqueId } from '@/utils/helpers';
import AddJournalEntry from './add-journal-entry';

export default function WelcomeScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/login');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title } >Hey there!</Text>
      <View style={styles.imageBox}>
        <Image
          source={require('../assets/images/cozy.jpg')}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <Text style={styles.overlayText}>
           
          </Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start Journaling</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.hyggeBackground,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.hyggeText,
    marginBottom: 24,
    fontFamily: 'Inter-Bold',
  },
  imageBox: {
    width: 280,
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: COLORS.hyggeLightBg,
    elevation: 4,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  overlayText: {
    color: COLORS.hyggeBackground,
    fontSize: 18,
    fontFamily: 'Inter-Medium',
  },
  button: {
    marginTop: 24,
    backgroundColor: COLORS.hyggePrimary,
    borderRadius: 32,
    paddingVertical: 16,
    paddingHorizontal: 48,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.hyggeText,
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
});