// ============================================
// FIGMA VARIABLES GENERATOR
// ============================================

import type { DesignTokens, ColorScale, NeutralScale } from '../types';
import { hexToRgba } from '../utils/colors';

/**
 * Generate Figma Variables from design tokens
 */
export async function generateVariables(tokens: DesignTokens): Promise<void> {
  // Create or get existing collections
  const colorCollection = await getOrCreateCollection('Colors');
  const spacingCollection = await getOrCreateCollection('Spacing');
  const effectsCollection = await getOrCreateCollection('Effects');

  // Generate color variables
  await generateColorVariables(colorCollection, tokens.colors);

  // Generate spacing variables
  await generateSpacingVariables(spacingCollection, tokens.spacing);

  // Generate effect variables (border radius)
  await generateEffectVariables(effectsCollection, tokens.effects);

  figma.notify('Variables created successfully!');
}

/**
 * Get existing collection or create new one
 */
async function getOrCreateCollection(name: string): Promise<VariableCollection> {
  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const existing = collections.find((c) => c.name === name);

  if (existing) {
    return existing;
  }

  return figma.variables.createVariableCollection(name);
}

/**
 * Sanitize variable name for Figma
 * Figma variable names can only contain letters, numbers, underscores, hyphens, and slashes
 */
function sanitizeVariableName(name: string): string {
  return name
    .replace(/\./g, '-') // Replace dots with hyphens (e.g., "0.5" -> "0-5")
    .replace(/[^a-zA-Z0-9_\-/]/g, '-') // Replace other invalid chars with hyphens
    .replace(/-+/g, '-') // Collapse multiple hyphens
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Get or create variable
 */
async function getOrCreateVariable(
  collection: VariableCollection,
  name: string,
  type: VariableResolvedDataType
): Promise<Variable> {
  const sanitizedName = sanitizeVariableName(name);

  for (const id of collection.variableIds) {
    const variable = await figma.variables.getVariableByIdAsync(id);
    if (variable?.name === sanitizedName) {
      return variable;
    }
  }

  return figma.variables.createVariable(sanitizedName, collection, type);
}

/**
 * Generate color variables
 */
async function generateColorVariables(
  collection: VariableCollection,
  colors: DesignTokens['colors']
): Promise<void> {
  const modeId = collection.modes[0].modeId;

  // Primary colors
  await generateColorScale(collection, modeId, 'primary', colors.primary);

  // Secondary colors
  await generateColorScale(collection, modeId, 'secondary', colors.secondary);

  // Accent colors
  await generateColorScale(collection, modeId, 'accent', colors.accent);

  // Semantic colors
  for (const [name, value] of Object.entries(colors.semantic)) {
    const variable = await getOrCreateVariable(collection, `semantic/${name}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }

  // Neutral colors
  await generateNeutralScale(collection, modeId, 'neutral', colors.neutral);

  // Background colors
  for (const [name, value] of Object.entries(colors.background)) {
    const variable = await getOrCreateVariable(collection, `background/${name}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }

  // Text colors
  for (const [name, value] of Object.entries(colors.text)) {
    const variable = await getOrCreateVariable(collection, `text/${name}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }

  // Border colors
  for (const [name, value] of Object.entries(colors.border)) {
    const variable = await getOrCreateVariable(collection, `border/${name}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }
}

/**
 * Generate color scale variables
 */
async function generateColorScale(
  collection: VariableCollection,
  modeId: string,
  prefix: string,
  scale: ColorScale
): Promise<void> {
  for (const [shade, value] of Object.entries(scale)) {
    const variable = await getOrCreateVariable(collection, `${prefix}/${shade}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }
}

/**
 * Generate neutral scale variables
 */
async function generateNeutralScale(
  collection: VariableCollection,
  modeId: string,
  prefix: string,
  scale: NeutralScale
): Promise<void> {
  for (const [shade, value] of Object.entries(scale)) {
    const variable = await getOrCreateVariable(collection, `${prefix}/${shade}`, 'COLOR');
    variable.setValueForMode(modeId, hexToRgba(value));
  }
}

/**
 * Generate spacing variables
 */
async function generateSpacingVariables(
  collection: VariableCollection,
  spacing: DesignTokens['spacing']
): Promise<void> {
  const modeId = collection.modes[0].modeId;

  // Base unit
  const baseVar = await getOrCreateVariable(collection, 'base-unit', 'FLOAT');
  baseVar.setValueForMode(modeId, spacing.baseUnit);

  // Scale
  for (const [key, value] of Object.entries(spacing.scale)) {
    const numValue = parseSpacingValue(value);
    const variable = await getOrCreateVariable(collection, `scale/${key}`, 'FLOAT');
    variable.setValueForMode(modeId, numValue);
  }

  // Section spacing
  for (const [key, value] of Object.entries(spacing.section)) {
    const numValue = parseSpacingValue(value);
    const variable = await getOrCreateVariable(collection, `section/${key}`, 'FLOAT');
    variable.setValueForMode(modeId, numValue);
  }

  // Component spacing
  for (const [key, value] of Object.entries(spacing.component)) {
    const numValue = parseSpacingValue(value);
    const variable = await getOrCreateVariable(collection, `component/${key}`, 'FLOAT');
    variable.setValueForMode(modeId, numValue);
  }
}

/**
 * Generate effect variables
 */
async function generateEffectVariables(
  collection: VariableCollection,
  effects: DesignTokens['effects']
): Promise<void> {
  const modeId = collection.modes[0].modeId;

  // Border radius
  for (const [key, value] of Object.entries(effects.borderRadius)) {
    const numValue = parseSpacingValue(value);
    const variable = await getOrCreateVariable(collection, `radius/${key}`, 'FLOAT');
    variable.setValueForMode(modeId, numValue);
  }
}

/**
 * Parse spacing value to number
 */
function parseSpacingValue(value: string): number {
  if (value === '0' || value === 'none') return 0;
  if (value === 'px' || value === '1px') return 1;

  if (value.endsWith('rem')) {
    return parseFloat(value) * 16;
  }
  if (value.endsWith('px')) {
    return parseFloat(value);
  }

  return parseFloat(value) || 0;
}
