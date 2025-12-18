# Craftixel MVP Plan

## Goal

Launch a working product that demonstrates the core value:
**Business idea → Content → Tokens → Figma**

---

## MVP Scope

### What's IN

1. **Landing page** for craftixel.io
2. **Content strategy flow** (F1-F2)
   - Business questionnaire
   - AI-generated content structure
   - Editable content tokens
3. **Design token editor** (F3)
   - Color palette generator
   - Typography selection
   - Spacing/radius/shadow presets
4. **Figma plugin** (F5)
   - Import JSON from web app
   - Generate variables from tokens
   - Generate basic component set
   - Generate one page template

### What's OUT (v1)

- Multiple layout templates (start with landing page only)
- Advanced component customization
- Responsive variants (desktop first)
- Team collaboration
- User accounts (use simple auth)
- Payment (free during beta)
- Code export

---

## Technical Architecture

```
┌─────────────────────────────────────────────┐
│                 Frontend                    │
│            Next.js 14 + TypeScript          │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │   Pages                             │    │
│  │   - / (landing)                     │    │
│  │   - /app (main app)                 │    │
│  │   - /app/content (F1-F2)            │    │
│  │   - /app/tokens (F3)                │    │
│  │   - /app/export (F5)                │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │   State Management                  │    │
│  │   - Zustand for project state       │    │
│  │   - React Query for API             │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│                 Backend                     │
│           Next.js API Routes                │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │   /api/generate-content             │    │
│  │   - Calls Claude API                │    │
│  │   - Returns content tokens          │    │
│  └─────────────────────────────────────┘    │
│                                             │
│  ┌─────────────────────────────────────┐    │
│  │   /api/generate-tokens              │    │
│  │   - AI suggests color palette       │    │
│  │   - Based on mood/industry          │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────┐
│              Figma Plugin                   │
│                                             │
│  - Receives JSON export from web app        │
│  - Generates Figma Variables                │
│  - Creates component library                │
│  - Builds page from template                │
└─────────────────────────────────────────────┘
```

---

## Sprint Plan

### Week 1: Foundation

**Days 1-2: Project Setup**
- [ ] Next.js project initialization
- [ ] Tailwind + shadcn/ui setup
- [ ] Basic routing structure
- [ ] Environment variables

**Days 3-4: Landing Page**
- [ ] Hero section
- [ ] Features section
- [ ] How it works section
- [ ] Waitlist form (simple email capture)
- [ ] Footer

**Days 5-7: Core State**
- [ ] Project state schema (TypeScript types)
- [ ] Zustand store setup
- [ ] Local storage persistence

---

### Week 2: Content Flow (F1-F2)

**Days 1-3: Business Questionnaire**
- [ ] Multi-step form UI
- [ ] Questions defined (5-10 key questions)
- [ ] Form validation
- [ ] Progress indicator

**Days 4-5: AI Integration**
- [ ] Claude API setup
- [ ] Content generation prompt
- [ ] API route for generation
- [ ] Error handling

**Days 6-7: Content Editor**
- [ ] Display generated content
- [ ] Inline editing for all fields
- [ ] Regenerate individual sections
- [ ] Save to project state

---

### Week 3: Token Editor (F3)

**Days 1-2: Color System**
- [ ] Color picker component
- [ ] Palette generator (from primary color)
- [ ] Semantic color mapping
- [ ] Preview component

**Days 3-4: Typography & Spacing**
- [ ] Font family selector (Google Fonts)
- [ ] Size scale preview
- [ ] Spacing scale editor
- [ ] Border radius presets

**Days 5-7: Token Preview**
- [ ] Live preview of tokens applied
- [ ] Sample components with current tokens
- [ ] Export tokens as JSON

---

### Week 4: Figma Plugin (F5)

**Days 1-2: Plugin Setup**
- [ ] Port ODRS plugin structure
- [ ] JSON import functionality
- [ ] UI for plugin

**Days 3-4: Token Generation**
- [ ] Create Figma Variable collections
- [ ] Color variables
- [ ] Number variables (spacing, radii)

**Days 5-6: Component Generation**
- [ ] Button component (variants)
- [ ] Input component
- [ ] Card component
- [ ] Header/Footer

**Day 7: Page Template**
- [ ] Landing page template
- [ ] Sections populated from content
- [ ] Components using variables

---

### Week 5: Polish & Launch

**Days 1-2: Integration**
- [ ] End-to-end flow testing
- [ ] Bug fixes
- [ ] Performance optimization

**Days 3-4: Documentation**
- [ ] User guide
- [ ] Video walkthrough
- [ ] FAQ

**Days 5-6: Launch Prep**
- [ ] Domain setup (craftixel.io)
- [ ] Analytics (Plausible/Posthog)
- [ ] Error tracking (Sentry)
- [ ] Social media assets

**Day 7: LAUNCH**
- [ ] Product Hunt submission
- [ ] Twitter/X announcement
- [ ] Share with communities

---

## Success Criteria

### Week 1
- Landing page live at craftixel.io
- 50+ waitlist signups

### Week 4
- Full flow working (questions → content → tokens → Figma)
- 5 beta testers using it

### Week 5
- Public launch
- 100+ users tried the product
- Feedback collected

---

## Tech Decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Framework | Next.js 14 | App router, API routes, Vercel deploy |
| Styling | Tailwind + shadcn/ui | Fast development, good defaults |
| State | Zustand | Simple, TypeScript friendly |
| AI | Claude API | Best for content generation |
| Database | None (MVP) | Local storage first, add later |
| Auth | None (MVP) | Add after validation |
| Hosting | Vercel | Easy, free tier sufficient |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Claude API costs | Set token limits, cache responses |
| Figma API complexity | Start with simple components |
| Scope creep | Strict MVP features list |
| No users | Pre-launch waitlist, communities |
| Competition | Focus on content-first differentiator |

---

## Post-MVP Roadmap

**v1.1: Templates**
- Dashboard layout
- Mobile app layout
- More section types

**v1.2: Accounts**
- User authentication
- Project saving
- Project history

**v1.3: Team & Pro**
- Team workspaces
- Payment integration
- Advanced features

**v2.0: Code Export**
- React components
- Tailwind CSS
- Storybook

---

*Let's build this. One phase at a time.*
