# Craftixel Content System

## Philosophy

**Content-First Design:** The words you say determine how your design should look.

- Long headlines need more space
- Many features need grid layouts
- Short punchy copy allows for bold typography
- Testimonials inform social proof sections

Design serves content, not the other way around.

---

## Content Token Architecture

### Brand Layer
Core messaging that defines who you are.

```typescript
interface BrandContent {
  // Identity
  name: string;
  tagline: string;          // 5-10 words max
  description: string;      // 1-2 sentences

  // Voice
  tone: 'professional' | 'friendly' | 'bold' | 'playful' | 'minimal';
  personality: string[];    // ["innovative", "trustworthy", "approachable"]

  // Messaging
  valueProposition: string;
  uniqueSellingPoints: string[];

  // Keywords (for AI to maintain consistency)
  keywords: {
    use: string[];          // Words to use often
    avoid: string[];        // Words to never use
  };
}
```

### Section Layer
Content for each section of your site/app.

```typescript
interface SectionContent {
  id: string;
  type: SectionType;
  headline: string;
  subheadline?: string;
  body?: string;
  items?: ContentItem[];
  cta?: CTAContent;
  media?: MediaContent;
}

type SectionType =
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
```

### Microcopy Layer
Small but crucial text elements.

```typescript
interface MicrocopyContent {
  // Navigation
  nav: {
    home: string;
    features: string;
    pricing: string;
    about: string;
    contact: string;
    login: string;
    signup: string;
  };

  // Buttons
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

  // Forms
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

  // States
  states: {
    loading: string;
    empty: string;
    error: string;
    success: string;
  };

  // Meta
  meta: {
    copyright: string;
    madeWith: string;
    allRightsReserved: string;
  };
}
```

---

## AI Content Generation

### Strategy Questions (F1)

**Business Understanding:**
1. In one sentence, what does your business do?
2. Who is your ideal customer? (Be specific)
3. What problem do they have before finding you?
4. How do you solve that problem?
5. What happens if they don't solve this problem?

**Competitive Position:**
6. Who are your main competitors?
7. Why should someone choose you over them?
8. What can you do that no one else can?

**Goals:**
9. What's the #1 action you want visitors to take?
10. What objections might stop them?

### AI Processing

From answers, AI determines:
- **Tone:** Based on audience and industry
- **Structure:** Which sections are needed
- **Length:** How much content per section
- **Emphasis:** What to highlight

### Content Generation Prompt Template

```
You are a conversion-focused copywriter creating content for {business_type}.

CONTEXT:
- Business: {business_description}
- Audience: {target_audience}
- Problem: {problem_solved}
- Solution: {how_solved}
- Differentiator: {unique_value}
- Desired action: {primary_cta}
- Tone: {tone}

GENERATE content tokens for a {page_type} with these sections:
{sections_list}

For each section provide:
1. Headline (5-10 words, benefit-focused)
2. Subheadline (1 sentence, supporting detail)
3. Body copy (2-3 sentences if needed)
4. CTA text (action-oriented, 2-4 words)

RULES:
- Use words from: {keywords_use}
- Avoid words: {keywords_avoid}
- Be {tone} but always clear
- Focus on benefits over features
- Address objections indirectly
- Create urgency without being pushy
```

---

## Content-Design Mapping

How content decisions affect design:

| Content Aspect | Design Impact |
|----------------|---------------|
| Long headlines | Larger heading size, more line height |
| Many features (6+) | Grid layout, smaller cards |
| Few features (3) | Larger cards, more whitespace |
| Long testimonials | Card layout, quotes styling |
| Short testimonials | Inline or carousel |
| Multiple CTAs | Button hierarchy needed |
| Technical audience | More whitespace, mono fonts |
| Consumer audience | Warmer colors, friendly shapes |
| Luxury brand | Lots of whitespace, subtle colors |
| Urgency needed | Bold colors, strong CTAs |

---

## Content Editing Interface

Users can edit all generated content:

```
┌─────────────────────────────────────────┐
│ HERO SECTION                      [Edit]│
├─────────────────────────────────────────┤
│ Headline:                               │
│ ┌─────────────────────────────────────┐ │
│ │ Build faster, launch sooner         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Subheadline:                            │
│ ┌─────────────────────────────────────┐ │
│ │ The AI-powered design system that   │ │
│ │ generates pixel-perfect Figma files │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ CTA Primary:    [Get Started Free    ]  │
│ CTA Secondary:  [See Examples        ]  │
│                                         │
│ [Regenerate with AI] [Accept & Continue]│
└─────────────────────────────────────────┘
```

---

## Content Validation

Before proceeding to design, validate:

**Completeness:**
- [ ] All required sections have content
- [ ] No placeholder text remaining
- [ ] CTAs defined for key sections

**Quality:**
- [ ] Headlines are benefit-focused
- [ ] No jargon without explanation
- [ ] Consistent tone throughout
- [ ] Grammar and spelling checked

**Length:**
- [ ] Headlines under 10 words
- [ ] Subheadlines under 20 words
- [ ] Body copy scannable (short paragraphs)

---

## Export Formats

Content tokens can be exported as:

**JSON** - For developers
```json
{
  "hero": {
    "headline": "Build faster, launch sooner",
    "subheadline": "AI-powered design system generator",
    "cta": { "primary": "Get Started", "secondary": "Learn More" }
  }
}
```

**Markdown** - For documentation
```markdown
# Hero Section
## Build faster, launch sooner
AI-powered design system generator
[Get Started] [Learn More]
```

**Copy deck** - For review
Plain text document with all copy organized by section.
