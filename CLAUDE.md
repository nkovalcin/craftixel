# CRAFTIXEL.IO

## Project Overview

Craftixel is an AI-powered design system generator that transforms business ideas into pixel-perfect Figma designs. From content strategy to visual design to export - all in one seamless flow.

**Tagline:** From idea to pixel-perfect UI

## Core Philosophy

1. **Content-First** - Text and message come before design
2. **Token-Based** - Everything is parametrized and systematic
3. **AI-Powered** - Claude drives strategy, copy, and design decisions
4. **Pixel-Perfect** - No compromises on quality
5. **Custom Frameworks** - We don't use generic templates, we create unique design languages

## The 5 Phases (F1-F5)

### F1: STRATEGY (Business → Content Structure)
- Understand the business, audience, problem, solution
- Define tone of voice and messaging
- Generate content structure (sections, hierarchy)

### F2: CONTENT (Content Tokens)
- Headlines, subheadlines, body copy
- CTAs and microcopy
- Value propositions
- All text content as structured tokens

### F3: TOKENS (Design System Foundation)
- Colors (semantic: primary, secondary, accent, states...)
- Typography scale
- Spacing system
- Border radii, shadows
- Motion/animation tokens

### F4: COMPONENTS (Primitives → Compositions)
- Atomic: button, input, badge, icon
- Molecules: cards, nav items, form groups
- Organisms: header, footer, sidebar, sections
- Templates: full page layouts

### F5: GENERATE (Figma Export)
- One-click Figma design system generation
- Figma Variables integration
- Component library with variants
- Auto-documentation

## Tech Stack

```
Frontend:       Next.js 14 + TypeScript
AI:             Claude API (Anthropic)
Design Engine:  Custom Figma Plugin (TypeScript)
Database:       PostgreSQL / Supabase
Auth:           NextAuth / Clerk
Payments:       Stripe
Hosting:        Vercel
```

## Project Structure

```
craftixel/
├── apps/
│   ├── web/              # Main Next.js application
│   └── figma-plugin/     # Figma plugin (from ODRS project)
├── packages/
│   ├── tokens/           # Design token system
│   ├── content/          # Content token system
│   └── generator/        # Figma generation engine
├── docs/
│   ├── VISION.md
│   ├── PHASES.md
│   ├── CONTENT-SYSTEM.md
│   ├── DESIGN-TOKENS.md
│   └── FIGMA-PLUGIN.md
└── CLAUDE.md
```

## Commands

```bash
# Development
npm run dev           # Start development server
npm run build         # Build for production

# Figma Plugin
npm run plugin:build  # Build Figma plugin
npm run plugin:watch  # Watch mode for plugin development
```

## Key Concepts

### Content Tokens
Structured content that informs design:
- Brand voice and messaging
- Section content (headlines, descriptions, CTAs)
- Microcopy (labels, errors, hints)
- All editable, all systematic

### Design Tokens
Visual foundation:
- Semantic color system
- Typography with hierarchy
- Spacing based on base unit
- Consistent radii and shadows

### Layout Patterns
Common structures:
- **Website:** Header + Sections + Footer
- **Web App:** Sidebar + Content Area
- **Dashboard:** Nav + Main + Inspector
- **Mobile:** Tab bar / Drawer navigation

## Development Guidelines

1. **TypeScript everywhere** - No JavaScript, strict types
2. **Component-first** - Build small, compose large
3. **Token-driven** - Never hardcode values
4. **AI-assisted** - Claude helps at every phase
5. **Figma-native** - Output must be production-ready Figma

## Prior Art

This project builds on the ODRS Figma Design System plugin which demonstrated that complex, professional UI can be generated entirely from TypeScript code. The ODRS plugin generates:
- Complete aviation application UI (1920x1080)
- Timeline with transport controls, channels, waveforms
- Professional dark theme with proper tokens
- Video thumbnail overlays
- All from ~6000+ lines of TypeScript

## Business Model

**Free:** 1 project, basic templates, watermark
**Pro ($29/mo):** Unlimited projects, all templates, full export
**Agency ($99/mo):** White-label, team features, API access

## Next Steps (MVP)

1. [ ] Landing page with waitlist
2. [ ] Content strategy AI flow (F1-F2)
3. [ ] Design token editor (F3)
4. [ ] Basic layout templates
5. [ ] Figma plugin integration (F5)
6. [ ] User accounts + projects

---

*Created: December 2024*
*Status: Planning Phase*
