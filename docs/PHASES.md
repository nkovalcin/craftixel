# Craftixel Phases (F1-F5)

## Overview

```
F1: STRATEGY    →  Business understanding
F2: CONTENT     →  Text and messaging
F3: TOKENS      →  Visual foundation
F4: COMPONENTS  →  UI building blocks
F5: GENERATE    →  Figma export
```

---

## F1: STRATEGY

### Purpose
Understand the business context to inform all subsequent decisions.

### User Input
```
- What does your business do?
- Who is your target audience?
- What problem do you solve?
- Who are your competitors?
- What makes you different?
- What action should visitors take?
```

### AI Processing
- Analyze business model
- Identify key messaging angles
- Determine appropriate tone
- Suggest content structure
- Recommend layout patterns

### Output
```typescript
interface StrategyOutput {
  businessType: 'saas' | 'ecommerce' | 'agency' | 'portfolio' | 'blog';
  audience: {
    primary: string;
    painPoints: string[];
    desires: string[];
  };
  positioning: {
    uniqueValue: string;
    competitors: string[];
    differentiators: string[];
  };
  tone: {
    voice: 'professional' | 'friendly' | 'bold' | 'minimal' | 'playful';
    keywords: string[];
  };
  suggestedSections: Section[];
}
```

---

## F2: CONTENT

### Purpose
Generate all text content as structured tokens.

### Based on F1 Output
AI generates content for each section identified in strategy.

### Content Token Structure
```typescript
interface ContentTokens {
  brand: {
    name: string;
    tagline: string;
    description: string;
    keywords: string[];
  };

  sections: {
    hero: {
      headline: string;
      subheadline: string;
      cta: {
        primary: string;
        secondary?: string;
      };
    };

    problem: {
      headline: string;
      painPoints: Array<{
        title: string;
        description: string;
        icon?: string;
      }>;
    };

    solution: {
      headline: string;
      description: string;
      features: Array<{
        title: string;
        description: string;
        icon?: string;
      }>;
    };

    socialProof: {
      headline: string;
      testimonials: Array<{
        quote: string;
        author: string;
        role: string;
        company?: string;
      }>;
      logos?: string[];
    };

    pricing?: {
      headline: string;
      subheadline: string;
      tiers: Array<{
        name: string;
        price: string;
        description: string;
        features: string[];
        cta: string;
        highlighted?: boolean;
      }>;
    };

    faq: {
      headline: string;
      items: Array<{
        question: string;
        answer: string;
      }>;
    };

    finalCta: {
      headline: string;
      subheadline: string;
      cta: string;
    };
  };

  microcopy: {
    navigation: Record<string, string>;
    buttons: Record<string, string>;
    forms: {
      labels: Record<string, string>;
      placeholders: Record<string, string>;
      errors: Record<string, string>;
      success: Record<string, string>;
    };
    footer: {
      copyright: string;
      links: Array<{ label: string; href: string }>;
    };
  };
}
```

### User Can Edit
All generated content is editable before proceeding to design phase.

---

## F3: TOKENS

### Purpose
Define the visual foundation based on content needs and brand personality.

### Token Categories

#### Colors
```typescript
interface ColorTokens {
  primary: {
    50: string;   // Lightest
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;  // Base
    600: string;
    700: string;
    800: string;
    900: string;  // Darkest
  };
  secondary: { /* same scale */ };
  accent: { /* same scale */ };

  semantic: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };

  neutral: {
    0: string;    // White
    50: string;
    100: string;
    // ...
    900: string;
    1000: string; // Black
  };

  background: {
    primary: string;
    secondary: string;
    tertiary: string;
    elevated: string;
  };

  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };

  border: {
    light: string;
    medium: string;
    strong: string;
  };
}
```

#### Typography
```typescript
interface TypographyTokens {
  fontFamily: {
    heading: string;
    body: string;
    mono: string;
  };

  fontSize: {
    xs: string;    // 12px
    sm: string;    // 14px
    base: string;  // 16px
    lg: string;    // 18px
    xl: string;    // 20px
    '2xl': string; // 24px
    '3xl': string; // 30px
    '4xl': string; // 36px
    '5xl': string; // 48px
    '6xl': string; // 60px
  };

  fontWeight: {
    regular: number;  // 400
    medium: number;   // 500
    semibold: number; // 600
    bold: number;     // 700
  };

  lineHeight: {
    tight: number;   // 1.25
    normal: number;  // 1.5
    relaxed: number; // 1.75
  };

  letterSpacing: {
    tight: string;
    normal: string;
    wide: string;
  };
}
```

#### Spacing
```typescript
interface SpacingTokens {
  baseUnit: number; // Usually 4 or 8

  scale: {
    0: string;   // 0
    1: string;   // 4px
    2: string;   // 8px
    3: string;   // 12px
    4: string;   // 16px
    5: string;   // 20px
    6: string;   // 24px
    8: string;   // 32px
    10: string;  // 40px
    12: string;  // 48px
    16: string;  // 64px
    20: string;  // 80px
    24: string;  // 96px
  };
}
```

#### Effects
```typescript
interface EffectTokens {
  borderRadius: {
    none: string;
    sm: string;    // 2px
    md: string;    // 4px
    lg: string;    // 8px
    xl: string;    // 12px
    '2xl': string; // 16px
    full: string;  // 9999px
  };

  shadow: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  blur: {
    none: string;
    sm: string;
    md: string;
    lg: string;
  };
}
```

---

## F4: COMPONENTS

### Purpose
Build UI components using tokens, informed by content structure.

### Component Hierarchy

#### Atoms (Primitives)
- Button (variants: primary, secondary, ghost, link)
- Input (text, email, password, textarea)
- Badge
- Icon
- Avatar
- Checkbox, Radio, Toggle
- Tooltip

#### Molecules
- Form Field (label + input + error)
- Card
- Nav Item
- Feature Item
- Testimonial Card
- Pricing Card
- FAQ Item
- Search Bar

#### Organisms
- Header / Navigation
- Hero Section
- Features Grid
- Testimonials Section
- Pricing Table
- FAQ Accordion
- Footer
- Sidebar
- Modal

#### Templates
- Landing Page
- Dashboard Layout
- Blog Layout
- Product Page
- Pricing Page
- Auth Pages (Login, Register)

---

## F5: GENERATE

### Purpose
Export everything to Figma as production-ready design system.

### Output Structure in Figma

```
📁 [Project Name] Design System
├── 📄 Cover
├── 📁 Foundations
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   ├── Effects
│   └── Icons
├── 📁 Components
│   ├── Atoms
│   ├── Molecules
│   └── Organisms
├── 📁 Templates
│   ├── Desktop
│   ├── Tablet
│   └── Mobile
└── 📁 Pages
    ├── Home
    ├── About
    ├── Pricing
    └── ...
```

### Figma Features Used
- **Variables** for all tokens
- **Auto Layout** for all components
- **Component Variants** for states
- **Proper naming** conventions
- **Layer organization**
- **Exportable assets**

### Export Options
- Full design system
- Components only
- Single page/template
- Tokens as CSS/JSON

---

## Phase Dependencies

```
F1 ──→ F2 ──→ F3 ──→ F4 ──→ F5
│      │      │      │      │
│      │      │      │      └── Figma export
│      │      │      └── Uses tokens from F3
│      │      └── Influenced by content length/structure
│      └── Based on strategy decisions
└── Foundation for everything
```

Each phase informs the next. Changes can propagate forward.
