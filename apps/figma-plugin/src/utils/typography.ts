// ============================================
// TYPOGRAPHY UTILITIES
// ============================================

/**
 * Font family fallback map (Figma font names)
 */
const FONT_MAP: Record<string, string> = {
  'Inter': 'Inter',
  'system-ui': 'Inter',
  'sans-serif': 'Inter',
  'JetBrains Mono': 'JetBrains Mono',
  'Consolas': 'Consolas',
  'monospace': 'JetBrains Mono',
};

/**
 * Get Figma font name from CSS font family
 */
export function getFigmaFontName(fontFamily: string): string {
  const fonts = fontFamily.split(',').map(f => f.trim().replace(/['"]/g, ''));
  for (const font of fonts) {
    if (FONT_MAP[font]) {
      return FONT_MAP[font];
    }
  }
  return 'Inter';
}

/**
 * Get font style from weight
 */
export function getFontStyle(weight: number): string {
  const styleMap: Record<number, string> = {
    100: 'Thin',
    200: 'ExtraLight',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'SemiBold',
    700: 'Bold',
    800: 'ExtraBold',
    900: 'Black',
  };
  return styleMap[weight] || 'Regular';
}

/**
 * Parse rem/px to number
 */
export function parseSize(size: string): number {
  if (size.endsWith('rem')) {
    return parseFloat(size) * 16;
  }
  if (size.endsWith('px')) {
    return parseFloat(size);
  }
  return parseFloat(size);
}

/**
 * Parse em to number (relative to base)
 */
export function parseLetterSpacing(spacing: string, fontSize: number): number {
  if (spacing.endsWith('em')) {
    return parseFloat(spacing) * fontSize;
  }
  if (spacing.endsWith('px')) {
    return parseFloat(spacing);
  }
  return 0;
}

/**
 * Load font before using
 */
export async function loadFont(family: string, style: string): Promise<void> {
  const fontName = getFigmaFontName(family);
  try {
    await figma.loadFontAsync({ family: fontName, style });
  } catch {
    // Fallback to Inter Regular
    await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });
  }
}

/**
 * Create text node with proper font loading
 */
export async function createText(
  content: string,
  options: {
    fontFamily?: string;
    fontSize?: number;
    fontWeight?: number;
    lineHeight?: number;
    letterSpacing?: number;
    color?: string;
    textAlign?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED';
  } = {}
): Promise<TextNode> {
  const {
    fontFamily = 'Inter',
    fontSize = 16,
    fontWeight = 400,
    lineHeight,
    letterSpacing = 0,
    color = '#000000',
    textAlign = 'LEFT',
  } = options;

  const fontName = getFigmaFontName(fontFamily);
  const fontStyle = getFontStyle(fontWeight);

  await loadFont(fontFamily, fontStyle);

  const text = figma.createText();
  text.fontName = { family: fontName, style: fontStyle };
  text.characters = content;
  text.fontSize = fontSize;

  if (lineHeight !== undefined) {
    text.lineHeight = { value: lineHeight * fontSize, unit: 'PIXELS' };
  }

  if (letterSpacing !== 0) {
    text.letterSpacing = { value: letterSpacing, unit: 'PIXELS' };
  }

  text.textAlignHorizontal = textAlign;

  // Apply color
  const rgb = hexToRgb(color);
  text.fills = [{ type: 'SOLID', color: rgb }];

  return text;
}

// Import hex to rgb function
function hexToRgb(hex: string): RGB {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return { r: 0, g: 0, b: 0 };
  }
  return {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255,
  };
}
