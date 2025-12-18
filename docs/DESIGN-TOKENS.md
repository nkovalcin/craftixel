# Craftixel Design Tokens

## Token Philosophy

**Tokens are the DNA of your design system.**

Every visual decision is a token:
- Never hardcode `#1F6CF1` - use `colors.primary.500`
- Never hardcode `16px` - use `spacing.4`
- Never hardcode `600` - use `fontWeight.semibold`

This enables:
1. **Consistency** - Same values everywhere
2. **Theming** - Change once, update everywhere
3. **Export** - Same tokens to Figma, CSS, React

---

## Token Categories

### Colors

#### Semantic Color System
```typescript
const colors = {
  // Brand colors with full scale
  primary: {
    50:  '#eff6ff',  // Backgrounds, hover states
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',  // Base - buttons, links
    600: '#2563eb',  // Hover state
    700: '#1d4ed8',  // Active state
    800: '#1e40af',
    900: '#1e3a8a',  // Dark text on light bg
  },

  // Secondary, accent follow same pattern...

  // Semantic colors (fixed, not scaled)
  semantic: {
    success: '#10b981',
    warning: '#f59e0b',
    error:   '#ef4444',
    info:    '#3b82f6',
  },

  // Neutrals for text, backgrounds, borders
  neutral: {
    0:    '#ffffff',
    50:   '#f9fafb',
    100:  '#f3f4f6',
    200:  '#e5e7eb',
    300:  '#d1d5db',
    400:  '#9ca3af',
    500:  '#6b7280',
    600:  '#4b5563',
    700:  '#374151',
    800:  '#1f2937',
    900:  '#111827',
    1000: '#000000',
  },

  // Contextual aliases
  background: {
    primary:   'neutral.0',     // Main bg
    secondary: 'neutral.50',    // Subtle bg
    tertiary:  'neutral.100',   // Cards, sections
    inverse:   'neutral.900',   // Dark sections
  },

  text: {
    primary:   'neutral.900',   // Main text
    secondary: 'neutral.600',   // Supporting text
    muted:     'neutral.400',   // Disabled, hints
    inverse:   'neutral.0',     // On dark bg
  },

  border: {
    light:  'neutral.200',
    medium: 'neutral.300',
    strong: 'neutral.400',
  },
};
```

#### Dark Mode Mapping
```typescript
const darkMode = {
  background: {
    primary:   'neutral.900',
    secondary: 'neutral.800',
    tertiary:  'neutral.700',
  },
  text: {
    primary:   'neutral.50',
    secondary: 'neutral.300',
    muted:     'neutral.500',
  },
  border: {
    light:  'neutral.700',
    medium: 'neutral.600',
    strong: 'neutral.500',
  },
};
```

---

### Typography

```typescript
const typography = {
  // Font families
  fontFamily: {
    heading: 'Inter, system-ui, sans-serif',
    body:    'Inter, system-ui, sans-serif',
    mono:    'JetBrains Mono, Consolas, monospace',
  },

  // Font sizes (with line-height and letter-spacing)
  fontSize: {
    xs:   { size: '0.75rem',  lineHeight: 1.5,  letterSpacing: '0.01em' },   // 12px
    sm:   { size: '0.875rem', lineHeight: 1.5,  letterSpacing: '0' },        // 14px
    base: { size: '1rem',     lineHeight: 1.6,  letterSpacing: '0' },        // 16px
    lg:   { size: '1.125rem', lineHeight: 1.6,  letterSpacing: '-0.01em' },  // 18px
    xl:   { size: '1.25rem',  lineHeight: 1.5,  letterSpacing: '-0.01em' },  // 20px
    '2xl': { size: '1.5rem',   lineHeight: 1.4,  letterSpacing: '-0.02em' }, // 24px
    '3xl': { size: '1.875rem', lineHeight: 1.3,  letterSpacing: '-0.02em' }, // 30px
    '4xl': { size: '2.25rem',  lineHeight: 1.2,  letterSpacing: '-0.02em' }, // 36px
    '5xl': { size: '3rem',     lineHeight: 1.1,  letterSpacing: '-0.03em' }, // 48px
    '6xl': { size: '3.75rem',  lineHeight: 1.1,  letterSpacing: '-0.03em' }, // 60px
  },

  // Font weights
  fontWeight: {
    regular:  400,
    medium:   500,
    semibold: 600,
    bold:     700,
  },

  // Predefined text styles
  textStyles: {
    h1: { family: 'heading', size: '5xl', weight: 'bold' },
    h2: { family: 'heading', size: '4xl', weight: 'bold' },
    h3: { family: 'heading', size: '3xl', weight: 'semibold' },
    h4: { family: 'heading', size: '2xl', weight: 'semibold' },
    h5: { family: 'heading', size: 'xl',  weight: 'semibold' },
    h6: { family: 'heading', size: 'lg',  weight: 'semibold' },

    bodyLarge:  { family: 'body', size: 'lg',   weight: 'regular' },
    body:       { family: 'body', size: 'base', weight: 'regular' },
    bodySmall:  { family: 'body', size: 'sm',   weight: 'regular' },

    label:      { family: 'body', size: 'sm',   weight: 'medium' },
    caption:    { family: 'body', size: 'xs',   weight: 'regular' },

    code:       { family: 'mono', size: 'sm',   weight: 'regular' },
  },
};
```

---

### Spacing

```typescript
const spacing = {
  // Base unit: 4px
  baseUnit: 4,

  // Spacing scale
  scale: {
    0:   '0',
    px:  '1px',
    0.5: '0.125rem',  // 2px
    1:   '0.25rem',   // 4px
    1.5: '0.375rem',  // 6px
    2:   '0.5rem',    // 8px
    2.5: '0.625rem',  // 10px
    3:   '0.75rem',   // 12px
    3.5: '0.875rem',  // 14px
    4:   '1rem',      // 16px
    5:   '1.25rem',   // 20px
    6:   '1.5rem',    // 24px
    7:   '1.75rem',   // 28px
    8:   '2rem',      // 32px
    9:   '2.25rem',   // 36px
    10:  '2.5rem',    // 40px
    11:  '2.75rem',   // 44px
    12:  '3rem',      // 48px
    14:  '3.5rem',    // 56px
    16:  '4rem',      // 64px
    20:  '5rem',      // 80px
    24:  '6rem',      // 96px
    28:  '7rem',      // 112px
    32:  '8rem',      // 128px
  },

  // Semantic spacing
  section: {
    paddingY: 'scale.24',     // 96px - vertical section padding
    paddingX: 'scale.6',      // 24px - horizontal container padding
    gap:      'scale.16',     // 64px - between sections
  },

  component: {
    paddingSmall:  'scale.2',  // 8px
    paddingMedium: 'scale.4',  // 16px
    paddingLarge:  'scale.6',  // 24px
    gap:           'scale.4',  // 16px
  },
};
```

---

### Effects

```typescript
const effects = {
  // Border radius
  borderRadius: {
    none: '0',
    sm:   '0.125rem',  // 2px
    md:   '0.25rem',   // 4px
    lg:   '0.5rem',    // 8px
    xl:   '0.75rem',   // 12px
    '2xl': '1rem',     // 16px
    '3xl': '1.5rem',   // 24px
    full: '9999px',    // Pill shape
  },

  // Box shadows
  shadow: {
    none: 'none',
    sm:   '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md:   '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg:   '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl:   '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  // Blur
  blur: {
    none: '0',
    sm:   '4px',
    md:   '8px',
    lg:   '16px',
    xl:   '24px',
  },

  // Transitions
  transition: {
    none:    'none',
    fast:    '150ms ease',
    normal:  '200ms ease',
    slow:    '300ms ease',
    slower:  '500ms ease',
  },
};
```

---

### Layout

```typescript
const layout = {
  // Container widths
  container: {
    sm:   '640px',
    md:   '768px',
    lg:   '1024px',
    xl:   '1280px',
    '2xl': '1536px',
  },

  // Breakpoints
  breakpoints: {
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl': '1536px',
  },

  // Grid
  grid: {
    columns: 12,
    gutter:  'spacing.6',
    margin:  'spacing.6',
  },

  // Z-index layers
  zIndex: {
    base:     0,
    dropdown: 1000,
    sticky:   1100,
    fixed:    1200,
    modal:    1300,
    popover:  1400,
    tooltip:  1500,
  },
};
```

---

## Token Usage Examples

### Component Example
```typescript
const Button = {
  base: {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize:   tokens.typography.fontSize.sm.size,
    fontWeight: tokens.typography.fontWeight.semibold,
    padding:    `${tokens.spacing.scale[2.5]} ${tokens.spacing.scale[4]}`,
    borderRadius: tokens.effects.borderRadius.lg,
    transition: tokens.effects.transition.fast,
  },

  variants: {
    primary: {
      background: tokens.colors.primary[500],
      color:      tokens.colors.neutral[0],
      hover: {
        background: tokens.colors.primary[600],
      },
    },
    secondary: {
      background: tokens.colors.neutral[100],
      color:      tokens.colors.neutral[900],
      hover: {
        background: tokens.colors.neutral[200],
      },
    },
  },
};
```

---

## Figma Variables Mapping

Tokens export directly to Figma Variables:

```
Figma Collection: "Craftixel Tokens"
├── Colors
│   ├── primary/50 → #eff6ff
│   ├── primary/500 → #3b82f6
│   └── ...
├── Typography
│   ├── fontSize/base → 16
│   ├── fontWeight/semibold → 600
│   └── ...
├── Spacing
│   ├── 1 → 4
│   ├── 2 → 8
│   └── ...
└── Effects
    ├── borderRadius/lg → 8
    └── ...
```

Components reference variables, not raw values.
