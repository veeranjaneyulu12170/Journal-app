import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.hyggePrimary} />
        <Text style={styles.loadingText}>
          Analyzing your journal entries...
        </Text>
        <FloatingMenuBar />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Time range selector */}
        <View style={styles.timeRangeContainer}>
          <Text style={styles.sectionTitle}>Time Range</Text>
          <View style={styles.timeRangeButtons}>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '7days' && styles.activeTimeButton]}
              onPress={() => setTimeRange('7days')}
            >
              <Text style={[styles.timeButtonText, timeRange === '7days' && styles.activeTimeButtonText]}>7 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '30days' && styles.activeTimeButton]}
              onPress={() => setTimeRange('30days')}
            >
              <Text style={[styles.timeButtonText, timeRange === '30days' && styles.activeTimeButtonText]}>30 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === '90days' && styles.activeTimeButton]}
              onPress={() => setTimeRange('90days')}
            >
              <Text style={[styles.timeButtonText, timeRange === '90days' && styles.activeTimeButtonText]}>90 Days</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.timeButton, timeRange === 'all' && styles.activeTimeButton]}
              onPress={() => setTimeRange('all')}
            >
              <Text style={[styles.timeButtonText, timeRange === 'all' && styles.activeTimeButtonText]}>All Time</Text>
            </TouchableOpacity>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No journal entries to analyze. Start journaling to see insights.
            </Text>
          </View>
        ) : (
          <>
            {/* Mood distribution */}
            <View style={[styles.card, { backgroundColor: COLORS.hyggeLightBg }]}>
              <Text style={styles.sectionTitle}>
                Mood Distribution
              </Text>
              <View style={styles.moodStatsContainer}>
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.success }]} />
                  <Text style={styles.moodStatLabel}>
                    Positive
                  </Text>
                  <Text style={styles.moodStatValue}>
                    {insights?.positiveCount || 0}
                  </Text>
                </View>
                
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.warning }]} />
                  <Text style={styles.moodStatLabel}>
                    Neutral
                  </Text>
                  <Text style={styles.moodStatValue}>
                    {insights?.neutralCount || 0}
                  </Text>
                </View>
                
                <View style={styles.moodStat}>
                  <View style={[styles.moodIndicator, { backgroundColor: COLORS.error }]} />
                  <Text style={styles.moodStatLabel}>
                    Negative
                  </Text>
                  <Text style={styles.moodStatValue}>
                    {insights?.negativeCount || 0}
                  </Text>
                </View>
              </View>
            </View>

            {/* Mood over time chart */}
            {insights?.moodOverTime && insights.moodOverTime.labels.length > 0 && (
              <View style={[styles.card, { backgroundColor: COLORS.hyggeLightBg }]}>
                <Text style={styles.sectionTitle}>
                  Mood Trends
                </Text>
                <View style={styles.chartContainer}>
                  <LineChart
                    data={insights.moodOverTime}
                    width={300}
                    height={220}
                    chartConfig={{
                      backgroundGradientFrom: COLORS.hyggeLightBg,
                      backgroundGradientTo: COLORS.hyggeLightBg,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(74, 111, 165, ${opacity})`,
                      labelColor: (opacity = 1) => COLORS.hyggeText,
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
              <View style={[styles.card, { backgroundColor: COLORS.hyggeLightBg }]}>
                <Text style={styles.sectionTitle}>
                  Common Words
                </Text>
                <View style={styles.commonWordsContainer}>
                  {insights.commonWords.slice(0, 10).map((item, index) => (
                    <View key={index} style={styles.wordItem}>
                      <Text style={styles.word}>
                        {item.word}
                      </Text>
                      <Text style={styles.wordCount}>
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
    backgroundColor: COLORS.hyggeBackground,
  },
  contentContainer: {
    padding: SPACING.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.hyggeBackground,
  },
  loadingText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    marginTop: SPACING.md,
    color: COLORS.hyggeText,
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
    backgroundColor: COLORS.hyggeLightBg,
  },
  activeTimeButton: {
    backgroundColor: COLORS.hyggePrimary,
  },
  timeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    textAlign: 'center',
    color: COLORS.hyggeText,
  },
  activeTimeButtonText: {
    color: COLORS.hyggeText,
  },
  card: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
    backgroundColor: COLORS.hyggeLightBg,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    marginBottom: SPACING.md,
    color: COLORS.hyggeText,
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
    color: COLORS.hyggeText,
  },
  moodStatValue: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xl,
    color: COLORS.hyggeText,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartNote: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
    color: COLORS.hyggeText,
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
    borderBottomColor: COLORS.hyggePrimary,
  },
  word: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.hyggeText,
  },
  wordCount: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    color: COLORS.hyggeText,
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
    color: COLORS.hyggeText,
  },
  refreshButton: {
    backgroundColor: COLORS.hyggePrimary,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SPACING.md,
  },
  refreshButtonText: {
    color: COLORS.hyggeText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    marginLeft: SPACING.sm,
  },
});