// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Convert hex color to RGB object (0-1 range for Figma)
 */
export function hexToRgb(hex: string): RGB {
  // Handle invalid or empty hex values
  if (!hex || typeof hex !== 'string') {
    return { r: 0, g: 0, b: 0 };
  }

  // Clean up the hex string
  let cleanHex = hex.trim().replace('#', '');

  // Handle shorthand hex (e.g., #FFF -> #FFFFFF)
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(c => c + c).join('');
  }

  // Validate hex format - only allow valid hex characters
  if (!/^[a-f\d]{6}$/i.test(cleanHex)) {
    console.warn(`Invalid hex color: ${hex}, using fallback`);
    return { r: 0.5, g: 0.5, b: 0.5 }; // Gray fallback
  }

  return {
    r: parseInt(cleanHex.slice(0, 2), 16) / 255,
    g: parseInt(cleanHex.slice(2, 4), 16) / 255,
    b: parseInt(cleanHex.slice(4, 6), 16) / 255,
  };
}

/**
 * Convert hex color to RGBA object (0-1 range for Figma)
 */
export function hexToRgba(hex: string, opacity: number = 1): RGBA {
  const rgb = hexToRgb(hex);
  return { ...rgb, a: opacity };
}

/**
 * Parse rgba string to RGBA object
 */
export function parseRgba(rgba: string): RGBA {
  const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) {
    return { r: 0, g: 0, b: 0, a: 1 };
  }
  return {
    r: parseInt(match[1]) / 255,
    g: parseInt(match[2]) / 255,
    b: parseInt(match[3]) / 255,
    a: match[4] ? parseFloat(match[4]) : 1,
  };
}

/**
 * Create solid paint from hex color
 */
export function createSolidPaint(hex: string, opacity: number = 1): SolidPaint {
  return {
    type: 'SOLID',
    color: hexToRgb(hex),
    opacity,
  };
}

/**
 * Create gradient paint
 */
export function createGradientPaint(
  startHex: string,
  endHex: string,
  angle: number = 180
): GradientPaint {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);

  return {
    type: 'GRADIENT_LINEAR',
    gradientStops: [
      { color: hexToRgba(startHex), position: 0 },
      { color: hexToRgba(endHex), position: 1 },
    ],
    gradientTransform: [
      [cos, sin, 0.5 - cos * 0.5 - sin * 0.5],
      [-sin, cos, 0.5 + sin * 0.5 - cos * 0.5],
    ],
  };
}
