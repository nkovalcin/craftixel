# CRAFTIXEL MVP - IMPLEMENTAČNÝ PLÁN

## Prehľad

**Cieľ:** Production-ready, pixel-perfect, no bugs MVP
**Rozsah:** F1-F5 kompletný flow (Business idea → Figma export)
**Filozofia:** Content-First, Token-Based, Craft Don't Code

---

## FÁZA 0: FOUNDATION (Deň 1-2)

### 0.1 Project Setup

```
craftixel/
├── apps/
│   ├── web/                    # Next.js 14 app
│   └── figma-plugin/           # Figma plugin
├── packages/
│   ├── tokens/                 # Shared token definitions
│   ├── types/                  # Shared TypeScript types
│   └── utils/                  # Shared utilities
└── turbo.json                  # Monorepo config
```

**Technológie:**
- Next.js 14 (App Router)
- TypeScript (strict mode)
- Tailwind CSS + shadcn/ui
- Zustand (state management)
- Turborepo (monorepo)

### 0.2 Shared Types (packages/types)

```typescript
// Core interfaces that all apps share
export interface Project {
  id: string;
  name: string;
  createdAt: Date;
  strategy: StrategyOutput | null;
  content: ContentTokens | null;
  tokens: DesignTokens | null;
  currentPhase: 'F1' | 'F2' | 'F3' | 'F4' | 'F5';
}

export interface StrategyOutput { ... }
export interface ContentTokens { ... }
export interface DesignTokens { ... }
```

### 0.3 Deliverables
- [ ] Monorepo initialized (Turborepo)
- [ ] Next.js app scaffolded
- [ ] Tailwind + shadcn/ui configured
- [ ] TypeScript strict mode enabled
- [ ] Shared packages created
- [ ] Git repository initialized

---

## FÁZA 1: LANDING PAGE (Deň 3-4)

### 1.1 Sekcie

1. **Hero**
   - Headline: "From idea to pixel-perfect UI"
   - Subheadline: AI-powered design system generator
   - CTA: "Start Building" + "See How It Works"
   - Visual: Animated flow diagram

2. **Problem**
   - 3 pain points (time, inconsistency, disconnection)
   - Icons + short descriptions

3. **Solution (5 Phases)**
   - F1-F5 visual flow
   - Interactive step-by-step preview

4. **Features**
   - Content-First Approach
   - Token-Based Design
   - Figma-Native Output
   - Custom Frameworks

5. **How It Works**
   - 3-step process visualization
   - "Tell us about your business"
   - "Customize your design system"
   - "Export to Figma"

6. **Waitlist CTA**
   - Email capture form
   - "Get Early Access"
   - Social proof counter

7. **Footer**
   - Links, copyright, social

### 1.2 Komponenty

```
components/
├── landing/
│   ├── Hero.tsx
│   ├── ProblemSection.tsx
│   ├── SolutionFlow.tsx
│   ├── FeaturesGrid.tsx
│   ├── HowItWorks.tsx
│   ├── WaitlistForm.tsx
│   └── Footer.tsx
```

### 1.3 Deliverables
- [ ] Landing page kompletná
- [ ] Responsive (desktop first, mobile ready)
- [ ] Waitlist form funkčný (localStorage)
- [ ] Animácie a micro-interactions
- [ ] SEO meta tags

---

## FÁZA 2: APP SHELL + STATE (Deň 5-6)

### 2.1 App Layout

```
/app                    # Landing
/app/create            # Main app
/app/create/strategy   # F1
/app/create/content    # F2
/app/create/tokens     # F3
/app/create/preview    # F4
/app/create/export     # F5
```

### 2.2 Navigation

- Phase indicator (F1 → F2 → F3 → F4 → F5)
- Progress tracking
- Back/Next navigation
- Save state automatically

### 2.3 Zustand Store

```typescript
interface ProjectStore {
  // State
  project: Project | null;
  currentPhase: Phase;
  isLoading: boolean;
  error: string | null;

  // Actions
  createProject: (name: string) => void;
  updateStrategy: (strategy: StrategyOutput) => void;
  updateContent: (content: ContentTokens) => void;
  updateTokens: (tokens: DesignTokens) => void;
  setPhase: (phase: Phase) => void;
  exportProject: () => ProjectExport;

  // Persistence
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
```

### 2.4 Deliverables
- [ ] App shell s navigation
- [ ] Phase indicator component
- [ ] Zustand store s persistence
- [ ] Loading/Error states
- [ ] Auto-save functionality

---

## FÁZA 3: F1 - STRATEGY (Deň 7-9)

### 3.1 Business Questionnaire

**10 otázok v 3 krokoch:**

**Step 1: Business Basics**
1. Čo robí tvoj biznis? (1 veta)
2. Kto je tvoj ideálny zákazník?
3. Aký problém riešiš?

**Step 2: Competitive Position**
4. Ako riešiš tento problém?
5. Čo sa stane ak to nevyriešia?
6. Kto sú tvoji konkurenti?
7. Prečo by si mali vybrať teba?

**Step 3: Goals & Tone**
8. Čo unikátne vieš ponúknuť?
9. Aká je hlavná akcia ktorú chceš od návštevníkov?
10. Aký tone of voice preferuješ?
    - [ ] Professional
    - [ ] Friendly
    - [ ] Bold
    - [ ] Playful
    - [ ] Minimal

### 3.2 Multi-step Form UI

```typescript
interface QuestionnaireStep {
  title: string;
  description: string;
  questions: Question[];
}

interface Question {
  id: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect';
  label: string;
  placeholder: string;
  required: boolean;
  validation?: ZodSchema;
}
```

### 3.3 AI Processing

**Claude API Call:**
```typescript
// POST /api/analyze-strategy
const systemPrompt = `
You are a business strategist and UX expert.
Analyze the business information and determine:
1. Business type (saas, ecommerce, agency, portfolio, blog)
2. Target audience pain points and desires
3. Competitive positioning
4. Recommended tone of voice
5. Suggested page sections for their website
`;

const response = await claude.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 2000,
  system: systemPrompt,
  messages: [{ role: 'user', content: JSON.stringify(answers) }]
});
```

### 3.4 Output Display

- Business type badge
- Audience profile card
- Positioning summary
- Recommended sections (checkboxes to enable/disable)
- "Generate Content" CTA

### 3.5 Deliverables
- [ ] Multi-step form s validáciou
- [ ] Progress indicator
- [ ] Claude API integration
- [ ] Strategy output display
- [ ] Section selector
- [ ] Error handling

---

## FÁZA 4: F2 - CONTENT (Deň 10-12)

### 4.1 Content Generation

**Claude API Call:**
```typescript
// POST /api/generate-content
const systemPrompt = `
You are a conversion-focused copywriter.
Based on the strategy, generate content tokens for each section.
For each section provide:
- headline (5-10 words, benefit-focused)
- subheadline (1 sentence)
- body (2-3 sentences if needed)
- cta (2-4 words, action-oriented)
- items (for features, testimonials, etc.)

Return as structured JSON matching ContentTokens interface.
`;
```

### 4.2 Content Editor UI

```
┌─────────────────────────────────────────┐
│ HERO SECTION                       [AI] │
├─────────────────────────────────────────┤
│ Headline:                               │
│ ┌─────────────────────────────────────┐ │
│ │ Build faster, launch sooner         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Subheadline:                            │
│ ┌─────────────────────────────────────┐ │
│ │ The AI-powered design system...     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ CTA: [Get Started] [See Examples]       │
│                                         │
│ [Regenerate Section] [Accept]           │
└─────────────────────────────────────────┘
```

### 4.3 Features

- Inline editing (contenteditable)
- Section-by-section regeneration
- Drag & drop section reordering
- Add/Remove sections
- Character count indicators
- Tone consistency check

### 4.4 Deliverables
- [ ] Content generation API
- [ ] Section-based editor
- [ ] Inline editing
- [ ] Regenerate functionality
- [ ] Section management (add/remove/reorder)
- [ ] Content validation

---

## FÁZA 5: F3 - TOKENS (Deň 13-16)

### 5.1 Color System Editor

**Primary Color Picker:**
- Color wheel / hex input
- AI suggestion based on industry
- Automatic palette generation (50-900 scale)

**Palette Generation Algorithm:**
```typescript
function generatePalette(baseColor: string): ColorScale {
  // Use HSL manipulation
  const hsl = hexToHSL(baseColor);
  return {
    50:  adjustLightness(hsl, 95),   // Almost white
    100: adjustLightness(hsl, 90),
    200: adjustLightness(hsl, 80),
    300: adjustLightness(hsl, 70),
    400: adjustLightness(hsl, 60),
    500: baseColor,                   // Base
    600: adjustLightness(hsl, 45),
    700: adjustLightness(hsl, 35),
    800: adjustLightness(hsl, 25),
    900: adjustLightness(hsl, 15),   // Almost black
  };
}
```

**Secondary & Accent:**
- Complementary color suggestions
- Analogous color suggestions
- Custom selection

### 5.2 Typography Editor

**Font Selection:**
- Google Fonts integration
- Heading font picker
- Body font picker
- Preview text

**Scale Configuration:**
- Base size slider (14-18px)
- Scale ratio selector (1.125, 1.2, 1.25, 1.333, 1.5)
- Auto-calculate all sizes

### 5.3 Spacing Editor

**Base Unit:**
- 4px or 8px selection
- Visual scale preview
- Component padding presets

### 5.4 Effects Editor

**Border Radius:**
- None to Full slider
- Preset buttons (sharp, rounded, pill)

**Shadows:**
- Elevation levels (none, sm, md, lg, xl)
- Visual preview

### 5.5 Live Preview

**Preview Panel:**
- Sample button
- Sample card
- Sample input
- Sample section

All update in real-time as tokens change.

### 5.6 Deliverables
- [ ] Color picker + palette generator
- [ ] Typography editor
- [ ] Spacing editor
- [ ] Effects editor
- [ ] Live preview component
- [ ] Token export (JSON)

---

## FÁZA 6: F4 - PREVIEW (Deň 17-18)

### 6.1 Component Preview

**Atomic Components:**
- Button (primary, secondary, ghost)
- Input (text, with label, with error)
- Badge
- Avatar

**Molecules:**
- Card
- Form field
- Nav item
- Feature item

**Organisms:**
- Header
- Hero section
- Features grid
- Footer

### 6.2 Page Preview

**Full Landing Page Preview:**
- Desktop view (1440px)
- All sections rendered
- Content + Tokens applied
- Interactive (hover states)

### 6.3 Deliverables
- [ ] Component gallery
- [ ] Full page preview
- [ ] Responsive toggle (desktop/mobile)
- [ ] Token application visualization

---

## FÁZA 7: F5 - FIGMA EXPORT (Deň 19-22)

### 7.1 Plugin Architecture

```
figma-plugin/
├── src/
│   ├── code.ts              # Main plugin entry
│   ├── ui.html              # Plugin UI
│   ├── generators/
│   │   ├── variables.ts     # Figma Variables
│   │   ├── atoms.ts         # Button, Input, Badge
│   │   ├── molecules.ts     # Card, NavItem
│   │   ├── organisms.ts     # Header, Footer, Sections
│   │   └── pages.ts         # Full page templates
│   ├── utils/
│   │   ├── colors.ts        # Color conversion
│   │   ├── typography.ts    # Font loading
│   │   └── layout.ts        # Auto-layout helpers
│   └── types/
│       └── index.ts
├── manifest.json
└── package.json
```

### 7.2 Variable Generation

```typescript
async function createVariables(tokens: DesignTokens) {
  // Colors collection
  const colors = figma.variables.createVariableCollection('Colors');

  // Primary palette
  for (const [shade, value] of Object.entries(tokens.colors.primary)) {
    const variable = figma.variables.createVariable(
      `primary/${shade}`,
      colors,
      'COLOR'
    );
    variable.setValueForMode(colors.defaultModeId, hexToRgba(value));
  }

  // Repeat for: secondary, accent, semantic, neutral

  // Spacing collection
  const spacing = figma.variables.createVariableCollection('Spacing');
  // ... spacing variables

  // Typography collection
  const typography = figma.variables.createVariableCollection('Typography');
  // ... typography variables
}
```

### 7.3 Component Generation

**Button Component:**
```typescript
async function createButton(): Promise<ComponentSetNode> {
  const componentSet = figma.combineAsVariants([
    await createButtonVariant('primary', 'md'),
    await createButtonVariant('primary', 'sm'),
    await createButtonVariant('primary', 'lg'),
    await createButtonVariant('secondary', 'md'),
    await createButtonVariant('secondary', 'sm'),
    await createButtonVariant('secondary', 'lg'),
    await createButtonVariant('ghost', 'md'),
    await createButtonVariant('ghost', 'sm'),
    await createButtonVariant('ghost', 'lg'),
  ], figma.currentPage);

  componentSet.name = 'Button';
  return componentSet;
}
```

### 7.4 Page Generation

```typescript
async function createLandingPage(
  content: ContentTokens,
  tokens: DesignTokens
): Promise<FrameNode> {
  const page = figma.createFrame();
  page.name = 'Landing Page';
  page.resize(1440, 900);
  page.layoutMode = 'VERTICAL';
  page.primaryAxisSizingMode = 'AUTO';

  // Header
  const header = await createHeader(content.microcopy.nav);
  page.appendChild(header);

  // Hero
  const hero = await createHeroSection(content.sections.hero);
  page.appendChild(hero);

  // Features
  if (content.sections.features) {
    const features = await createFeaturesSection(content.sections.features);
    page.appendChild(features);
  }

  // ... other sections

  // Footer
  const footer = await createFooter(content.microcopy);
  page.appendChild(footer);

  return page;
}
```

### 7.5 Export Flow

**Web App → Plugin:**
1. User clicks "Export to Figma"
2. Web app generates JSON export
3. User copies JSON or downloads file
4. User opens Figma plugin
5. Plugin imports JSON
6. Plugin generates everything

**Plugin UI:**
```html
<div class="plugin-ui">
  <h2>Craftixel Generator</h2>

  <div class="import-section">
    <textarea placeholder="Paste JSON here..."></textarea>
    <button id="import">Import Project</button>
  </div>

  <div class="generate-section">
    <h3>Generate</h3>
    <label><input type="checkbox" checked> Variables</label>
    <label><input type="checkbox" checked> Components</label>
    <label><input type="checkbox" checked> Pages</label>
    <button id="generate">Generate All</button>
  </div>

  <div class="status"></div>
</div>
```

### 7.6 Deliverables
- [ ] Plugin manifest + setup
- [ ] Variable generation
- [ ] Atom components (Button, Input, Badge)
- [ ] Molecule components (Card, FormField)
- [ ] Organism components (Header, Footer)
- [ ] Section generators
- [ ] Full page generator
- [ ] JSON import functionality
- [ ] Progress indicators

---

## FÁZA 8: POLISH & TESTING (Deň 23-25)

### 8.1 End-to-End Testing

**Test Flow:**
1. Create new project
2. Fill out questionnaire (F1)
3. Generate content (F2)
4. Customize tokens (F3)
5. Preview components (F4)
6. Export JSON
7. Import to Figma plugin
8. Generate design system

**Checklist:**
- [ ] All phases complete without errors
- [ ] State persists across sessions
- [ ] Content generates correctly
- [ ] Tokens apply properly
- [ ] Figma output is pixel-perfect
- [ ] All components use variables

### 8.2 Bug Fixes

- Edge cases handling
- Error states
- Loading states
- Empty states

### 8.3 Performance

- API response caching
- Image optimization
- Code splitting
- Bundle size optimization

### 8.4 Deliverables
- [ ] E2E test suite (manual)
- [ ] All bugs fixed
- [ ] Performance optimized
- [ ] Error handling complete

---

## FÁZA 9: DEPLOYMENT (Deň 26-27)

### 9.1 Vercel Setup

```bash
# Deploy to Vercel
vercel --prod

# Environment variables
ANTHROPIC_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=https://craftixel.io
```

### 9.2 Domain Setup

- craftixel.io → Vercel
- SSL certificate (automatic)

### 9.3 Analytics

- Plausible or Posthog
- Track:
  - Page views
  - Feature usage
  - Export events
  - Error rates

### 9.4 Error Tracking

- Sentry setup
- Source maps uploaded
- Alert thresholds

### 9.5 Deliverables
- [ ] Production deployment
- [ ] Domain configured
- [ ] Analytics tracking
- [ ] Error monitoring

---

## FÁZA 10: LAUNCH (Deň 28)

### 10.1 Launch Checklist

- [ ] Landing page live
- [ ] App fully functional
- [ ] Figma plugin tested
- [ ] Documentation ready
- [ ] Social assets created

### 10.2 Launch Strategy

1. **Product Hunt**
   - Schedule launch
   - Prepare assets
   - Teaser posts

2. **Twitter/X**
   - Thread announcing launch
   - Demo video/GIF
   - Behind the scenes

3. **Communities**
   - r/webdev
   - r/design
   - Indie Hackers
   - Figma Community

### 10.3 Deliverables
- [ ] Product Hunt live
- [ ] Social posts scheduled
- [ ] Community posts ready

---

## SÚHRN DELIVERABLES

### Týždeň 1 (Deň 1-7)
- [F0] Project setup + monorepo
- [F1] Landing page
- [F2] App shell + navigation
- [F3] Strategy questionnaire (partial)

### Týždeň 2 (Deň 8-14)
- [F3] Strategy questionnaire + API
- [F4] Content generation + editor
- [F5] Token editor (colors)

### Týždeň 3 (Deň 15-21)
- [F5] Token editor (typography, spacing, effects)
- [F6] Preview components
- [F7] Figma plugin (variables + atoms)

### Týždeň 4 (Deň 22-28)
- [F7] Figma plugin (molecules, organisms, pages)
- [F8] Testing + polish
- [F9] Deployment
- [F10] Launch

---

## KRITICKÉ CESTY

### Path 1: Content Flow
```
Questionnaire → Claude API → Content Tokens → Editor → Export
```

### Path 2: Token Flow
```
Color Picker → Palette Gen → Preview → Variables → Figma
```

### Path 3: Generation Flow
```
JSON Export → Plugin Import → Variables → Components → Pages
```

---

## RISK MITIGATION

| Risk | Mitigation |
|------|------------|
| Claude API limits | Implement caching, rate limiting |
| Figma API complexity | Start simple, iterate |
| Scope creep | Strict MVP feature list |
| Token sync issues | Rigorous type checking |
| Plugin bugs | Extensive manual testing |

---

*Plan created: December 2024*
*Target: Production-ready MVP in 28 days*
