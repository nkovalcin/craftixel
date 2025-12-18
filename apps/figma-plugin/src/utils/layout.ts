// ============================================
// LAYOUT UTILITIES
// ============================================

export interface AutoLayoutOptions {
  direction?: 'HORIZONTAL' | 'VERTICAL';
  primaryAlign?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN';
  counterAlign?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE';
  padding?: number | { top?: number; right?: number; bottom?: number; left?: number };
  itemSpacing?: number;
  width?: number | 'HUG' | 'FILL';
  height?: number | 'HUG' | 'FILL';
  cornerRadius?: number;
  fills?: readonly Paint[];
  strokes?: readonly Paint[];
  strokeWeight?: number;
  effects?: readonly Effect[];
  clipsContent?: boolean;
}

/**
 * Create auto-layout frame with options
 */
export function createAutoLayoutFrame(
  name: string,
  options: AutoLayoutOptions = {}
): FrameNode {
  const {
    direction = 'VERTICAL',
    primaryAlign = 'MIN',
    counterAlign = 'MIN',
    padding,
    itemSpacing = 0,
    width,
    height,
    cornerRadius = 0,
    fills = [],
    strokes = [],
    strokeWeight = 0,
    effects = [],
    clipsContent = false,
  } = options;

  const frame = figma.createFrame();
  frame.name = name;

  // Auto-layout settings
  frame.layoutMode = direction;
  frame.primaryAxisAlignItems = primaryAlign;
  frame.counterAxisAlignItems = counterAlign;
  frame.itemSpacing = itemSpacing;

  // Padding
  if (typeof padding === 'number') {
    frame.paddingTop = padding;
    frame.paddingRight = padding;
    frame.paddingBottom = padding;
    frame.paddingLeft = padding;
  } else if (padding) {
    frame.paddingTop = padding.top ?? 0;
    frame.paddingRight = padding.right ?? 0;
    frame.paddingBottom = padding.bottom ?? 0;
    frame.paddingLeft = padding.left ?? 0;
  }

  // Sizing
  if (width === 'HUG') {
    frame.layoutSizingHorizontal = 'HUG';
  } else if (width === 'FILL') {
    frame.layoutSizingHorizontal = 'FILL';
  } else if (typeof width === 'number') {
    frame.resize(width, frame.height);
    frame.layoutSizingHorizontal = 'FIXED';
  }

  if (height === 'HUG') {
    frame.layoutSizingVertical = 'HUG';
  } else if (height === 'FILL') {
    frame.layoutSizingVertical = 'FILL';
  } else if (typeof height === 'number') {
    frame.resize(frame.width, height);
    frame.layoutSizingVertical = 'FIXED';
  }

  // Styling
  frame.cornerRadius = cornerRadius;
  frame.fills = fills as Paint[];
  frame.strokes = strokes as Paint[];
  frame.strokeWeight = strokeWeight;
  frame.effects = effects as Effect[];
  frame.clipsContent = clipsContent;

  return frame;
}

/**
 * Create a component with auto-layout
 */
export function createComponent(
  name: string,
  options: AutoLayoutOptions = {}
): ComponentNode {
  const frame = createAutoLayoutFrame(name, options);

  // Convert to component
  const component = figma.createComponent();
  component.name = name;
  component.resize(frame.width, frame.height);

  // Copy properties
  component.layoutMode = frame.layoutMode;
  component.primaryAxisAlignItems = frame.primaryAxisAlignItems;
  component.counterAxisAlignItems = frame.counterAxisAlignItems;
  component.itemSpacing = frame.itemSpacing;
  component.paddingTop = frame.paddingTop;
  component.paddingRight = frame.paddingRight;
  component.paddingBottom = frame.paddingBottom;
  component.paddingLeft = frame.paddingLeft;
  component.layoutSizingHorizontal = frame.layoutSizingHorizontal;
  component.layoutSizingVertical = frame.layoutSizingVertical;
  component.cornerRadius = frame.cornerRadius;
  component.fills = frame.fills;
  component.strokes = frame.strokes;
  component.strokeWeight = frame.strokeWeight;
  component.effects = frame.effects;
  component.clipsContent = frame.clipsContent;

  // Remove the temporary frame
  frame.remove();

  return component;
}

/**
 * Create drop shadow effect
 */
export function createDropShadow(
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: RGBA
): DropShadowEffect {
  return {
    type: 'DROP_SHADOW',
    color,
    offset: { x, y },
    radius: blur,
    spread,
    visible: true,
    blendMode: 'NORMAL',
  };
}

/**
 * Create inner shadow effect
 */
export function createInnerShadow(
  x: number,
  y: number,
  blur: number,
  spread: number,
  color: RGBA
): InnerShadowEffect {
  return {
    type: 'INNER_SHADOW',
    color,
    offset: { x, y },
    radius: blur,
    spread,
    visible: true,
    blendMode: 'NORMAL',
  };
}

/**
 * Parse shadow string to effect
 */
export function parseShadow(shadow: string): DropShadowEffect | null {
  if (shadow === 'none') return null;

  // Parse: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
  const match = shadow.match(
    /(-?\d+)(?:px)?\s+(-?\d+)(?:px)?\s+(-?\d+)(?:px)?\s*(-?\d+)?(?:px)?\s+rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/
  );

  if (!match) return null;

  return {
    type: 'DROP_SHADOW',
    color: {
      r: parseInt(match[5]) / 255,
      g: parseInt(match[6]) / 255,
      b: parseInt(match[7]) / 255,
      a: match[8] ? parseFloat(match[8]) : 1,
    },
    offset: {
      x: parseInt(match[1]),
      y: parseInt(match[2]),
    },
    radius: parseInt(match[3]),
    spread: match[4] ? parseInt(match[4]) : 0,
    visible: true,
    blendMode: 'NORMAL',
  };
}

/**
 * Parse multiple shadows
 */
export function parseShadows(shadowString: string): Effect[] {
  if (shadowString === 'none') return [];

  const effects: Effect[] = [];
  const shadows = shadowString.split(/,\s*(?=\d)/);

  for (const shadow of shadows) {
    const effect = parseShadow(shadow.trim());
    if (effect) {
      effects.push(effect);
    }
  }

  return effects;
}

/**
 * Append child to parent and set layout sizing
 * This must be done after appendChild because layoutSizing only works on children of auto-layout frames
 */
export function appendWithLayout(
  parent: FrameNode | ComponentNode,
  child: SceneNode,
  sizing?: { horizontal?: 'HUG' | 'FILL' | 'FIXED'; vertical?: 'HUG' | 'FILL' | 'FIXED' }
): void {
  parent.appendChild(child);

  // Only set layout sizing if parent has auto-layout and child supports it
  if (parent.layoutMode !== 'NONE' && 'layoutSizingHorizontal' in child) {
    if (sizing?.horizontal) {
      (child as FrameNode | TextNode).layoutSizingHorizontal = sizing.horizontal;
    }
    if (sizing?.vertical) {
      (child as FrameNode | TextNode).layoutSizingVertical = sizing.vertical;
    }
  }
}
