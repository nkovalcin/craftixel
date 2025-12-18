// ============================================
// PAGE GENERATOR
// Full Landing Page
// ============================================

import type { DesignTokens, ContentTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';

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
  await figma.setCurrentPageAsync(pagesPage);

  await generateLandingPage(tokens, content, projectName);

  figma.notify('Pages created!');
}

/**
 * Create auto-layout frame helper
 */
function createAutoFrame(name: string, direction: 'HORIZONTAL' | 'VERTICAL' = 'VERTICAL'): FrameNode {
  const frame = figma.createFrame();
  frame.name = name;
  frame.layoutMode = direction;
  frame.fills = [];
  return frame;
}

/**
 * Generate complete landing page
 */
async function generateLandingPage(
  tokens: DesignTokens,
  content: ContentTokens,
  projectName: string
): Promise<void> {
  const page = createAutoFrame(`${projectName} - Landing Page`);
  page.resize(1440, page.height);
  page.fills = [createSolidPaint(tokens.colors.background.primary)];

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
      case 'howItWorks':
        sectionFrame = await createHowItWorksSection(tokens, section);
        break;
      case 'cta':
        sectionFrame = await createCTASection(tokens, section);
        break;
      default:
        sectionFrame = await createTextSection(tokens, section);
    }

    if (sectionFrame) {
      page.appendChild(sectionFrame);
      sectionFrame.layoutSizingHorizontal = 'FILL';
      sectionFrame.layoutSizingVertical = 'HUG';
    }
  }

  // Footer
  const footer = await createFooter(tokens, content);
  page.appendChild(footer);

  // Set page sizing
  page.layoutSizingHorizontal = 'FIXED';
  page.layoutSizingVertical = 'HUG';
  header.layoutSizingHorizontal = 'FILL';
  header.layoutSizingVertical = 'HUG';
  footer.layoutSizingHorizontal = 'FILL';
  footer.layoutSizingVertical = 'HUG';

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
  const header = createAutoFrame('Header', 'HORIZONTAL');
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  header.counterAxisAlignItems = 'CENTER';
  header.paddingTop = 16;
  header.paddingRight = 64;
  header.paddingBottom = 16;
  header.paddingLeft = 64;
  header.fills = [createSolidPaint(tokens.colors.background.primary)];
  header.strokes = [createSolidPaint(tokens.colors.border.light)];
  header.strokeWeight = 1;

  // Logo
  const logo = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
  });

  // Nav
  const nav = createAutoFrame('Nav', 'HORIZONTAL');
  nav.itemSpacing = 32;

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
  const ctaBtn = createAutoFrame('CTA', 'HORIZONTAL');
  ctaBtn.primaryAxisAlignItems = 'CENTER';
  ctaBtn.counterAxisAlignItems = 'CENTER';
  ctaBtn.paddingTop = 8;
  ctaBtn.paddingRight = 16;
  ctaBtn.paddingBottom = 8;
  ctaBtn.paddingLeft = 16;
  ctaBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
  ctaBtn.fills = [createSolidPaint(tokens.colors.primary[500])];

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

  // Set sizing after appendChild
  nav.layoutSizingHorizontal = 'HUG';
  nav.layoutSizingVertical = 'HUG';
  ctaBtn.layoutSizingHorizontal = 'HUG';
  ctaBtn.layoutSizingVertical = 'HUG';

  return header;
}

/**
 * Create Hero Section
 */
async function createHeroSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const hero = createAutoFrame('Hero');
  hero.primaryAxisAlignItems = 'CENTER';
  hero.counterAxisAlignItems = 'CENTER';
  hero.paddingTop = 120;
  hero.paddingRight = 64;
  hero.paddingBottom = 120;
  hero.paddingLeft = 64;
  hero.itemSpacing = 24;

  // Content
  const content = createAutoFrame('Content');
  content.primaryAxisAlignItems = 'CENTER';
  content.counterAxisAlignItems = 'CENTER';
  content.itemSpacing = 24;
  content.resize(800, content.height);

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
    content.appendChild(subheadline);
    subheadline.layoutSizingHorizontal = 'FILL';
  }

  // CTAs
  if (section.cta) {
    const ctaContainer = createAutoFrame('CTAs', 'HORIZONTAL');
    ctaContainer.primaryAxisAlignItems = 'CENTER';
    ctaContainer.itemSpacing = 16;

    const primaryBtn = createAutoFrame('Primary', 'HORIZONTAL');
    primaryBtn.primaryAxisAlignItems = 'CENTER';
    primaryBtn.counterAxisAlignItems = 'CENTER';
    primaryBtn.paddingTop = 16;
    primaryBtn.paddingRight = 32;
    primaryBtn.paddingBottom = 16;
    primaryBtn.paddingLeft = 32;
    primaryBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
    primaryBtn.fills = [createSolidPaint(tokens.colors.primary[500])];

    const primaryText = await createText(section.cta.primary, {
      fontSize: 16,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.text.inverse,
    });
    primaryBtn.appendChild(primaryText);
    ctaContainer.appendChild(primaryBtn);

    if (section.cta.secondary) {
      const secondaryBtn = createAutoFrame('Secondary', 'HORIZONTAL');
      secondaryBtn.primaryAxisAlignItems = 'CENTER';
      secondaryBtn.counterAxisAlignItems = 'CENTER';
      secondaryBtn.paddingTop = 16;
      secondaryBtn.paddingRight = 32;
      secondaryBtn.paddingBottom = 16;
      secondaryBtn.paddingLeft = 32;
      secondaryBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
      secondaryBtn.strokes = [createSolidPaint(tokens.colors.border.medium)];
      secondaryBtn.strokeWeight = 1;

      const secondaryText = await createText(section.cta.secondary, {
        fontSize: 16,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.secondary,
      });
      secondaryBtn.appendChild(secondaryText);
      ctaContainer.appendChild(secondaryBtn);

      secondaryBtn.layoutSizingHorizontal = 'HUG';
      secondaryBtn.layoutSizingVertical = 'HUG';
    }

    content.appendChild(ctaContainer);

    primaryBtn.layoutSizingHorizontal = 'HUG';
    primaryBtn.layoutSizingVertical = 'HUG';
    ctaContainer.layoutSizingHorizontal = 'HUG';
    ctaContainer.layoutSizingVertical = 'HUG';
  }

  hero.appendChild(content);

  // Set sizing after appendChild
  content.layoutSizingHorizontal = 'FIXED';
  content.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';

  return hero;
}

/**
 * Create Features Section
 */
async function createFeaturesSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const features = createAutoFrame('Features');
  features.primaryAxisAlignItems = 'CENTER';
  features.counterAxisAlignItems = 'CENTER';
  features.paddingTop = 96;
  features.paddingRight = 64;
  features.paddingBottom = 96;
  features.paddingLeft = 64;
  features.itemSpacing = 48;
  features.fills = [createSolidPaint(tokens.colors.neutral[50])];

  // Header
  const header = createAutoFrame('Header');
  header.primaryAxisAlignItems = 'CENTER';
  header.counterAxisAlignItems = 'CENTER';
  header.itemSpacing = 12;
  header.resize(600, header.height);

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['4xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  header.appendChild(headline);

  if (section.subheadline) {
    const subheadline = await createText(section.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    header.appendChild(subheadline);
    subheadline.layoutSizingHorizontal = 'FILL';
  }

  features.appendChild(header);

  // Grid
  if (section.items && section.items.length > 0) {
    const grid = createAutoFrame('Grid', 'HORIZONTAL');
    grid.primaryAxisAlignItems = 'CENTER';
    grid.itemSpacing = 32;

    for (const item of section.items.slice(0, 3)) {
      const card = createAutoFrame('Feature');
      card.itemSpacing = 12;
      card.paddingTop = 24;
      card.paddingRight = 24;
      card.paddingBottom = 24;
      card.paddingLeft = 24;
      card.resize(320, card.height);
      card.cornerRadius = parseSize(tokens.effects.borderRadius.xl);
      card.fills = [createSolidPaint(tokens.colors.background.primary)];

      // Icon
      const icon = createAutoFrame('Icon', 'HORIZONTAL');
      icon.primaryAxisAlignItems = 'CENTER';
      icon.counterAxisAlignItems = 'CENTER';
      icon.resize(48, 48);
      icon.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
      icon.fills = [createSolidPaint(tokens.colors.primary[50])];

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

      const desc = await createText(item.description, {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: parseSize(tokens.typography.fontSize.base.size),
        color: tokens.colors.text.secondary,
        lineHeight: 1.6,
      });

      card.appendChild(icon);
      card.appendChild(title);
      card.appendChild(desc);
      grid.appendChild(card);

      // Set sizing after appendChild
      card.layoutSizingHorizontal = 'FIXED';
      card.layoutSizingVertical = 'HUG';
      icon.layoutSizingHorizontal = 'HUG';
      icon.layoutSizingVertical = 'HUG';
      title.layoutSizingHorizontal = 'FILL';
      desc.layoutSizingHorizontal = 'FILL';
    }

    features.appendChild(grid);

    grid.layoutSizingHorizontal = 'HUG';
    grid.layoutSizingVertical = 'HUG';
  }

  // Set sizing after appendChild
  header.layoutSizingHorizontal = 'FIXED';
  header.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';

  return features;
}

/**
 * Create How It Works Section
 */
async function createHowItWorksSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const howItWorks = createAutoFrame('HowItWorks');
  howItWorks.primaryAxisAlignItems = 'CENTER';
  howItWorks.counterAxisAlignItems = 'CENTER';
  howItWorks.paddingTop = 96;
  howItWorks.paddingRight = 64;
  howItWorks.paddingBottom = 96;
  howItWorks.paddingLeft = 64;
  howItWorks.itemSpacing = 48;

  // Header
  const header = createAutoFrame('Header');
  header.primaryAxisAlignItems = 'CENTER';
  header.counterAxisAlignItems = 'CENTER';
  header.itemSpacing = 12;
  header.resize(600, header.height);

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['4xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  header.appendChild(headline);

  if (section.subheadline) {
    const subheadline = await createText(section.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    header.appendChild(subheadline);
    subheadline.layoutSizingHorizontal = 'FILL';
  }

  howItWorks.appendChild(header);

  // Steps
  if (section.items && section.items.length > 0) {
    const steps = createAutoFrame('Steps', 'HORIZONTAL');
    steps.primaryAxisAlignItems = 'MIN';
    steps.itemSpacing = 48;

    let stepNumber = 1;
    for (const item of section.items.slice(0, 3)) {
      const step = createAutoFrame('Step');
      step.primaryAxisAlignItems = 'CENTER';
      step.counterAxisAlignItems = 'CENTER';
      step.itemSpacing = 16;
      step.resize(280, step.height);

      // Step number
      const numberFrame = createAutoFrame('Number', 'HORIZONTAL');
      numberFrame.primaryAxisAlignItems = 'CENTER';
      numberFrame.counterAxisAlignItems = 'CENTER';
      numberFrame.resize(48, 48);
      numberFrame.cornerRadius = 24;
      numberFrame.fills = [createSolidPaint(tokens.colors.primary[500])];

      const numberText = await createText(String(stepNumber), {
        fontSize: 20,
        fontWeight: tokens.typography.fontWeight.bold,
        color: tokens.colors.text.inverse,
      });
      numberFrame.appendChild(numberText);

      const title = await createText(item.title, {
        fontFamily: tokens.typography.fontFamily.heading,
        fontSize: parseSize(tokens.typography.fontSize.lg.size),
        fontWeight: tokens.typography.fontWeight.semibold,
        color: tokens.colors.text.primary,
        textAlign: 'CENTER',
      });

      const desc = await createText(item.description, {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: parseSize(tokens.typography.fontSize.base.size),
        color: tokens.colors.text.secondary,
        textAlign: 'CENTER',
        lineHeight: 1.6,
      });

      step.appendChild(numberFrame);
      step.appendChild(title);
      step.appendChild(desc);
      steps.appendChild(step);

      // Set sizing after appendChild
      step.layoutSizingHorizontal = 'FIXED';
      step.layoutSizingVertical = 'HUG';
      numberFrame.layoutSizingHorizontal = 'HUG';
      numberFrame.layoutSizingVertical = 'HUG';
      title.layoutSizingHorizontal = 'FILL';
      desc.layoutSizingHorizontal = 'FILL';

      stepNumber++;
    }

    howItWorks.appendChild(steps);

    steps.layoutSizingHorizontal = 'HUG';
    steps.layoutSizingVertical = 'HUG';
  }

  // Set sizing after appendChild
  header.layoutSizingHorizontal = 'FIXED';
  header.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';

  return howItWorks;
}

/**
 * Create Text Section
 */
async function createTextSection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const textSection = createAutoFrame(section.type);
  textSection.primaryAxisAlignItems = 'CENTER';
  textSection.counterAxisAlignItems = 'CENTER';
  textSection.paddingTop = 96;
  textSection.paddingRight = 64;
  textSection.paddingBottom = 96;
  textSection.paddingLeft = 64;
  textSection.itemSpacing = 24;

  const content = createAutoFrame('Content');
  content.primaryAxisAlignItems = 'CENTER';
  content.counterAxisAlignItems = 'CENTER';
  content.itemSpacing = 16;
  content.resize(700, content.height);

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['3xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';

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
    content.appendChild(body);
    body.layoutSizingHorizontal = 'FILL';
  }

  textSection.appendChild(content);

  // Set sizing after appendChild
  content.layoutSizingHorizontal = 'FIXED';
  content.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';

  return textSection;
}

/**
 * Create CTA Section
 */
async function createCTASection(
  tokens: DesignTokens,
  section: ContentTokens['sections'][0]
): Promise<FrameNode> {
  const cta = createAutoFrame('CTA');
  cta.primaryAxisAlignItems = 'CENTER';
  cta.counterAxisAlignItems = 'CENTER';
  cta.paddingTop = 96;
  cta.paddingRight = 64;
  cta.paddingBottom = 96;
  cta.paddingLeft = 64;
  cta.itemSpacing = 24;
  cta.fills = [createSolidPaint(tokens.colors.primary[500])];

  const headline = await createText(section.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['3xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.inverse,
    textAlign: 'CENTER',
  });

  cta.appendChild(headline);

  if (section.cta) {
    const btn = createAutoFrame('Button', 'HORIZONTAL');
    btn.primaryAxisAlignItems = 'CENTER';
    btn.counterAxisAlignItems = 'CENTER';
    btn.paddingTop = 16;
    btn.paddingRight = 32;
    btn.paddingBottom = 16;
    btn.paddingLeft = 32;
    btn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
    btn.fills = [createSolidPaint(tokens.colors.background.primary)];

    const btnText = await createText(section.cta.primary, {
      fontSize: 16,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.primary[600],
    });
    btn.appendChild(btnText);
    cta.appendChild(btn);

    btn.layoutSizingHorizontal = 'HUG';
    btn.layoutSizingVertical = 'HUG';
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
  const footer = createAutoFrame('Footer');
  footer.primaryAxisAlignItems = 'CENTER';
  footer.counterAxisAlignItems = 'CENTER';
  footer.paddingTop = 48;
  footer.paddingRight = 64;
  footer.paddingBottom = 48;
  footer.paddingLeft = 64;
  footer.itemSpacing = 16;
  footer.fills = [createSolidPaint(tokens.colors.neutral[900])];

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
