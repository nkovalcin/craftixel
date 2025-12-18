import { NextRequest, NextResponse } from 'next/server';

interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

function generateColorScale(baseColor: string): ColorScale {
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    // Clamp values to valid ranges
    const clampedH = Math.max(0, Math.min(1, h));
    const clampedS = Math.max(0, Math.min(1, s));
    const clampedL = Math.max(0, Math.min(1, l));

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let rOut, gOut, bOut;
    if (clampedS === 0) {
      rOut = gOut = bOut = clampedL;
    } else {
      const q = clampedL < 0.5 ? clampedL * (1 + clampedS) : clampedL + clampedS - clampedL * clampedS;
      const p = 2 * clampedL - q;
      rOut = hue2rgb(p, q, clampedH + 1 / 3);
      gOut = hue2rgb(p, q, clampedH);
      bOut = hue2rgb(p, q, clampedH - 1 / 3);
    }

    const toHex = (x: number) => {
      const clamped = Math.max(0, Math.min(255, Math.round(x * 255)));
      return clamped.toString(16).padStart(2, '0');
    };
    return `#${toHex(rOut)}${toHex(gOut)}${toHex(bOut)}`.toUpperCase();
  };

  return {
    50: hslToHex(h, s * 0.3, 0.97),
    100: hslToHex(h, s * 0.4, 0.94),
    200: hslToHex(h, s * 0.5, 0.86),
    300: hslToHex(h, s * 0.6, 0.74),
    400: hslToHex(h, s * 0.7, 0.62),
    500: hslToHex(h, s, l),
    600: hslToHex(h, s * 1.1, l * 0.85),
    700: hslToHex(h, s * 1.2, l * 0.7),
    800: hslToHex(h, s * 1.2, l * 0.55),
    900: hslToHex(h, s * 1.1, l * 0.4),
    950: hslToHex(h, s * 1.0, l * 0.25),
  };
}

// Color suggestions based on industry/tone
const colorSuggestions: Record<string, string> = {
  // Business types
  saas: '#3B82F6',
  fintech: '#0EA5E9',
  healthcare: '#14B8A6',
  education: '#8B5CF6',
  ecommerce: '#F59E0B',
  food: '#EF4444',
  travel: '#06B6D4',
  fitness: '#22C55E',
  creative: '#EC4899',
  tech: '#6366F1',

  // Tones
  professional: '#1E40AF',
  friendly: '#F97316',
  bold: '#DC2626',
  minimal: '#18181B',
  playful: '#A855F7',
  elegant: '#78716C',
  modern: '#0891B2',
  trustworthy: '#1D4ED8',
};

export async function POST(request: NextRequest) {
  try {
    const { businessName, businessType, tone } = await request.json();

    // Determine primary color based on business type and tone
    const businessKey = businessType?.toLowerCase().replace(/[^a-z]/g, '') || '';
    const toneKey = tone?.toLowerCase().replace(/[^a-z]/g, '') || '';

    let primaryColor =
      colorSuggestions[businessKey] ||
      colorSuggestions[toneKey] ||
      '#3B82F6';

    // Generate complementary colors
    const primaryHue = getHue(primaryColor);
    const secondaryColor = hueToHex((primaryHue + 30) % 360, 0.7, 0.5);
    const accentColor = hueToHex((primaryHue + 180) % 360, 0.8, 0.55);

    const tokens = {
      colors: {
        primary: generateColorScale(primaryColor),
        secondary: generateColorScale(secondaryColor),
        accent: generateColorScale(accentColor),
        neutral: generateColorScale('#6B7280'),
        success: '#22C55E',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
        background: '#FFFFFF',
        foreground: '#0F172A',
        muted: '#F1F5F9',
        mutedForeground: '#64748B',
        border: '#E2E8F0',
      },
      typography: {
        fontFamily: {
          sans: 'Inter, system-ui, sans-serif',
          serif: 'Georgia, serif',
          mono: 'JetBrains Mono, monospace',
        },
        fontSize: {
          xs: '0.75rem',
          sm: '0.875rem',
          base: '1rem',
          lg: '1.125rem',
          xl: '1.25rem',
          '2xl': '1.5rem',
          '3xl': '1.875rem',
          '4xl': '2.25rem',
          '5xl': '3rem',
          '6xl': '3.75rem',
        },
        fontWeight: {
          normal: 400,
          medium: 500,
          semibold: 600,
          bold: 700,
        },
        lineHeight: {
          tight: 1.25,
          normal: 1.5,
          relaxed: 1.75,
        },
      },
      spacing: {
        base: 4,
        scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
      },
      effects: {
        borderRadius: {
          none: '0',
          sm: '0.125rem',
          md: '0.375rem',
          lg: '0.5rem',
          xl: '0.75rem',
          '2xl': '1rem',
          full: '9999px',
        },
        shadow: {
          sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
          md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
          lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
        },
      },
      layout: {
        container: {
          maxWidth: '1280px',
          padding: '1rem',
        },
        breakpoints: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      },
    };

    return NextResponse.json(tokens);
  } catch (error) {
    console.error('Token generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate tokens' },
      { status: 500 }
    );
  }
}

function getHue(hex: string): number {
  const cleanHex = hex.replace('#', '');
  const r = parseInt(cleanHex.slice(0, 2), 16) / 255;
  const g = parseInt(cleanHex.slice(2, 4), 16) / 255;
  const b = parseInt(cleanHex.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;

  if (max !== min) {
    const d = max - min;
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

  return Math.round(h * 360);
}

function hueToHex(h: number, s: number, l: number): string {
  // Clamp values to valid ranges
  const clampedS = Math.max(0, Math.min(1, s));
  const clampedL = Math.max(0, Math.min(1, l));

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  const hNorm = (h % 360) / 360;
  const q = clampedL < 0.5 ? clampedL * (1 + clampedS) : clampedL + clampedS - clampedL * clampedS;
  const p = 2 * clampedL - q;

  const r = hue2rgb(p, q, hNorm + 1 / 3);
  const g = hue2rgb(p, q, hNorm);
  const b = hue2rgb(p, q, hNorm - 1 / 3);

  const toHex = (x: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(x * 255)));
    return clamped.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}
