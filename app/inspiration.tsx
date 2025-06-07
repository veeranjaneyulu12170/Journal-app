import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  useColorScheme,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { COLORS, FONTS, FONT_SIZES, SPACING, BORDER_RADIUS, SHADOWS } from '@/constants/theme';
import { fetchDailyQuote } from '@/lib/api';
import { RefreshCw, Share as ShareIcon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import FloatingMenuBar from '../components/FloatingMenuBar';

export default function InspirationScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const loadQuote = useCallback(async () => {
    setLoading(true);
    try {
      const dailyQuote = await fetchDailyQuote();
      setQuote(dailyQuote);
    } catch (error) {
      console.error('Failed to fetch daily quote:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Load quote when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadQuote();
    }, [loadQuote])
  );

  const handleRefresh = () => {
    // Trigger haptic feedback on devices that support it
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    loadQuote();
  };

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      alert('Sharing is not available in web version');
      return;
    }

    if (!quote) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      
      // In a real app, we would use the Share API
      alert(`Sharing: "${quote.text}" - ${quote.author}`);
    } catch (error) {
      console.error('Error sharing quote:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBg : COLORS.white }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.pexels.com/photos/1261728/pexels-photo-1261728.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.titleText}>Daily Inspiration</Text>
        
        <View style={[styles.quoteCard, { backgroundColor: isDark ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.9)' }]}>
          {loading ? (
            <ActivityIndicator size="large" color={COLORS.primary} />
          ) : (
            <>
              <Text style={[styles.quoteText, { color: isDark ? COLORS.white : COLORS.black }]}>
                "{quote?.text || 'Loading your inspiration...'}"
              </Text>
              
              {quote?.author && (
                <Text style={[styles.authorText, { color: isDark ? COLORS.gray[300] : COLORS.gray[700] }]}>
                  — {quote.author}
                </Text>
              )}
            </>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.refreshButton]}
            onPress={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>New Quote</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.shareButton]}
            onPress={handleShare}
            disabled={loading || !quote}
          >
            <ShareIcon size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>Share</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FloatingMenuBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  titleText: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.xxxl,
    color: COLORS.white,
    marginBottom: SPACING.xl,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  quoteCard: {
    width: '100%',
    padding: SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.medium,
    maxWidth: 500,
  },
  quoteText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.xl,
    lineHeight: FONT_SIZES.xl * 1.5,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  authorText: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.md,
    textAlign: 'right',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: SPACING.xl,
    width: '100%',
    justifyContent: 'space-around',
    maxWidth: 500,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
  },
  refreshButton: {
    backgroundColor: COLORS.primary,
  },
  shareButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.md,
    color: COLORS.white,
    marginLeft: SPACING.sm,
  },
});