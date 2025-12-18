// ============================================
// CRAFTIXEL FIGMA PLUGIN - Types
// Duplicated from @craftixel/types for plugin bundle
// ============================================

// ============================================
// CONTENT TYPES
// ============================================

export type ToneOfVoice = 'professional' | 'friendly' | 'bold' | 'playful' | 'minimal';

export type SectionType =
  | 'hero'
  | 'problem'
  | 'solution'
  | 'features'
  | 'howItWorks'
  | 'benefits'
  | 'testimonials'
  | 'pricing'
  | 'faq'
  | 'team'
  | 'contact'
  | 'cta'
  | 'custom';

export interface ContentTokens {
  brand: BrandContent;
  sections: SectionContent[];
  microcopy: MicrocopyContent;
}

export interface BrandContent {
  name: string;
  tagline: string;
  description: string;
  tone: ToneOfVoice;
  personality: string[];
  valueProposition: string;
  keywords: {
    use: string[];
    avoid: string[];
  };
}

export interface SectionContent {
  id: string;
  type: SectionType;
  enabled: boolean;
  order: number;
  headline: string;
  subheadline?: string;
  body?: string;
  cta?: CTAContent;
  items?: ContentItem[];
}

export interface CTAContent {
  primary: string;
  secondary?: string;
  href?: string;
}

export interface ContentItem {
  id: string;
  title: string;
  description: string;
  icon?: string;
  image?: string;
}

export interface MicrocopyContent {
  nav: {
    home: string;
    features: string;
    pricing: string;
    about: string;
    contact: string;
    login: string;
    signup: string;
  };
  buttons: {
    submit: string;
    cancel: string;
    save: string;
    delete: string;
    continue: string;
    back: string;
    learnMore: string;
    getStarted: string;
    tryFree: string;
    contactUs: string;
  };
  forms: {
    labels: Record<string, string>;
    placeholders: Record<string, string>;
    hints: Record<string, string>;
    errors: {
      required: string;
      invalidEmail: string;
      tooShort: string;
      tooLong: string;
      mismatch: string;
    };
    success: {
      saved: string;
      sent: string;
      subscribed: string;
    };
  };
  states: {
    loading: string;
    empty: string;
    error: string;
    success: string;
  };
  meta: {
    copyright: string;
    madeWith: string;
  };
}

// ============================================
// DESIGN TOKENS
// ============================================

export interface DesignTokens {
  colors: ColorTokens;
  typography: TypographyTokens;
  spacing: SpacingTokens;
  effects: EffectTokens;
  layout: LayoutTokens;
}

export interface ColorTokens {
  primary: ColorScale;
  secondary: ColorScale;
  accent: ColorScale;
  semantic: SemanticColors;
  neutral: NeutralScale;
  background: BackgroundColors;
  text: TextColors;
  border: BorderColors;
}

export interface ColorScale {
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
}

export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface NeutralScale {
  0: string;
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
  1000: string;
}

export interface BackgroundColors {
  primary: string;
  secondary: string;
  tertiary: string;
  inverse: string;
}

export interface TextColors {
  primary: string;
  secondary: string;
  muted: string;
  inverse: string;
}

export interface BorderColors {
  light: string;
  medium: string;
  strong: string;
}

export interface TypographyTokens {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };
  fontSize: FontSizeScale;
  fontWeight: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}

export interface FontSizeScale {
  xs: FontSizeValue;
  sm: FontSizeValue;
  base: FontSizeValue;
  lg: FontSizeValue;
  xl: FontSizeValue;
  '2xl': FontSizeValue;
  '3xl': FontSizeValue;
  '4xl': FontSizeValue;
  '5xl': FontSizeValue;
  '6xl': FontSizeValue;
}

export interface FontSizeValue {
  size: string;
  lineHeight: number;
  letterSpacing: string;
}

export interface SpacingTokens {
  baseUnit: number;
  scale: SpacingScale;
  section: {
    paddingY: string;
    paddingX: string;
    gap: string;
  };
  component: {
    paddingSmall: string;
    paddingMedium: string;
    paddingLarge: string;
    gap: string;
  };
}

export interface SpacingScale {
  0: string;
  px: string;
  0.5: string;
  1: string;
  1.5: string;
  2: string;
  2.5: string;
  3: string;
  3.5: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
  9: string;
  10: string;
  11: string;
  12: string;
  14: string;
  16: string;
  20: string;
  24: string;
  28: string;
  32: string;
}

export interface EffectTokens {
  borderRadius: BorderRadiusScale;
  shadow: ShadowScale;
  blur: BlurScale;
  transition: TransitionScale;
}

export interface BorderRadiusScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  full: string;
}

export interface ShadowScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  inner: string;
}

export interface BlurScale {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface TransitionScale {
  none: string;
  fast: string;
  normal: string;
  slow: string;
  slower: string;
}

export interface LayoutTokens {
  container: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  breakpoints: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  grid: {
    columns: number;
    gutter: string;
    margin: string;
  };
  zIndex: {
    base: number;
    dropdown: number;
    sticky: number;
    fixed: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}

// ============================================
// FIGMA EXPORT
// ============================================

export interface FigmaExport {
  version: string;
  project: {
    name: string;
    id: string;
  };
  content: ContentTokens;
  tokens: DesignTokens;
  generateOptions: {
    variables: boolean;
    components: boolean;
    pages: boolean;
  };
}
