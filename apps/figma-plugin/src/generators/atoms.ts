// ============================================
// ATOM COMPONENTS GENERATOR
// Button, Input, Badge
// ============================================

import type { DesignTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';

/**
 * Generate all atom components
 */
export async function generateAtoms(tokens: DesignTokens): Promise<void> {
  // Create Atoms page if needed
  let atomsPage = figma.root.children.find((p) => p.name === 'Components/Atoms') as PageNode;
  if (!atomsPage) {
    atomsPage = figma.createPage();
    atomsPage.name = 'Components/Atoms';
  }
  await figma.setCurrentPageAsync(atomsPage);

  // Generate components
  await generateButtonComponents(tokens);
  await generateInputComponents(tokens);
  await generateBadgeComponents(tokens);

  figma.notify('Atom components created!');
}

/**
 * Generate Button component variants
 */
async function generateButtonComponents(tokens: DesignTokens): Promise<void> {
  const variants: Array<{ name: string; bg: string; text: string; border?: string }> = [
    { name: 'primary', bg: tokens.colors.primary[500], text: tokens.colors.text.inverse },
    { name: 'secondary', bg: tokens.colors.neutral[100], text: tokens.colors.text.primary },
    { name: 'ghost', bg: 'transparent', text: tokens.colors.primary[500] },
    { name: 'outline', bg: 'transparent', text: tokens.colors.primary[500], border: tokens.colors.primary[500] },
  ];

  const sizes: Array<{ name: string; px: number; py: number; fontSize: number }> = [
    { name: 'sm', px: 12, py: 6, fontSize: 14 },
    { name: 'md', px: 16, py: 10, fontSize: 14 },
    { name: 'lg', px: 24, py: 14, fontSize: 16 },
  ];

  const buttonComponents: ComponentNode[] = [];

  for (const variant of variants) {
    for (const size of sizes) {
      // Create component
      const button = figma.createComponent();
      button.name = `Button/${variant.name}/${size.name}`;

      // Setup auto-layout
      button.layoutMode = 'HORIZONTAL';
      button.primaryAxisAlignItems = 'CENTER';
      button.counterAxisAlignItems = 'CENTER';
      button.paddingTop = size.py;
      button.paddingRight = size.px;
      button.paddingBottom = size.py;
      button.paddingLeft = size.px;
      button.itemSpacing = 8;
      button.cornerRadius = parseSize(tokens.effects.borderRadius.lg);

      // Fills
      if (variant.bg !== 'transparent') {
        button.fills = [createSolidPaint(variant.bg)];
      } else {
        button.fills = [];
      }

      // Strokes
      if (variant.border) {
        button.strokes = [createSolidPaint(variant.border)];
        button.strokeWeight = 1;
      }

      // Button text
      const text = await createText('Button', {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: size.fontSize,
        fontWeight: tokens.typography.fontWeight.semibold,
        color: variant.text,
      });

      button.appendChild(text);

      // Set sizing after children are added
      button.layoutSizingHorizontal = 'HUG';
      button.layoutSizingVertical = 'HUG';

      buttonComponents.push(button);
    }
  }

  // Arrange components on page
  arrangeComponents(buttonComponents, 300);
}

/**
 * Generate Input component variants
 */
async function generateInputComponents(tokens: DesignTokens): Promise<void> {
  const states = ['default', 'focused', 'error', 'disabled'];
  const inputComponents: ComponentNode[] = [];

  for (const state of states) {
    // Create component
    const input = figma.createComponent();
    input.name = `Input/${state}`;

    // Setup auto-layout
    input.layoutMode = 'HORIZONTAL';
    input.primaryAxisAlignItems = 'MIN';
    input.counterAxisAlignItems = 'CENTER';
    input.paddingTop = 10;
    input.paddingRight = 12;
    input.paddingBottom = 10;
    input.paddingLeft = 12;
    input.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
    input.fills = [createSolidPaint(tokens.colors.background.primary)];

    // Border color based on state
    const borderColor =
      state === 'focused'
        ? tokens.colors.primary[500]
        : state === 'error'
          ? tokens.colors.semantic.error
          : tokens.colors.border.medium;
    input.strokes = [createSolidPaint(borderColor)];
    input.strokeWeight = state === 'focused' ? 2 : 1;

    // Placeholder text
    const placeholder = await createText('Placeholder text', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      fontWeight: tokens.typography.fontWeight.normal,
      color: state === 'disabled' ? tokens.colors.text.muted : tokens.colors.text.secondary,
    });

    input.appendChild(placeholder);

    // Set sizing AFTER appendChild
    input.resize(280, input.height);
    input.layoutSizingHorizontal = 'FIXED';
    input.layoutSizingVertical = 'HUG';
    placeholder.layoutSizingHorizontal = 'FILL';

    if (state === 'disabled') {
      input.opacity = 0.5;
    }

    inputComponents.push(input);
  }

  arrangeComponents(inputComponents, 300, 200);
}

/**
 * Generate Badge component variants
 */
async function generateBadgeComponents(tokens: DesignTokens): Promise<void> {
  const variants: Array<{ name: string; bg: string; text: string }> = [
    { name: 'default', bg: tokens.colors.neutral[100], text: tokens.colors.text.primary },
    { name: 'primary', bg: tokens.colors.primary[100], text: tokens.colors.primary[700] },
    { name: 'success', bg: '#dcfce7', text: '#15803d' },
    { name: 'warning', bg: '#fef3c7', text: '#b45309' },
    { name: 'error', bg: '#fee2e2', text: '#b91c1c' },
  ];

  const badgeComponents: ComponentNode[] = [];

  for (const variant of variants) {
    // Create component
    const badge = figma.createComponent();
    badge.name = `Badge/${variant.name}`;

    // Setup auto-layout
    badge.layoutMode = 'HORIZONTAL';
    badge.primaryAxisAlignItems = 'CENTER';
    badge.counterAxisAlignItems = 'CENTER';
    badge.paddingTop = 4;
    badge.paddingRight = 10;
    badge.paddingBottom = 4;
    badge.paddingLeft = 10;
    badge.cornerRadius = 9999; // full rounded
    badge.fills = [createSolidPaint(variant.bg)];

    const text = await createText('Badge', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: 12,
      fontWeight: tokens.typography.fontWeight.medium,
      color: variant.text,
    });

    badge.appendChild(text);

    // Set sizing after appendChild
    badge.layoutSizingHorizontal = 'HUG';
    badge.layoutSizingVertical = 'HUG';

    badgeComponents.push(badge);
  }

  arrangeComponents(badgeComponents, 120, 400);
}

/**
 * Arrange components in a grid
 */
function arrangeComponents(
  components: ComponentNode[],
  spacing: number,
  startY: number = 0
): void {
  let x = 0;
  let y = startY;
  const maxWidth = 1200;
  let rowHeight = 0;

  for (const component of components) {
    if (x + component.width > maxWidth && x > 0) {
      x = 0;
      y += rowHeight + 40;
      rowHeight = 0;
    }

    component.x = x;
    component.y = y;
    x += component.width + spacing;
    rowHeight = Math.max(rowHeight, component.height);
  }
}
