import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Calendar as CalendarComponent } from 'react-native-calendars';
import { format } from 'date-fns';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { getJournalEntries, deleteJournalEntry } from '@/lib/storage';
import { JournalEntry } from '@/types';
import JournalCard from '@/components/JournalCard';
import FloatingMenuBar from '../components/FloatingMenuBar';

export default function HistoryScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [filteredEntries, setFilteredEntries] = useState<JournalEntry[]>([]);

  // Fetch entries when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadEntries();
    }, [])
  );

  const loadEntries = async () => {
    try {
      const journalEntries = await getJournalEntries();
      setEntries(journalEntries);
      
      // Create marked dates object for calendar
      const dates = journalEntries.reduce((acc: any, entry) => {
        const date = format(new Date(entry.timestamp), 'yyyy-MM-dd');
        
        // Determine dot color based on mood
        let dotColor;
        switch (entry.mood) {
          case 'positive':
            dotColor = COLORS.success;
            break;
          case 'neutral':
            dotColor = COLORS.warning;
            break;
          case 'negative':
            dotColor = COLORS.error;
            break;
          default:
            dotColor = COLORS.primary;
        }
        
        acc[date] = {
          marked: true,
          dotColor: dotColor
        };
        
        return acc;
      }, {});
      
      setMarkedDates(dates);
      
      // If a date is already selected, filter entries for that date
      if (selectedDate) {
        filterEntriesByDate(selectedDate);
      } else {
        setFilteredEntries(journalEntries);
      }
    } catch (error) {
      console.error('Failed to load journal entries:', error);
      Alert.alert('Error', 'Failed to load your journal entries.');
    }
  };

  const filterEntriesByDate = (date: string) => {
    const filtered = entries.filter(entry => {
      const entryDate = format(new Date(entry.timestamp), 'yyyy-MM-dd');
      return entryDate === date;
    });
    
    setFilteredEntries(filtered);
  };

  const handleDateSelect = (day: any) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);
    filterEntriesByDate(selectedDate);
  };

  const handleClearFilter = () => {
    setSelectedDate(null);
    setFilteredEntries(entries);
  };

  const handleEditEntry = (entry: JournalEntry) => {
    // Navigate to the add-journal-entry screen with the entry id for editing
    router.push({ pathname: '/add-journal-entry', params: { id: entry.id } });
  };

  const handleDeleteEntry = async (entryId: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this journal entry? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteJournalEntry(entryId);
              await loadEntries(); // Reload entries after deletion
              // If a date is selected, re-filter for that date
              if (selectedDate) {
                filterEntriesByDate(selectedDate);
              }
            } catch (error) {
              console.error('Failed to delete journal entry:', error);
              Alert.alert('Error', 'Failed to delete the journal entry.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CalendarComponent
        theme={{
          calendarBackground: COLORS.hyggeBackground,
          textSectionTitleColor: COLORS.hyggeText,
          selectedDayBackgroundColor: COLORS.hyggePrimary,
          selectedDayTextColor: COLORS.hyggeText,
          todayTextColor: COLORS.hyggePrimary,
          dayTextColor: COLORS.hyggeText,
          textDisabledColor: '#bdbdbd',
          dotColor: COLORS.hyggePrimary,
          monthTextColor: COLORS.hyggeText,
          arrowColor: COLORS.hyggePrimary,
        }}
        markedDates={{
          ...markedDates,
          ...(selectedDate ? {
            [selectedDate]: {
              ...markedDates[selectedDate],
              selected: true,
              selectedColor: COLORS.primary,
            }
          } : {})
        }}
        onDayPress={handleDateSelect}
        hideExtraDays
      />
      {selectedDate && (
        <View style={styles.filterInfo}>
          <Text style={styles.filterText}>
            Showing entries for: {format(new Date(selectedDate), 'MMMM d, yyyy')}
          </Text>
          <TouchableOpacity onPress={handleClearFilter} style={styles.clearFilterButton}>
            <Text style={styles.clearFilterText}>Clear Filter</Text>
          </TouchableOpacity>
        </View>
      )}
      {filteredEntries.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            {selectedDate 
              ? 'No journal entries for this date.' 
              : 'You haven\'t created any journal entries yet.'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JournalCard
              entry={item}
              onEdit={() => handleEditEntry(item)}
              onDelete={() => handleDeleteEntry(item.id)}
            />
          )}
          contentContainerStyle={styles.entriesList}
        />
      )}
      <FloatingMenuBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.hyggeBackground,
  },
  filterInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.hyggeLightBg,
    borderRadius: 12,
    marginVertical: 8,
  },
  filterText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
    color: COLORS.hyggeText,
  },
  clearFilterButton: {
    padding: SPACING.xs,
    backgroundColor: COLORS.hyggePrimary,
    borderRadius: 8,
  },
  clearFilterText: {
    color: COLORS.hyggeText,
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.sm,
  },
  entriesList: {
    padding: SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    textAlign: 'center',
    color: COLORS.hyggeText,
  },
});