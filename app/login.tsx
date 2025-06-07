import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, FONTS } from '@/constants/theme';
import { getUserProfile } from '@/lib/storage';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    // Simple check: see if email matches stored profile
    const profile = await getUserProfile();
    if (!profile || profile.email !== email) {
      setError('No account found with that email.');
      return;
    }
    setError('');
    router.replace('/inspiration');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Log in to continue your journaling journey</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push('/signup')}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
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