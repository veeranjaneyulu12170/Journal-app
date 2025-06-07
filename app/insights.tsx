import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { getJournalEntries } from '@/lib/storage';
import { JournalEntry } from '@/types';
import { analyzeEntries } from '@/lib/insights';
import { RefreshCw } from 'lucide-react-native';
import { format } from 'date-fns';
import FloatingMenuBar from '../components/FloatingMenuBar';

type TimeRange = '7days' | '30days' | '90days' | 'all';

export default function InsightsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<{
    positiveCount: number;
    neutralCount: number;
    negativeCount: number;
    moodOverTime: {
      labels: string[];
      datasets: {
        data: number[];
      }[];
    };
    commonWords: Array<{ word: string; count: number }>;
  } | null>(null);

  // Fetch entries and analyze when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadInsights();
    }, [timeRange])
  );

  const loadInsights = async () => {
    setLoading(true);
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
      
      // Filter entries based on selected time range
      const filteredEntries = filterEntriesByTimeRange(journalEntries, timeRange);
      
      // Analyze the filtered entries
      const insightData = await analyzeEntries(filteredEntries);
      setInsights(insightData);
    } catch (error) {
      console.error('Failed to load insights:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterEntriesByTimeRange = (entries: JournalEntry[], range: TimeRange): JournalEntry[] => {
    if (range === 'all') return entries;
    
    const now = new Date();
    let daysToSubtract: number;
    
    switch (range) {
      case '7days':
        daysToSubtract = 7;
        break;
      case '30days':
        daysToSubtract = 30;
        break;
      case '90days':
        daysToSubtract = 90;
        break;
      default:
        daysToSubtract = 30;
    }
    
    const cutoffDate = new Date(now);
    cutoffDate.setDate(cutoffDate.getDate() - daysToSubtract);
    
    return entries.filter(entry => new Date(entry.timestamp) >= cutoffDate);
  };

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}> 
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={[styles.loadingText, { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }]}>
          Analyzing your journal entries...
        </Text>
        <FloatingMenuBar />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}> 
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
      >
        {/* Time range selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
            Time Range
          </Text>
          <View style={styles.timeRangeButtons}>
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '7days' && styles.activeTimeButton,
                { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] }
              ]}
              onPress={() => setTimeRange('7days')}
            >
              <Text style={[
                styles.timeButtonText, 
                timeRange === '7days' && styles.activeTimeButtonText,
                { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }
              ]}>
                7 Days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '30days' && styles.activeTimeButton,
                { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] }
              ]}
              onPress={() => setTimeRange('30days')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === '30days' && styles.activeTimeButtonText,
                { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }
              ]}>
                30 Days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === '90days' && styles.activeTimeButton,
                { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] }
              ]}
              onPress={() => setTimeRange('90days')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === '90days' && styles.activeTimeButtonText,
                { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }
              ]}>
                90 Days
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.timeButton,
                timeRange === 'all' && styles.activeTimeButton,
                { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] }
              ]}
              onPress={() => setTimeRange('all')}
            >
              <Text style={[
                styles.timeButtonText,
                timeRange === 'all' && styles.activeTimeButtonText,
                { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }
              ]}>
                All Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: isDark ? COLORS.gray[400] : COLORS.gray[600] }]}>
              No journal entries to analyze. Start journaling to see insights.
            </Text>
          </View>
        ) : (
          <>
            {/* Mood distribution */}
            <View style={[styles.card, { backgroundColor: isDark ? COLORS.gray[900] : COLORS.white }]}>
              <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
                Mood Distribution
              </Text>
              <View style={styles.moodStatsContainer}>
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.success }]} />
                  <Text style={[styles.moodStatLabel, { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }]}>
                    Positive
                  </Text>
                  <Text style={[styles.moodStatValue, { color: isDark ? COLORS.white : COLORS.black }]}>
                    {insights?.positiveCount || 0}
                  </Text>
                </View>
                
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.warning }]} />
                  <Text style={[styles.moodStatLabel, { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }]}>
                    Neutral
                  </Text>
                  <Text style={[styles.moodStatValue, { color: isDark ? COLORS.white : COLORS.black }]}>
                    {insights?.neutralCount || 0}
                  </Text>
                </View>
                
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.error }]} />
                  <Text style={[styles.moodStatLabel, { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }]}>
                    Negative
                  </Text>
                  <Text style={[styles.moodStatValue, { color: isDark ? COLORS.white : COLORS.black }]}>
                    {insights?.negativeCount || 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mood over time chart */}
            {insights?.moodOverTime && insights.moodOverTime.labels.length > 0 && (
              <View style={[styles.card, { backgroundColor: isDark ? COLORS.gray[900] : COLORS.white }]}>
                <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
                  Mood Trends
                </Text>
                <View style={styles.chartContainer}>
                  <LineChart
                    data={insights.moodOverTime}
                    width={300}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: isDark ? COLORS.gray[800] : COLORS.white,
                      backgroundGradientTo: isDark ? COLORS.gray[900] : COLORS.gray[100],
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
                      labelColor: (opacity = 1) => isDark ? `rgba(255, 255, 255, ${opacity})` : `rgba(0, 0, 0, ${opacity})`,
                      style: {
                        borderRadius: 16,
                      },
                      propsForDots: {
                        r: '6',
                        strokeWidth: '2',
                        stroke: COLORS.primary,
                      },
                    }}
                    bezier
                    style={{
                      marginVertical: 8,
                      borderRadius: 16,
                      alignSelf: 'center',
                    }}
                  />
                </View>
                <Text style={styles.chartNote}>
                  1 = Negative, 2 = Neutral, 3 = Positive
                </Text>
              </View>
            )}

            {/* Common words */}
            {insights?.commonWords && insights.commonWords.length > 0 && (
              <View style={[styles.card, { backgroundColor: isDark ? COLORS.gray[900] : COLORS.white }]}>
                <Text style={[styles.sectionTitle, { color: isDark ? COLORS.white : COLORS.black }]}>
                  Common Words
                </Text>
                <View style={styles.commonWordsContainer}>
                  {insights.commonWords.slice(0, 10).map((item, index) => (
                    <View key={index} style={styles.wordItem}>
                      <Text style={[styles.word, { color: isDark ? COLORS.white : COLORS.black }]}>
                        {item.word}
                      </Text>
                      <Text style={[styles.wordCount, { color: isDark ? COLORS.gray[400] : COLORS.gray[600] }]}>
                        {item.count}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Refresh button */}
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={loadInsights}
            >
              <RefreshCw size={18} color={COLORS.white} />
              <Text style={styles.refreshButtonText}>Refresh Insights</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
      <FloatingMenuBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.md,
  },
  timeRangeContainer: {
    marginBottom: SPACING.md,
  },
  timeRangeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  timeButton: {
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
  },
  activeTimeButton: {
    backgroundColor: COLORS.primary,
  },
  timeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
  },
  activeTimeButtonText: {
    color: COLORS.white,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
  },
  moodStatsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodStat: {
    alignItems: 'center',
    flex: 1,
  },
  moodIndicator: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.round,
    marginBottom: SPACING.xs,
  },
  moodStatLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    marginBottom: SPACING.xs,
  },
  moodStatValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartNote: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.gray[500],
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  commonWordsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  wordItem: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  word: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
  },
  wordCount: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
  },
  emptyContainer: {
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  refreshButtonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
});