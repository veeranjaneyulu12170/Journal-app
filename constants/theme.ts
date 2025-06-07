// Color palette for the app
export const COLORS = {
  primary: '#4A6FA5', // Blue (primary brand color)
  secondary: '#9B8AAC', // Muted purple (secondary color)
  accent: '#E8A87C', // Peach (accent color)
  success: '#4CAF50', // Green (success state)
  warning: '#FFC107', // Amber (warning state)
  error: '#F44336', // Red (error state)
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  darkBg: '#121212',
  
  // Gray scale
  gray: {
    100: '#F5F7FA',
    200: '#E4E7EB',
    300: '#CBD2D9',
    400: '#9AA5B1',
    500: '#7B8794',
    600: '#616E7C',
    700: '#52606D',
    800: '#3E4C59',
    900: '#1F2933',
  },

  // Custom palette
  hyggePrimary: '#f0cea0',
  hyggeBackground: '#FFF7ec',
  hyggeText: '#0f0f0f',
  hyggeLightBg: '#f5f5f5',
};

// Exported palette for easy reference
export const HYGGE_PALETTE = [
  COLORS.hyggePrimary,
  COLORS.hyggeBackground,
  COLORS.hyggeText,
  COLORS.hyggeLightBg,
];

// Typography
export const FONTS = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  bold: 'Inter-Bold',
};

// Font sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing (8px system)
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 9999,
};

// Shadows
export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  medium: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  dark: {
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
};