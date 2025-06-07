import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  useColorScheme,
  Switch,
} from 'react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { getUserProfile, saveUserProfile } from '@/lib/storage';
import { UserProfile } from '@/types';
import { Check } from 'lucide-react-native';
import FloatingMenuBar from '../components/FloatingMenuBar';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [profile, setProfile] = useState<UserProfile & { bio?: string; dailyQuote?: string }>({
    name: '',
    email: '',
    reminderEnabled: false,
    theme: 'system',
    bio: '',
    dailyQuote: '',
  });
  
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userProfile = await getUserProfile();
      if (userProfile) {
        // Load bio and dailyQuote from AsyncStorage if present, else default to empty string
        const bio = (userProfile as any).bio || '';
        const dailyQuote = (userProfile as any).dailyQuote || '';
        setProfile({ ...userProfile, bio, dailyQuote });
      }
    } catch (error) {
      console.error('Failed to load user profile:', error);
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!profile.name.trim()) {
      Alert.alert('Missing Name', 'Please enter your name.');
      return;
    }

    if (profile.email && !isValidEmail(profile.email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setIsSaving(true);
    try {
      // Save bio and dailyQuote as part of the profile object
      await saveUserProfile({ ...profile });
      Alert.alert('Profile Saved', 'Your profile has been updated successfully.');
    } catch (error) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', 'Failed to save your profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleThemeChange = (theme: 'light' | 'dark' | 'system') => {
    setProfile(prev => ({ ...prev, theme }));
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}> 
      <ScrollView
        style={[styles.container, { backgroundColor: COLORS.hyggeBackground }]}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={[styles.card, { backgroundColor: COLORS.hyggeLightBg }]}> 
          <Text style={[styles.sectionTitle, { color: COLORS.hyggeText }]}>Personal Information</Text>
          
          <Text style={[styles.label, { color: COLORS.hyggeText }]}>Name</Text>
          <TextInput
            style={[styles.input, { color: COLORS.hyggeText, backgroundColor: COLORS.hyggeBackground }]}
            placeholder="Your name"
            placeholderTextColor={COLORS.hyggeText + '99'}
            value={profile.name}
            onChangeText={(text) => setProfile(prev => ({ ...prev, name: text }))}
          />
          
          <Text style={[styles.label, { color: COLORS.hyggeText }]}>Email (optional)</Text>
          <TextInput
            style={[styles.input, { color: COLORS.hyggeText, backgroundColor: COLORS.hyggeBackground }]}
            placeholder="your.email@example.com"
            placeholderTextColor={COLORS.hyggeText + '99'}
            value={profile.email}
            onChangeText={(text) => setProfile(prev => ({ ...prev, email: text }))}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <Text style={[styles.label, { color: COLORS.hyggeText }]}>Bio</Text>
          <TextInput
            style={[styles.input, { color: COLORS.hyggeText, backgroundColor: COLORS.hyggeBackground, minHeight: 60 }]}
            placeholder="Tell us about yourself..."
            placeholderTextColor={COLORS.hyggeText + '99'}
            value={profile.bio}
            onChangeText={(text) => setProfile(prev => ({ ...prev, bio: text }))}
            multiline
          />
          
          <Text style={[styles.label, { color: COLORS.hyggeText }]}>Daily Quote</Text>
          <TextInput
            style={[styles.input, { color: COLORS.hyggeText, backgroundColor: COLORS.hyggeBackground }]}
            placeholder="Your favorite daily quote..."
            placeholderTextColor={COLORS.hyggeText + '99'}
            value={profile.dailyQuote}
            onChangeText={(text) => setProfile(prev => ({ ...prev, dailyQuote: text }))}
          />
        </View>
        
        <View style={[styles.card, { backgroundColor: COLORS.hyggeLightBg }]}> 
          <Text style={[styles.sectionTitle, { color: COLORS.hyggeText }]}>Preferences</Text>
          
          <View style={styles.preferenceItem}>
            <Text style={[styles.preferenceLabel, { color: COLORS.hyggeText }]}>Daily Reminders</Text>
            <Switch
              value={profile.reminderEnabled}
              onValueChange={(value) => setProfile(prev => ({ ...prev, reminderEnabled: value }))}
              trackColor={{ false: COLORS.hyggeBackground, true: COLORS.hyggePrimary }}
              thumbColor={COLORS.hyggeText}
            />
          </View>
          
          <Text style={[styles.label, { color: COLORS.hyggeText, marginTop: 16 }]}>Theme</Text>
          <View style={styles.themeButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                profile.theme === 'light' && styles.selectedThemeButton,
                { backgroundColor: COLORS.hyggeBackground }
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text style={[
                styles.themeButtonText,
                profile.theme === 'light' && styles.selectedThemeButtonText,
                { color: COLORS.hyggeText }
              ]}>
                Light
              </Text>
              {profile.theme === 'light' && <Check size={16} color={COLORS.hyggePrimary} style={styles.checkIcon} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                profile.theme === 'dark' && styles.selectedThemeButton,
                { backgroundColor: COLORS.hyggeBackground }
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text style={[
                styles.themeButtonText,
                profile.theme === 'dark' && styles.selectedThemeButtonText,
                { color: COLORS.hyggeText }
              ]}>
                Dark
              </Text>
              {profile.theme === 'dark' && <Check size={16} color={COLORS.hyggePrimary} style={styles.checkIcon} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.themeButton,
                profile.theme === 'system' && styles.selectedThemeButton,
                { backgroundColor: COLORS.hyggeBackground }
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text style={[
                styles.themeButtonText,
                profile.theme === 'system' && styles.selectedThemeButtonText,
                { color: COLORS.hyggeText }
              ]}>
                System
              </Text>
              {profile.theme === 'system' && <Check size={16} color={COLORS.hyggePrimary} style={styles.checkIcon} />}
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: COLORS.hyggePrimary }]} onPress={handleSave} disabled={isSaving}>
          <Text style={[styles.saveButtonText, { color: COLORS.hyggeText }]}>{isSaving ? 'Saving...' : 'Save Profile'}</Text>
        </TouchableOpacity>
      </ScrollView>
      <FloatingMenuBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  input: {
    borderRadius: 16,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#f0cea0',
    fontFamily: 'Inter-Regular',
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  preferenceLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  themeButtonsContainer: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 8,
  },
  themeButton: {
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#f0cea0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedThemeButton: {
    borderWidth: 2,
    borderColor: '#f0cea0',
    backgroundColor: '#FFF7ec',
  },
  themeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginRight: 4,
  },
  selectedThemeButtonText: {
    color: COLORS.white,
  },
  checkIcon: {
    marginLeft: 2,
  },
  saveButton: {
    borderRadius: 32,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
});