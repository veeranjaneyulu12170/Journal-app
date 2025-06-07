import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Calendar, BookOpen, ChartPie, User, Sparkles, PlusCircle } from 'lucide-react-native';
import { COLORS } from '../constants/theme';

const FloatingMenuBar = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.tab} onPress={() => router.replace('/insights')}>
        <ChartPie color={COLORS.primary} size={28} />
        <Text style={styles.label}>Insights</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.replace('/inspiration')}>
        <Sparkles color={COLORS.primary} size={28} />
        <Text style={styles.label}>Inspire</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.addButton} onPress={() => router.replace('/add-journal-entry')}>
        <PlusCircle color={COLORS.white} size={44} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.replace('/history')}>
        <Calendar color={COLORS.primary} size={28} />
        <Text style={styles.label}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.tab} onPress={() => router.replace('/profile')}>
        <User color={COLORS.primary} size={28} />
        <Text style={styles.label}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: Platform.OS === 'ios' ? 36 : 20,
    backgroundColor: COLORS.white,
    borderRadius: 40,
    padding: 10,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 100,
  },
  tab: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: COLORS.primary,
    marginTop: 2,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 32,
    padding: 4,
    marginHorizontal: 8,
    marginTop: -28,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});

export default FloatingMenuBar;
