# Craftixel

> From idea to pixel-perfect UI

**Craftixel** is an AI-powered design system generator that transforms business ideas into production-ready Figma designs.

## The Problem

Creating professional web/app designs is time-consuming, inconsistent, and repetitive. Most tools start with templates - we start with YOUR message.

## The Solution

One seamless flow:

```
Business Idea → Content Strategy → Design Tokens → Figma Export
     F1              F2                F3             F5
```

## Features

- **Content-First Approach** - AI generates copy based on your business
- **Token-Based Design** - Every value is parametrized and consistent
- **Figma-Native Output** - Real components, real variables, production-ready
- **Custom, Not Generic** - Your unique design language, not Bootstrap

## Documentation

- [Vision](./docs/VISION.md) - Why we're building this
- [Phases](./docs/PHASES.md) - The F1-F5 flow explained
- [Content System](./docs/CONTENT-SYSTEM.md) - How content tokens work
- [Design Tokens](./docs/DESIGN-TOKENS.md) - Token architecture
- [Figma Plugin](./docs/FIGMA-PLUGIN.md) - Plugin documentation
- [MVP Plan](./docs/MVP-PLAN.md) - Development roadmap

## Tech Stack

- **Frontend:** Next.js 14 + TypeScript
- **AI:** Claude API (Anthropic)
- **Design Engine:** Custom Figma Plugin
- **Styling:** Tailwind CSS + shadcn/ui

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build Figma plugin
npm run plugin:build
```

## Project Structure

```
craftixel/
├── apps/
│   ├── web/              # Next.js application
│   └── figma-plugin/     # Figma plugin
├── packages/
│   ├── tokens/           # Token definitions
│   └── types/            # Shared TypeScript types
├── docs/                 # Documentation
└── README.md
```

## Status

🚧 **In Development** - Building MVP

## Origin

Built on the foundation of the ODRS Figma Design System plugin - a proof of concept that demonstrated complex, professional UI can be generated entirely from TypeScript code.

---

**craftixel.io** - Every pixel crafted with intention.
