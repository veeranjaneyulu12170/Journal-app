import React from 'react';
import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Calendar, BookOpen, ChartPie as PieChart, User, Sparkles } from 'lucide-react-native';
import { COLORS } from '../../constants/theme';

export default function MainTabs() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: isDark ? COLORS.gray[400] : COLORS.gray[500],
        tabBarStyle: {
          backgroundColor: isDark ? COLORS.darkBg : COLORS.white,
          borderTopColor: isDark ? COLORS.gray[800] : COLORS.gray[200],
        },
        headerStyle: {
          backgroundColor: isDark ? COLORS.darkBg : COLORS.white,
        },
        headerTintColor: isDark ? COLORS.white : COLORS.black,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
          marginBottom: 4,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => <BookOpen size={size} color={color} />,
          headerTitle: 'My Journal',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerTitle: 'Entry History',
        }}
      />
      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => <PieChart size={size} color={color} />,
          headerTitle: 'Emotional Insights',
        }}
      />
      <Tabs.Screen
        name="inspiration"
        options={{
          title: 'Inspire',
          tabBarIcon: ({ color, size }) => <Sparkles size={size} color={color} />,
          headerTitle: 'Daily Inspiration',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          headerTitle: 'My Profile',
        }}
      />
    </Tabs>
  );
} 