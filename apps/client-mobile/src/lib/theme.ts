type ColorScheme = 'light' | 'dark';

export interface Theme {
  colors: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    '2xl': number;
    '3xl': number;
    '4xl': number;
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  typography: {
    fontSize: {
      xs: number;
      sm: number;
      base: number;
      lg: number;
      xl: number;
      '2xl': number;
      '3xl': number;
    };
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
}

export const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    foreground: '#09090b',
    card: '#ffffff',
    cardForeground: '#09090b',
    primary: '#f472b6',
    primaryForeground: '#ffffff',
    secondary: '#f4f4f5',
    secondaryForeground: '#18181b',
    muted: '#f4f4f5',
    mutedForeground: '#71717a',
    accent: '#f4f4f5',
    accentForeground: '#18181b',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#e4e4e7',
    input: '#e4e4e7',
    ring: '#f472b6',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
    '3xl': 64,
    '4xl': 96,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
};

export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    background: '#09090b',
    foreground: '#fafafa',
    card: '#18181b',
    cardForeground: '#fafafa',
    primary: '#f472b6',
    primaryForeground: '#09090b',
    secondary: '#27272a',
    secondaryForeground: '#fafafa',
    muted: '#27272a',
    mutedForeground: '#a1a1aa',
    accent: '#27272a',
    accentForeground: '#fafafa',
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    border: '#27272a',
    input: '#27272a',
    ring: '#f472b6',
  },
};

export type ThemeMode = 'light' | 'dark' | 'system';

export const useTheme = (colorScheme?: ColorScheme) => {
  const getTheme = (mode: ThemeMode): Theme => {
    if (mode === 'system') {
      return colorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return mode === 'dark' ? darkTheme : lightTheme;
  };

  return {
    theme: getTheme('system'),
    isDark: colorScheme === 'dark',
    colors: getTheme('system').colors,
    spacing: getTheme('system').spacing,
    borderRadius: getTheme('system').borderRadius,
    typography: getTheme('system').typography,
  };
};