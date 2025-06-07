import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '@/constants/theme';
import { saveUserProfile } from '@/lib/storage';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async () => {
    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    setError('');
    // Save user profile
    await saveUserProfile({
      name,
      email,
      reminderEnabled: false,
      theme: 'system',
    });
    // On success, route to main app (profile)
    router.replace('/index');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up to start your cozy journaling experience</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor={COLORS.hyggeText + '99'}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.link}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
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
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.hyggeText,
    marginBottom: 8,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 18,
    color: COLORS.hyggeText,
    marginBottom: 32,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
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
  link: {
    color: COLORS.hyggePrimary,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginTop: 8,
    textAlign: 'center',
  },
  error: {
    color: '#F44336',
    fontSize: 14,
    marginBottom: 8,
    fontFamily: 'Inter-Regular',
  },
}); 