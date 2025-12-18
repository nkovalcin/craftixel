# Craftixel Figma Plugin

## Overview

The Figma Plugin is the **generation engine** that transforms tokens and content into actual Figma designs. It's the F5 phase - the final output.

Built on the proven ODRS Design System plugin (~6000+ lines of TypeScript) which demonstrated that complex, professional UI can be generated entirely from code.

---

## Architecture

```
┌─────────────────────────────────────────┐
│           Craftixel Web App             │
│  (Content + Tokens + Component Config)  │
└─────────────────────────────────────────┘
                    │
                    ▼ JSON Export
┌─────────────────────────────────────────┐
│           Figma Plugin                  │
│                                         │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │   Parser    │  │   Generator     │   │
│  │  (JSON →    │→ │  (TS → Figma    │   │
│  │   Objects)  │  │   API calls)    │   │
│  └─────────────┘  └─────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│              Figma File                 │
│  - Variables (from tokens)              │
│  - Components (with variants)           │
│  - Pages (layouts populated)            │
└─────────────────────────────────────────┘
```

---

## Core Functions

### Token Generators

```typescript
// Create Figma Variable Collection from tokens
async function createVariableCollection(tokens: DesignTokens): Promise<void> {
  // Color variables
  const colorCollection = figma.variables.createVariableCollection('Colors');
  for (const [name, value] of Object.entries(tokens.colors.primary)) {
    const variable = figma.variables.createVariable(
      `primary/${name}`,
      colorCollection,
      'COLOR'
    );
    variable.setValueForMode(modeId, parseColor(value));
  }
  // ... repeat for all token categories
}

// Apply variable to component
function applyColorVariable(node: SceneNode, variableId: string) {
  const variable = figma.variables.getVariableById(variableId);
  node.fills = [figma.variables.setBoundVariableForPaint(
    { type: 'SOLID', color: { r: 0, g: 0, b: 0 } },
    'color',
    variable
  )];
}
```

### Component Generators

```typescript
// Base component creation pattern
async function createButton(
  variant: 'primary' | 'secondary' | 'ghost',
  size: 'sm' | 'md' | 'lg',
  label: string
): Promise<ComponentNode> {
  const button = figma.createComponent();
  button.name = `Button/${variant}/${size}`;

  // Layout
  button.layoutMode = 'HORIZONTAL';
  button.primaryAxisAlignItems = 'CENTER';
  button.counterAxisAlignItems = 'CENTER';
  button.paddingLeft = tokens.spacing[size].paddingX;
  button.paddingRight = tokens.spacing[size].paddingX;
  button.paddingTop = tokens.spacing[size].paddingY;
  button.paddingBottom = tokens.spacing[size].paddingY;
  button.itemSpacing = tokens.spacing[2];
  button.cornerRadius = tokens.borderRadius.lg;

  // Styling - uses variables
  applyColorVariable(button, `colors/primary/500`);

  // Text
  const text = await createText(label, {
    fontSize: tokens.typography.fontSize[size],
    fontWeight: tokens.typography.fontWeight.semibold,
    color: 'colors/neutral/0',
  });
  button.appendChild(text);

  return button;
}
```

### Layout Generators

```typescript
// Section generator
async function createSection(
  type: SectionType,
  content: SectionContent,
  tokens: DesignTokens
): Promise<FrameNode> {
  const section = figma.createFrame();
  section.name = `Section/${type}`;
  section.layoutMode = 'VERTICAL';
  section.primaryAxisAlignItems = 'CENTER';
  section.counterAxisAlignItems = 'CENTER';
  section.paddingTop = tokens.spacing.section.paddingY;
  section.paddingBottom = tokens.spacing.section.paddingY;
  section.paddingLeft = tokens.spacing.section.paddingX;
  section.paddingRight = tokens.spacing.section.paddingX;

  // Add content based on section type
  switch (type) {
    case 'hero':
      await addHeroContent(section, content, tokens);
      break;
    case 'features':
      await addFeaturesContent(section, content, tokens);
      break;
    // ... other section types
  }

  return section;
}

// Full page generator
async function createPage(
  template: PageTemplate,
  sections: SectionContent[],
  tokens: DesignTokens
): Promise<PageNode> {
  const page = figma.createPage();
  page.name = template.name;

  const frame = figma.createFrame();
  frame.name = 'Desktop';
  frame.resize(1440, 900);
  frame.layoutMode = 'VERTICAL';

  // Header
  const header = await createHeader(template.header, tokens);
  frame.appendChild(header);

  // Sections
  for (const sectionContent of sections) {
    const section = await createSection(
      sectionContent.type,
      sectionContent,
      tokens
    );
    frame.appendChild(section);
  }

  // Footer
  const footer = await createFooter(template.footer, tokens);
  frame.appendChild(footer);

  page.appendChild(frame);
  return page;
}
```

---

## Plugin UI

Simple interface for plugin control:

```html
<div id="plugin-ui">
  <h2>Craftixel Generator</h2>

  <section>
    <h3>Import</h3>
    <button id="import-json">Import Project JSON</button>
    <textarea id="json-input" placeholder="Paste JSON here..."></textarea>
  </section>

  <section>
    <h3>Generate</h3>
    <label>
      <input type="checkbox" checked> Variables (Tokens)
    </label>
    <label>
      <input type="checkbox" checked> Components
    </label>
    <label>
      <input type="checkbox" checked> Pages
    </label>
    <button id="generate">Generate Design System</button>
  </section>

  <section>
    <h3>Quick Actions</h3>
    <button id="gen-tokens">Tokens Only</button>
    <button id="gen-components">Components Only</button>
    <button id="gen-page">Single Page</button>
  </section>
</div>
```

---

## Message Handling

```typescript
figma.ui.onmessage = async (msg) => {
  switch (msg.type) {
    case 'import-json':
      const project = JSON.parse(msg.data);
      currentProject = project;
      figma.notify('Project imported successfully');
      break;

    case 'generate-all':
      await generateVariables(currentProject.tokens);
      await generateComponents(currentProject.components);
      await generatePages(currentProject.pages);
      figma.notify('Design system generated!');
      break;

    case 'generate-tokens':
      await generateVariables(currentProject.tokens);
      figma.notify('Tokens created as Variables');
      break;

    case 'generate-components':
      await generateComponents(currentProject.components);
      figma.notify('Components created');
      break;

    case 'generate-page':
      await generatePage(msg.pageId);
      figma.notify(`Page "${msg.pageId}" created`);
      break;
  }
};
```

---

## Output Structure

Generated Figma file organization:

```
📁 [Project Name]
│
├── 📄 🎨 Cover
│   └── Project title, description, version
│
├── 📄 📚 Foundations
│   ├── Colors (swatches with variable refs)
│   ├── Typography (text style examples)
│   ├── Spacing (visual scale)
│   ├── Effects (shadows, radii)
│   └── Icons (if included)
│
├── 📄 🧱 Components
│   ├── Atoms/
│   │   ├── Button (all variants)
│   │   ├── Input (all variants)
│   │   ├── Badge
│   │   └── ...
│   ├── Molecules/
│   │   ├── Card
│   │   ├── NavItem
│   │   └── ...
│   └── Organisms/
│       ├── Header
│       ├── Footer
│       └── ...
│
├── 📄 📐 Templates
│   ├── Desktop/
│   │   ├── Landing Page
│   │   ├── Dashboard
│   │   └── ...
│   ├── Tablet/
│   └── Mobile/
│
└── 📄 📱 Pages
    ├── Home
    ├── About
    ├── Pricing
    └── ...
```

---

## Helper Utilities

```typescript
// Text creation with font loading
async function createText(
  content: string,
  options: TextOptions
): Promise<TextNode> {
  const text = figma.createText();
  await figma.loadFontAsync({ family: options.fontFamily, style: 'Regular' });
  text.characters = content;
  text.fontSize = options.fontSize;
  text.fontWeight = options.fontWeight;
  // Apply color variable
  applyColorVariable(text, options.color);
  return text;
}

// Paint creation
function createSolidPaint(color: string): SolidPaint {
  const rgb = hexToRgb(color);
  return { type: 'SOLID', color: rgb };
}

// Gradient creation
function createGradientPaint(
  start: string,
  end: string,
  angle: number = 180
): GradientPaint {
  // ... gradient paint creation
}

// Icon creation from path data
function createIcon(
  pathData: string[],
  size: number,
  color: string
): FrameNode {
  // ... icon creation with vectors
}
```

---

## From ODRS to Craftixel

The ODRS plugin proves the concept. Key learnings:

1. **Complex UI is possible** - Timeline, channels, video overlays all generated from code
2. **Tokens work** - Centralized values make updates easy
3. **Naming matters** - Good layer names = usable Figma file
4. **Auto-layout is essential** - Everything should be responsive
5. **Absolute positioning** - Sometimes needed, handle carefully

### Migration Path

```
ODRS Plugin (Aviation-specific)
        │
        ▼
Craftixel Plugin (Generic, configurable)
        │
        ├── Token system (any tokens, not hardcoded)
        ├── Component factory (generate any component)
        ├── Template system (any layout pattern)
        └── JSON-driven (configuration from web app)
```

---

## Development Setup

```bash
# Clone and install
cd craftixel/apps/figma-plugin
npm install

# Development (watch mode)
npm run dev

# Build for production
npm run build

# In Figma:
# Plugins → Development → Import plugin from manifest
# Select manifest.json
```

### File Structure

```
figma-plugin/
├── src/
│   ├── code.ts          # Main plugin code
│   ├── ui.html          # Plugin UI
│   ├── generators/
│   │   ├── tokens.ts    # Variable generation
│   │   ├── components.ts # Component generation
│   │   └── pages.ts     # Page generation
│   ├── utils/
│   │   ├── colors.ts    # Color utilities
│   │   ├── typography.ts
│   │   └── layout.ts
│   └── types/
│       └── index.ts     # TypeScript types
├── manifest.json
├── package.json
└── tsconfig.json
```
