import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { format } from 'date-fns';
import { CreditCard as Edit, Trash2 } from 'lucide-react-native';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { JournalEntry } from '@/types';

interface JournalCardProps {
  entry: JournalEntry;
  onEdit: () => void;
  onDelete: () => void;
}

const JournalCard: React.FC<JournalCardProps> = ({ entry, onEdit, onDelete }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getMoodColor = () => {
    switch (entry.mood) {
      case 'positive':
        return COLORS.success;
      case 'neutral':
        return COLORS.warning;
      case 'negative':
        return COLORS.error;
      default:
        return COLORS.primary;
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? COLORS.gray[900] : COLORS.white },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <View
            style={[
              styles.moodIndicator,
              { backgroundColor: getMoodColor() },
            ]}
          />
          <Text
            style={[
              styles.title,
              { color: isDark ? COLORS.white : COLORS.black },
            ]}
            numberOfLines={1}
          >
            {entry.title}
          </Text>
        </View>
        <Text style={[styles.date, { color: isDark ? COLORS.gray[400] : COLORS.gray[600] }]}>
          {format(new Date(entry.timestamp), 'MMM d, yyyy • h:mm a')}
        </Text>
      </View>

      <Text
        style={[
          styles.content,
          { color: isDark ? COLORS.gray[300] : COLORS.gray[700] },
        ]}
        numberOfLines={4}
      >
        {entry.content}
      </Text>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] },
          ]}
          onPress={onEdit}
        >
          <Edit size={16} color={isDark ? COLORS.gray[300] : COLORS.gray[700]} />
          <Text
            style={[
              styles.actionText,
              { color: isDark ? COLORS.gray[300] : COLORS.gray[700] },
            ]}
          >
            Edit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: isDark ? COLORS.gray[800] : COLORS.gray[200] },
          ]}
          onPress={onDelete}
        >
          <Trash2 size={16} color={COLORS.error} />
          <Text style={[styles.actionText, { color: COLORS.error }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  header: {
    marginBottom: SPACING.sm,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  moodIndicator: {
    width: 12,
    height: 12,
    borderRadius: BORDER_RADIUS.round,
    marginRight: SPACING.sm,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.lg,
    flex: 1,
  },
  date: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.xs,
  },
  content: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    marginBottom: SPACING.md,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.sm,
    marginLeft: SPACING.sm,
  },
  actionText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xs,
    marginLeft: SPACING.xs,
  },
});

export default JournalCard;