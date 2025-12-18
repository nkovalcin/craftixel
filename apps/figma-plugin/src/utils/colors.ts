// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Convert hex color to RGB object (0-1 range for Figma)
 */
export function hexToRgb(hex: string): RGB {
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
