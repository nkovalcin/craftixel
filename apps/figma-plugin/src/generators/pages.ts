// ============================================
// PAGE GENERATOR
// Full Landing Page
// ============================================

import type { DesignTokens, ContentTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';
import { createAutoLayoutFrame } from '../utils/layout';

/**
 * Generate complete pages
 */
export async function generatePages(
  tokens: DesignTokens,
  content: ContentTokens,
  projectName: string
): Promise<void> {
  // Create Pages page
  let pagesPage = figma.root.children.find((p) => p.name === 'Pages') as PageNode;
  if (!pagesPage) {
    pagesPage = figma.createPage();
    pagesPage.name = 'Pages';
  }
  figma.currentPage = pagesPage;

  await generateLandingPage(tokens, content, projectName);

  figma.notify('Pages created!');
}

/**
 * Generate complete landing page
 */
async function generateLandingPage(
  tokens: DesignTokens,
  content: ContentTokens,
  projectName: string
): Promise<void> {
  const page = createAutoLayoutFrame(`${projectName} - Landing Page`, {
    direction: 'VERTICAL',
    width: 1440,
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.background.primary)],
  });

  // Header
  const header = await createHeader(tokens, content);
  page.appendChild(header);

  // Generate sections based on content
  for (const section of content.sections.filter((s) => s.enabled).sort((a, b) => a.order - b.order)) {
    let sectionFrame: FrameNode | null = null;

    switch (section.type) {
      case 'hero':
        sectionFrame = await createHeroSection(tokens, section);
        break;
      case 'features':
        sectionFrame = await createFeaturesSection(tokens, section);
        break;
      case 'problem':
      case 'solution':
        sectionFrame = await createTextSection(tokens, section);
        break;
      case 'cta':
        sectionFrame = await createCTASection(tokens, section);
        break;
      default:
        sectionFrame = await createTextSection(tokens, section);
    }

    if (sectionFrame) {
      page.appendChild(sectionFrame);
    }
  }

  // Footer
  const footer = await createFooter(tokens, content);
  page.appendChild(footer);

  page.x = 0;
  page.y = 0;
}

/**
 * Create Header
 */
async function createHeader(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<FrameNode> {
  const header = createAutoLayoutFrame('Header', {
    direction: 'HORIZONTAL',
    primaryAlign: 'SPACE_BETWEEN',
    counterAlign: 'CENTER',
    padding: { top: 16, right: 64, bottom: 16, left: 64 },
    width: 'FILL',
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.background.primary)],
    strokes: [createSolidPaint(tokens.colors.border.light)],
    strokeWeight: 1,
  });

  // Logo
  const logo = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
  });

  // Nav
  const nav = createAutoLayoutFrame('Nav', {
    direction: 'HORIZONTAL',
    itemSpacing: 32,
    width: 'HUG',
    height: 'HUG',
  });

  for (const item of ['Features', 'Pricing', 'About']) {
    const navText = await createText(item, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: 14,
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.text.secondary,
    });
    nav.appendChild(navText);
  }

  // CTA
  const ctaBtn = createAutoLayoutFrame('CTA', {
    direction: 'HORIZONTAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 8, right: 16, bottom: 8, left: 16 },
    cornerRadius: parseSize(tokens.effects.borderRadius.lg),
    fills: [createSolidPaint(tokens.colors.primary[500])],
    width: 'HUG',
    height: 'HUG',
  });

  const ctaText = await createText(content.microcopy.buttons.getStarted || 'Get Started', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: 14,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.inverse,
  });
  ctaBtn.appendChild(ctaText);

  header.appendChild(logo);
  header.appendChild(nav);
  header.appendChild(ctaBtn);

  return header;
}

/**
 * Create Hero Section
 */
async function createHeroSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const hero = createAutoLayoutFrame('Hero', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 120, right: 64, bottom: 120, left: 64 },
    itemSpacing: 24,
    width: 'FILL',
    height: 'HUG',
  });

  // Content
  const content = createAutoLayoutFrame('Content', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 24,
    width: 800,
    height: 'HUG',
  });

  // Headline
  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['5xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
    lineHeight: tokens.typography.fontSize['5xl'].lineHeight,
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  headline.layoutSizingHorizontal = 'FILL';

  content.appendChild(headline);

  // Subheadline
  if (section.subheadline) {
    const subheadline = await createText(section.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.xl.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
      lineHeight: tokens.typography.fontSize.xl.lineHeight,
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    subheadline.layoutSizingHorizontal = 'FILL';
    content.appendChild(subheadline);
  }

  // CTAs
  if (section.cta) {
    const ctaContainer = createAutoLayoutFrame('CTAs', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      itemSpacing: 16,
      width: 'HUG',
      height: 'HUG',
    });

    const primaryBtn = createAutoLayoutFrame('Primary', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      padding: { top: 16, right: 32, bottom: 16, left: 32 },
      cornerRadius: parseSize(tokens.effects.borderRadius.lg),
      fills: [createSolidPaint(tokens.colors.primary[500])],
      width: 'HUG',
      height: 'HUG',
    });
    const primaryText = await createText(section.cta.primary, {
      fontSize: 16,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.text.inverse,
    });
    primaryBtn.appendChild(primaryText);
    ctaContainer.appendChild(primaryBtn);

    if (section.cta.secondary) {
      const secondaryBtn = createAutoLayoutFrame('Secondary', {
        direction: 'HORIZONTAL',
        primaryAlign: 'CENTER',
        counterAlign: 'CENTER',
        padding: { top: 16, right: 32, bottom: 16, left: 32 },
        cornerRadius: parseSize(tokens.effects.borderRadius.lg),
        strokes: [createSolidPaint(tokens.colors.border.medium)],
        strokeWeight: 1,
        width: 'HUG',
        height: 'HUG',
      });
      const secondaryText = await createText(section.cta.secondary, {
        fontSize: 16,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.secondary,
      });
      secondaryBtn.appendChild(secondaryText);
      ctaContainer.appendChild(secondaryBtn);
    }

    content.appendChild(ctaContainer);
  }

  hero.appendChild(content);
  return hero;
}

/**
 * Create Features Section
 */
async function createFeaturesSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const features = createAutoLayoutFrame('Features', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 96, right: 64, bottom: 96, left: 64 },
    itemSpacing: 48,
    width: 'FILL',
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.neutral[50])],
  });

  // Header
  const header = createAutoLayoutFrame('Header', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 12,
    width: 600,
    height: 'HUG',
  });

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['4xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  headline.layoutSizingHorizontal = 'FILL';
  header.appendChild(headline);

  if (section.subheadline) {
    const subheadline = await createText(section.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    subheadline.layoutSizingHorizontal = 'FILL';
    header.appendChild(subheadline);
  }

  features.appendChild(header);

  // Grid
  if (section.items && section.items.length > 0) {
    const grid = createAutoLayoutFrame('Grid', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      itemSpacing: 32,
      width: 'HUG',
      height: 'HUG',
    });

    for (const item of section.items.slice(0, 3)) {
      const card = createAutoLayoutFrame(`Feature`, {
        direction: 'VERTICAL',
        itemSpacing: 12,
        padding: 24,
        width: 320,
        height: 'HUG',
        cornerRadius: parseSize(tokens.effects.borderRadius.xl),
        fills: [createSolidPaint(tokens.colors.background.primary)],
      });

      // Icon
      const icon = createAutoLayoutFrame('Icon', {
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
      icon.appendChild(iconText);

      const title = await createText(item.title, {
        fontFamily: tokens.typography.fontFamily.heading,
        fontSize: parseSize(tokens.typography.fontSize.lg.size),
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.text.primary,
      });
      title.layoutSizingHorizontal = 'FILL';

      const desc = await createText(item.description, {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: parseSize(tokens.typography.fontSize.base.size),
        color: tokens.colors.text.secondary,
        lineHeight: 1.6,
      });
      desc.layoutSizingHorizontal = 'FILL';

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      grid.appendChild(card);
    }

    features.appendChild(grid);
  }

  return features;
}

/**
 * Create Text Section (Problem/Solution/etc)
 */
async function createTextSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const textSection = createAutoLayoutFrame(section.type, {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 96, right: 64, bottom: 96, left: 64 },
    itemSpacing: 24,
    width: 'FILL',
    height: 'HUG',
  });

  const content = createAutoLayoutFrame('Content', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 16,
    width: 700,
    height: 'HUG',
  });

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['3xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  headline.layoutSizingHorizontal = 'FILL';

  content.appendChild(headline);

  if (section.body) {
    const body = await createText(section.body, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
      lineHeight: 1.7,
    });
    body.textAutoResize = 'WIDTH_AND_HEIGHT';
    body.layoutSizingHorizontal = 'FILL';
    content.appendChild(body);
  }

  textSection.appendChild(content);
  return textSection;
}

/**
 * Create CTA Section
 */
async function createCTASection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const cta = createAutoLayoutFrame('CTA', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 96, right: 64, bottom: 96, left: 64 },
    itemSpacing: 24,
    width: 'FILL',
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.primary[500])],
  });

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['3xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.inverse,
    textAlign: 'CENTER',
  });

  cta.appendChild(headline);

  if (section.cta) {
    const btn = createAutoLayoutFrame('Button', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      padding: { top: 16, right: 32, bottom: 16, left: 32 },
      cornerRadius: parseSize(tokens.effects.borderRadius.lg),
      fills: [createSolidPaint(tokens.colors.background.primary)],
      width: 'HUG',
      height: 'HUG',
    });
    const btnText = await createText(section.cta.primary, {
      fontSize: 16,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.primary[600],
    });
    btn.appendChild(btnText);
    cta.appendChild(btn);
  }

  return cta;
}

/**
 * Create Footer
 */
async function createFooter(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<FrameNode> {
  const footer = createAutoLayoutFrame('Footer', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 48, right: 64, bottom: 48, left: 64 },
    itemSpacing: 16,
    width: 'FILL',
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.neutral[900])],
  });

  const brand = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 20,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.inverse,
  });

  const copyright = await createText(
    content.microcopy.meta.copyright || `© ${new Date().getFullYear()} ${content.brand.name}`,
    {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: 14,
      color: tokens.colors.neutral[400],
    }
  );

  footer.appendChild(brand);
  footer.appendChild(copyright);

  return footer;
}
