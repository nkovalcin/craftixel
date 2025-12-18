// ============================================
// CRAFTIXEL - Default Design Tokens
// ============================================

import type { DesignTokens, ColorScale, NeutralScale } from '@craftixel/types';

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Convert hex to HSL
 */
export function hexToHSL(hex: string): { h: number; s: number; l: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return { h: 0, s: 0, l: 0 };

  let r = parseInt(result[1], 16) / 255;
  let g = parseInt(result[2], 16) / 255;
  let b = parseInt(result[3], 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

/**
 * Convert HSL to hex
 */
export function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;

  if (0 <= h && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (60 <= h && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (120 <= h && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (180 <= h && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (240 <= h && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (300 <= h && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Generate a color palette from a base color
 */
export function generateColorPalette(baseColor: string): ColorScale {
  const hsl = hexToHSL(baseColor);

  return {
    50: hslToHex(hsl.h, Math.max(hsl.s - 30, 10), 97),
    100: hslToHex(hsl.h, Math.max(hsl.s - 20, 15), 94),
    200: hslToHex(hsl.h, Math.max(hsl.s - 10, 20), 86),
    300: hslToHex(hsl.h, hsl.s, 76),
    400: hslToHex(hsl.h, hsl.s, 64),
    500: baseColor,
    600: hslToHex(hsl.h, Math.min(hsl.s + 5, 100), Math.max(hsl.l - 8, 20)),
    700: hslToHex(hsl.h, Math.min(hsl.s + 10, 100), Math.max(hsl.l - 16, 15)),
    800: hslToHex(hsl.h, Math.min(hsl.s + 15, 100), Math.max(hsl.l - 24, 10)),
    900: hslToHex(hsl.h, Math.min(hsl.s + 20, 100), Math.max(hsl.l - 32, 5)),
  };
}

/**
 * Generate complementary color
 */
export function getComplementaryColor(hex: string): string {
  const hsl = hexToHSL(hex);
  return hslToHex((hsl.h + 180) % 360, hsl.s, hsl.l);
}

/**
 * Generate analogous colors
 */
export function getAnalogousColors(hex: string): [string, string] {
  const hsl = hexToHSL(hex);
  return [
    hslToHex((hsl.h + 30) % 360, hsl.s, hsl.l),
    hslToHex((hsl.h - 30 + 360) % 360, hsl.s, hsl.l),
  ];
}

// ============================================
// DEFAULT TOKENS
// ============================================

export const defaultNeutralScale: NeutralScale = {
  0: '#ffffff',
  50: '#f9fafb',
  100: '#f3f4f6',
  200: '#e5e7eb',
  300: '#d1d5db',
  400: '#9ca3af',
  500: '#6b7280',
  600: '#4b5563',
  700: '#374151',
  800: '#1f2937',
  900: '#111827',
  1000: '#000000',
};

export const defaultPrimaryColor = '#3b82f6'; // Blue-500

export const defaultTokens: DesignTokens = {
  colors: {
    primary: generateColorPalette(defaultPrimaryColor),
    secondary: generateColorPalette('#8b5cf6'), // Violet-500
    accent: generateColorPalette('#f59e0b'), // Amber-500
    semantic: {
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444',
      info: '#3b82f6',
    },
    neutral: defaultNeutralScale,
    background: {
      primary: '#ffffff',
      secondary: '#f9fafb',
      tertiary: '#f3f4f6',
      inverse: '#111827',
    },
    text: {
      primary: '#111827',
      secondary: '#4b5563',
      muted: '#9ca3af',
      inverse: '#ffffff',
    },
    border: {
      light: '#e5e7eb',
      medium: '#d1d5db',
      strong: '#9ca3af',
    },
  },

  typography: {
    fontFamily: {
      heading: 'Inter, system-ui, sans-serif',
      body: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, Consolas, monospace',
    },
    fontSize: {
      xs: { size: '0.75rem', lineHeight: 1.5, letterSpacing: '0.01em' },
      sm: { size: '0.875rem', lineHeight: 1.5, letterSpacing: '0' },
      base: { size: '1rem', lineHeight: 1.6, letterSpacing: '0' },
      lg: { size: '1.125rem', lineHeight: 1.6, letterSpacing: '-0.01em' },
      xl: { size: '1.25rem', lineHeight: 1.5, letterSpacing: '-0.01em' },
      '2xl': { size: '1.5rem', lineHeight: 1.4, letterSpacing: '-0.02em' },
      '3xl': { size: '1.875rem', lineHeight: 1.3, letterSpacing: '-0.02em' },
      '4xl': { size: '2.25rem', lineHeight: 1.2, letterSpacing: '-0.02em' },
      '5xl': { size: '3rem', lineHeight: 1.1, letterSpacing: '-0.03em' },
      '6xl': { size: '3.75rem', lineHeight: 1.1, letterSpacing: '-0.03em' },
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    letterSpacing: {
      tight: '-0.02em',
      normal: '0',
      wide: '0.02em',
    },
  },

  spacing: {
    baseUnit: 4,
    scale: {
      0: '0',
      px: '1px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      16: '4rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
    },
    section: {
      paddingY: '6rem',
      paddingX: '1.5rem',
      gap: '4rem',
    },
    component: {
      paddingSmall: '0.5rem',
      paddingMedium: '1rem',
      paddingLarge: '1.5rem',
      gap: '1rem',
    },
  },

  effects: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.25rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      '3xl': '1.5rem',
      full: '9999px',
    },
    shadow: {
      none: 'none',
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    },
    blur: {
      none: '0',
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    },
    transition: {
      none: 'none',
      fast: '150ms ease',
      normal: '200ms ease',
      slow: '300ms ease',
      slower: '500ms ease',
    },
  },

  layout: {
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    grid: {
      columns: 12,
      gutter: '1.5rem',
      margin: '1.5rem',
    },
    zIndex: {
      base: 0,
      dropdown: 1000,
      sticky: 1100,
      fixed: 1200,
      modal: 1300,
      popover: 1400,
      tooltip: 1500,
    },
  },
};

// ============================================
// TOKEN GENERATORS
// ============================================

export function createCustomTokens(
  primaryColor: string,
  secondaryColor?: string,
  accentColor?: string
): DesignTokens {
  const tokens = { ...defaultTokens };

  tokens.colors = {
    ...tokens.colors,
    primary: generateColorPalette(primaryColor),
    secondary: generateColorPalette(secondaryColor || getComplementaryColor(primaryColor)),
    accent: generateColorPalette(accentColor || getAnalogousColors(primaryColor)[0]),
  };

  return tokens;
}

export { defaultTokens as tokens };
