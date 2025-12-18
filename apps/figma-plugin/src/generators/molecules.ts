// ============================================
// MOLECULE COMPONENTS GENERATOR
// Card, FormField, NavItem, FeatureItem
// ============================================

import type { DesignTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';
import { parseShadows } from '../utils/layout';

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
  await figma.setCurrentPageAsync(moleculesPage);

  await generateCardComponent(tokens);
  await generateFormFieldComponent(tokens);
  await generateNavItemComponent(tokens);
  await generateFeatureItemComponent(tokens);

  figma.notify('Molecule components created!');
}

/**
 * Create auto-layout frame helper
 */
function createAutoFrame(name: string): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = 'VERTICAL';
  frame.fills = [];
  return frame;
}

/**
 * Generate Card component
 */
async function generateCardComponent(tokens: DesignTokens): Promise<void> {
  const card = figma.createComponent();
  card.name = 'Card';

  // Setup auto-layout
  card.layoutMode = 'VERTICAL';
  card.paddingTop = 24;
  card.paddingRight = 24;
  card.paddingBottom = 24;
  card.paddingLeft = 24;
  card.itemSpacing = 16;
  card.cornerRadius = parseSize(tokens.effects.borderRadius.xl);
  card.fills = [createSolidPaint(tokens.colors.background.primary)];
  card.strokes = [createSolidPaint(tokens.colors.border.light)];
  card.strokeWeight = 1;
  card.effects = parseShadows(tokens.effects.shadow.md);

  // Card title
  const title = await createText('Card Title', {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['xl'].size),
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.primary,
  });

  // Card description
  const description = await createText(
    'This is a card description. It can contain multiple lines of text to explain the content.',
    {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      fontWeight: tokens.typography.fontWeight.normal,
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.base.lineHeight,
    }
  );

  // Append children first
  card.appendChild(title);
  card.appendChild(description);

  // Then set sizing
  card.resize(320, card.height);
  card.layoutSizingHorizontal = 'FIXED';
  card.layoutSizingVertical = 'HUG';
  title.layoutSizingHorizontal = 'FILL';
  description.layoutSizingHorizontal = 'FILL';

  card.x = 0;
  card.y = 0;
}

/**
 * Generate FormField component (Label + Input + Helper)
 */
async function generateFormFieldComponent(tokens: DesignTokens): Promise<void> {
  const formField = figma.createComponent();
  formField.name = 'FormField';

  // Setup auto-layout
  formField.layoutMode = 'VERTICAL';
  formField.itemSpacing = 6;
  formField.fills = [];

  // Label
  const label = await createText('Label', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.text.primary,
  });

  // Input frame
  const input = createAutoFrame('Input');
  input.layoutMode = 'HORIZONTAL';
  input.primaryAxisAlignItems = 'MIN';
  input.counterAxisAlignItems = 'CENTER';
  input.paddingTop = 10;
  input.paddingRight = 12;
  input.paddingBottom = 10;
  input.paddingLeft = 12;
  input.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
  input.fills = [createSolidPaint(tokens.colors.background.primary)];
  input.strokes = [createSolidPaint(tokens.colors.border.medium)];
  input.strokeWeight = 1;

  const placeholder = await createText('Enter value...', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.base.size),
    color: tokens.colors.text.muted,
  });

  input.appendChild(placeholder);

  // Helper text
  const helper = await createText('Helper text goes here', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    color: tokens.colors.text.muted,
  });

  // Append all to form field
  formField.appendChild(label);
  formField.appendChild(input);
  formField.appendChild(helper);

  // Set sizing after appendChild
  formField.resize(280, formField.height);
  formField.layoutSizingHorizontal = 'FIXED';
  formField.layoutSizingVertical = 'HUG';
  input.layoutSizingHorizontal = 'FILL';
  input.layoutSizingVertical = 'HUG';
  placeholder.layoutSizingHorizontal = 'FILL';

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
    const navItem = figma.createComponent();
    navItem.name = `NavItem/${state}`;

    // Setup auto-layout
    navItem.layoutMode = 'HORIZONTAL';
    navItem.primaryAxisAlignItems = 'CENTER';
    navItem.counterAxisAlignItems = 'CENTER';
    navItem.paddingTop = 8;
    navItem.paddingRight = 16;
    navItem.paddingBottom = 8;
    navItem.paddingLeft = 16;
    navItem.cornerRadius = parseSize(tokens.effects.borderRadius.md);

    // Fill based on state
    if (state === 'hover') {
      navItem.fills = [createSolidPaint(tokens.colors.neutral[50])];
    } else if (state === 'active') {
      navItem.fills = [createSolidPaint(tokens.colors.primary[50])];
    } else {
      navItem.fills = [];
    }

    const text = await createText('Nav Item', {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.sm.size),
      fontWeight: state === 'active' ? tokens.typography.fontWeight.semibold : tokens.typography.fontWeight.medium,
      color: state === 'active' ? tokens.colors.primary[600] : tokens.colors.text.secondary,
    });

    navItem.appendChild(text);

    // Set sizing after appendChild
    navItem.layoutSizingHorizontal = 'HUG';
    navItem.layoutSizingVertical = 'HUG';

    navItem.x = x;
    navItem.y = 200;
    x += 150;
  }
}

/**
 * Generate FeatureItem component
 */
async function generateFeatureItemComponent(tokens: DesignTokens): Promise<void> {
  const featureItem = figma.createComponent();
  featureItem.name = 'FeatureItem';

  // Setup auto-layout
  featureItem.layoutMode = 'VERTICAL';
  featureItem.itemSpacing = 12;
  featureItem.fills = [];

  // Icon placeholder frame
  const iconFrame = createAutoFrame('IconFrame');
  iconFrame.layoutMode = 'HORIZONTAL';
  iconFrame.primaryAxisAlignItems = 'CENTER';
  iconFrame.counterAxisAlignItems = 'CENTER';
  iconFrame.resize(48, 48);
  iconFrame.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
  iconFrame.fills = [createSolidPaint(tokens.colors.primary[50])];

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

  // Append all children first
  featureItem.appendChild(iconFrame);
  featureItem.appendChild(title);
  featureItem.appendChild(description);

  // Set sizing after appendChild
  featureItem.resize(280, featureItem.height);
  featureItem.layoutSizingHorizontal = 'FIXED';
  featureItem.layoutSizingVertical = 'HUG';
  iconFrame.layoutSizingHorizontal = 'HUG';
  iconFrame.layoutSizingVertical = 'HUG';
  title.layoutSizingHorizontal = 'FILL';
  description.layoutSizingHorizontal = 'FILL';

  featureItem.x = 0;
  featureItem.y = 300;
}
