// ============================================
// ATOM COMPONENTS GENERATOR
// Button, Input, Badge
// ============================================

import type { DesignTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';
import { createComponent, parseShadows } from '../utils/layout';

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
    {
      name: 'primary',
      bg: tokens.colors.primary[500],
      text: tokens.colors.text.inverse,
    },
    {
      name: 'secondary',
      bg: tokens.colors.neutral[100],
      text: tokens.colors.text.primary,
    },
    {
      name: 'ghost',
      bg: 'transparent',
      text: tokens.colors.primary[500],
    },
    {
      name: 'outline',
      bg: 'transparent',
      text: tokens.colors.primary[500],
      border: tokens.colors.primary[500],
    },
  ];

  const sizes: Array<{ name: string; px: number; py: number; fontSize: number }> = [
    { name: 'sm', px: 12, py: 6, fontSize: 14 },
    { name: 'md', px: 16, py: 10, fontSize: 14 },
    { name: 'lg', px: 24, py: 14, fontSize: 16 },
  ];

  const buttonComponents: ComponentNode[] = [];

  for (const variant of variants) {
    for (const size of sizes) {
      const button = createComponent(`Button/${variant.name}/${size.name}`, {
        direction: 'HORIZONTAL',
        primaryAlign: 'CENTER',
        counterAlign: 'CENTER',
        padding: { top: size.py, right: size.px, bottom: size.py, left: size.px },
        itemSpacing: 8,
        cornerRadius: parseSize(tokens.effects.borderRadius.lg),
        fills: variant.bg === 'transparent' ? [] : [createSolidPaint(variant.bg)],
        strokes: variant.border ? [createSolidPaint(variant.border)] : [],
        strokeWeight: variant.border ? 1 : 0,
        width: 'HUG',
        height: 'HUG',
      });

      // Button text
      const text = await createText('Button', {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: size.fontSize,
        fontWeight: tokens.typography.fontWeight.semibold,
        color: variant.text,
      });

      button.appendChild(text);
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
    const input = createComponent(`Input/${state}`, {
      direction: 'HORIZONTAL',
      primaryAlign: 'MIN',
      counterAlign: 'CENTER',
      padding: { top: 10, right: 12, bottom: 10, left: 12 },
      width: 280,
      height: 'HUG',
      cornerRadius: parseSize(tokens.effects.borderRadius.lg),
      fills: [createSolidPaint(tokens.colors.background.primary)],
      strokes: [
        createSolidPaint(
          state === 'focused'
            ? tokens.colors.primary[500]
            : state === 'error'
              ? tokens.colors.semantic.error
              : tokens.colors.border.medium
        ),
      ],
      strokeWeight: state === 'focused' ? 2 : 1,
    });

    // Placeholder text
    const placeholder = await createText('Placeholder text', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      fontWeight: tokens.typography.fontWeight.regular,
      color: state === 'disabled' ? tokens.colors.text.muted : tokens.colors.text.secondary,
    });

    placeholder.layoutSizingHorizontal = 'FILL';
    input.appendChild(placeholder);

    if (state === 'disabled') {
      input.opacity = 0.5;
    }

    inputComponents.push(input);
  }

  // Arrange below buttons
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
    const badge = createComponent(`Badge/${variant.name}`, {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      padding: { top: 4, right: 10, bottom: 4, left: 10 },
      cornerRadius: parseSize(tokens.effects.borderRadius.full),
      fills: [createSolidPaint(variant.bg)],
      width: 'HUG',
      height: 'HUG',
    });

    const text = await createText('Badge', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: 12,
      fontWeight: tokens.typography.fontWeight.medium,
      color: variant.text,
    });

    badge.appendChild(text);
    badgeComponents.push(badge);
  }

  // Arrange
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
