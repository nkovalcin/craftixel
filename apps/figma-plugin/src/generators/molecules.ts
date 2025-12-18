// ============================================
// MOLECULE COMPONENTS GENERATOR
// Card, FormField, NavItem, FeatureItem
// ============================================

import type { DesignTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';
import { createComponent, createAutoLayoutFrame, parseShadows } from '../utils/layout';

/**
 * Generate all molecule components
 */
export async function generateMolecules(tokens: DesignTokens): Promise<void> {
  // Create Molecules page
  let moleculesPage = figma.root.children.find(
    (p) => p.name === 'Components/Molecules'
  ) as PageNode;
  if (!moleculesPage) {
    moleculesPage = figma.createPage();
    moleculesPage.name = 'Components/Molecules';
  }
  figma.currentPage = moleculesPage;

  await generateCardComponent(tokens);
  await generateFormFieldComponent(tokens);
  await generateNavItemComponent(tokens);
  await generateFeatureItemComponent(tokens);

  figma.notify('Molecule components created!');
}

/**
 * Generate Card component
 */
async function generateCardComponent(tokens: DesignTokens): Promise<void> {
  const card = createComponent('Card', {
    direction: 'VERTICAL',
    padding: 24,
    itemSpacing: 16,
    width: 320,
    height: 'HUG',
    cornerRadius: parseSize(tokens.effects.borderRadius.xl),
    fills: [createSolidPaint(tokens.colors.background.primary)],
    strokes: [createSolidPaint(tokens.colors.border.light)],
    strokeWeight: 1,
    effects: parseShadows(tokens.effects.shadow.md),
  });

  // Card title
  const title = await createText('Card Title', {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['xl'].size),
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.primary,
  });
  title.layoutSizingHorizontal = 'FILL';

  // Card description
  const description = await createText(
    'This is a card description. It can contain multiple lines of text to explain the content.',
    {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      fontWeight: tokens.typography.fontWeight.regular,
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.base.lineHeight,
    }
  );
  description.layoutSizingHorizontal = 'FILL';

  card.appendChild(title);
  card.appendChild(description);

  card.x = 0;
  card.y = 0;
}

/**
 * Generate FormField component (Label + Input + Helper)
 */
async function generateFormFieldComponent(tokens: DesignTokens): Promise<void> {
  const formField = createComponent('FormField', {
    direction: 'VERTICAL',
    itemSpacing: 6,
    width: 280,
    height: 'HUG',
  });

  // Label
  const label = await createText('Label', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.text.primary,
  });

  // Input frame
  const input = createAutoLayoutFrame('Input', {
    direction: 'HORIZONTAL',
    primaryAlign: 'MIN',
    counterAlign: 'CENTER',
    padding: { top: 10, right: 12, bottom: 10, left: 12 },
    width: 'FILL',
    height: 'HUG',
    cornerRadius: parseSize(tokens.effects.borderRadius.lg),
    fills: [createSolidPaint(tokens.colors.background.primary)],
    strokes: [createSolidPaint(tokens.colors.border.medium)],
    strokeWeight: 1,
  });

  const placeholder = await createText('Enter value...', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.base.size),
    color: tokens.colors.text.muted,
  });
  placeholder.layoutSizingHorizontal = 'FILL';
  input.appendChild(placeholder);

  // Helper text
  const helper = await createText('Helper text goes here', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    color: tokens.colors.text.muted,
  });

  formField.appendChild(label);
  formField.appendChild(input);
  formField.appendChild(helper);

  formField.x = 400;
  formField.y = 0;
}

/**
 * Generate NavItem component
 */
async function generateNavItemComponent(tokens: DesignTokens): Promise<void> {
  const states = ['default', 'hover', 'active'];

  let x = 0;
  for (const state of states) {
    const navItem = createComponent(`NavItem/${state}`, {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      padding: { top: 8, right: 16, bottom: 8, left: 16 },
      cornerRadius: parseSize(tokens.effects.borderRadius.md),
      fills:
        state === 'hover'
          ? [createSolidPaint(tokens.colors.neutral[50])]
          : state === 'active'
            ? [createSolidPaint(tokens.colors.primary[50])]
            : [],
      width: 'HUG',
      height: 'HUG',
    });

    const text = await createText('Nav Item', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.sm.size),
      fontWeight:
        state === 'active'
          ? tokens.typography.fontWeight.semibold
          : tokens.typography.fontWeight.medium,
      color: state === 'active' ? tokens.colors.primary[600] : tokens.colors.text.secondary,
    });

    navItem.appendChild(text);
    navItem.x = x;
    navItem.y = 200;
    x += 150;
  }
}

/**
 * Generate FeatureItem component
 */
async function generateFeatureItemComponent(tokens: DesignTokens): Promise<void> {
  const featureItem = createComponent('FeatureItem', {
    direction: 'VERTICAL',
    itemSpacing: 12,
    width: 280,
    height: 'HUG',
  });

  // Icon placeholder
  const iconFrame = createAutoLayoutFrame('IconFrame', {
    direction: 'HORIZONTAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    width: 48,
    height: 48,
    cornerRadius: parseSize(tokens.effects.borderRadius.lg),
    fills: [createSolidPaint(tokens.colors.primary[50])],
  });

  const iconText = await createText('✦', {
    fontSize: 24,
    color: tokens.colors.primary[500],
  });
  iconFrame.appendChild(iconText);

  // Title
  const title = await createText('Feature Title', {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize.lg.size),
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.primary,
  });
  title.layoutSizingHorizontal = 'FILL';

  // Description
  const description = await createText(
    'Brief description of this feature and how it benefits the user.',
    {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.base.lineHeight,
    }
  );
  description.layoutSizingHorizontal = 'FILL';

  featureItem.appendChild(iconFrame);
  featureItem.appendChild(title);
  featureItem.appendChild(description);

  featureItem.x = 0;
  featureItem.y = 300;
}
