// ============================================
// ORGANISM COMPONENTS GENERATOR
// Header, Footer, Hero, FeaturesGrid
// ============================================

import type { DesignTokens, ContentTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';

/**
 * Generate all organism components
 */
export async function generateOrganisms(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  // Create Organisms page
  let organismsPage = figma.root.children.find(
    (p) => p.name === 'Components/Organisms'
  ) as PageNode;
  if (!organismsPage) {
    organismsPage = figma.createPage();
    organismsPage.name = 'Components/Organisms';
  }
  await figma.setCurrentPageAsync(organismsPage);

  await generateHeaderComponent(tokens, content);
  await generateFooterComponent(tokens, content);
  await generateHeroSection(tokens, content);
  await generateFeaturesSection(tokens, content);

  figma.notify('Organism components created!');
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
 * Generate Header component
 */
async function generateHeaderComponent(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  const header = figma.createComponent();
  header.name = 'Header';

  // Setup auto-layout
  header.layoutMode = 'HORIZONTAL';
  header.primaryAxisAlignItems = 'SPACE_BETWEEN';
  header.counterAxisAlignItems = 'CENTER';
  header.paddingTop = 16;
  header.paddingRight = 64;
  header.paddingBottom = 16;
  header.paddingLeft = 64;
  header.resize(1440, 64);
  header.fills = [createSolidPaint(tokens.colors.background.primary)];
  header.strokes = [createSolidPaint(tokens.colors.border.light)];
  header.strokeWeight = 1;

  // Logo / Brand name
  const logo = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
  });

  // Nav container
  const nav = createAutoFrame('Nav', 'HORIZONTAL');
  nav.itemSpacing = 32;

  const navItems = ['Features', 'Pricing', 'About', 'Contact'];
  for (const item of navItems) {
    const navText = await createText(item, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.sm.size),
      fontWeight: tokens.typography.fontWeight.medium,
      color: tokens.colors.text.secondary,
    });
    nav.appendChild(navText);
  }

  // CTA container
  const ctaContainer = createAutoFrame('CTAs', 'HORIZONTAL');
  ctaContainer.itemSpacing = 12;

  // Login button (ghost)
  const loginBtn = createAutoFrame('LoginBtn', 'HORIZONTAL');
  loginBtn.primaryAxisAlignItems = 'CENTER';
  loginBtn.counterAxisAlignItems = 'CENTER';
  loginBtn.paddingTop = 8;
  loginBtn.paddingRight = 16;
  loginBtn.paddingBottom = 8;
  loginBtn.paddingLeft = 16;
  loginBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);

  const loginText = await createText(content.microcopy.nav.login || 'Log in', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: 14,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.text.secondary,
  });
  loginBtn.appendChild(loginText);

  // Signup button (primary)
  const signupBtn = createAutoFrame('SignupBtn', 'HORIZONTAL');
  signupBtn.primaryAxisAlignItems = 'CENTER';
  signupBtn.counterAxisAlignItems = 'CENTER';
  signupBtn.paddingTop = 8;
  signupBtn.paddingRight = 16;
  signupBtn.paddingBottom = 8;
  signupBtn.paddingLeft = 16;
  signupBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
  signupBtn.fills = [createSolidPaint(tokens.colors.primary[500])];

  const signupText = await createText(content.microcopy.nav.signup || 'Sign up', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: 14,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.inverse,
  });
  signupBtn.appendChild(signupText);

  ctaContainer.appendChild(loginBtn);
  ctaContainer.appendChild(signupBtn);

  // Append all to header
  header.appendChild(logo);
  header.appendChild(nav);
  header.appendChild(ctaContainer);

  // Set sizing after appendChild
  header.layoutSizingHorizontal = 'FIXED';
  header.layoutSizingVertical = 'HUG';
  nav.layoutSizingHorizontal = 'HUG';
  nav.layoutSizingVertical = 'HUG';
  ctaContainer.layoutSizingHorizontal = 'HUG';
  ctaContainer.layoutSizingVertical = 'HUG';
  loginBtn.layoutSizingHorizontal = 'HUG';
  loginBtn.layoutSizingVertical = 'HUG';
  signupBtn.layoutSizingHorizontal = 'HUG';
  signupBtn.layoutSizingVertical = 'HUG';

  header.x = 0;
  header.y = 0;
}

/**
 * Generate Footer component
 */
async function generateFooterComponent(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  const footer = figma.createComponent();
  footer.name = 'Footer';

  // Setup auto-layout
  footer.layoutMode = 'VERTICAL';
  footer.primaryAxisAlignItems = 'CENTER';
  footer.counterAxisAlignItems = 'CENTER';
  footer.paddingTop = 48;
  footer.paddingRight = 64;
  footer.paddingBottom = 48;
  footer.paddingLeft = 64;
  footer.itemSpacing = 24;
  footer.resize(1440, footer.height);
  footer.fills = [createSolidPaint(tokens.colors.neutral[50])];

  // Brand + Description
  const brandSection = createAutoFrame('BrandSection');
  brandSection.primaryAxisAlignItems = 'CENTER';
  brandSection.counterAxisAlignItems = 'CENTER';
  brandSection.itemSpacing = 8;

  const brandName = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 20,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
  });

  const brandTagline = await createText(content.brand.tagline, {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    color: tokens.colors.text.secondary,
  });

  brandSection.appendChild(brandName);
  brandSection.appendChild(brandTagline);

  // Copyright
  const copyright = await createText(
    content.microcopy.meta.copyright || `© ${new Date().getFullYear()} ${content.brand.name}. All rights reserved.`,
    {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.sm.size),
      color: tokens.colors.text.muted,
    }
  );

  footer.appendChild(brandSection);
  footer.appendChild(copyright);

  // Set sizing after appendChild
  footer.layoutSizingHorizontal = 'FIXED';
  footer.layoutSizingVertical = 'HUG';
  brandSection.layoutSizingHorizontal = 'HUG';
  brandSection.layoutSizingVertical = 'HUG';

  footer.x = 0;
  footer.y = 150;
}

/**
 * Generate Hero section
 */
async function generateHeroSection(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  const heroContent = content.sections.find((s) => s.type === 'hero');
  if (!heroContent) return;

  const hero = figma.createComponent();
  hero.name = 'Section/Hero';

  // Setup auto-layout
  hero.layoutMode = 'VERTICAL';
  hero.primaryAxisAlignItems = 'CENTER';
  hero.counterAxisAlignItems = 'CENTER';
  hero.paddingTop = 96;
  hero.paddingRight = 64;
  hero.paddingBottom = 96;
  hero.paddingLeft = 64;
  hero.itemSpacing = 24;
  hero.resize(1440, hero.height);
  hero.fills = [createSolidPaint(tokens.colors.background.primary)];

  // Content container (centered, max-width)
  const contentContainer = createAutoFrame('Content');
  contentContainer.primaryAxisAlignItems = 'CENTER';
  contentContainer.counterAxisAlignItems = 'CENTER';
  contentContainer.itemSpacing = 24;
  contentContainer.resize(800, contentContainer.height);

  // Headline
  const headline = await createText(heroContent.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['5xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    lineHeight: tokens.typography.fontSize['5xl'].lineHeight,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';

  contentContainer.appendChild(headline);

  // Subheadline
  if (heroContent.subheadline) {
    const subheadline = await createText(heroContent.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.xl.size),
      fontWeight: tokens.typography.fontWeight.normal,
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.xl.lineHeight,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    contentContainer.appendChild(subheadline);
    subheadline.layoutSizingHorizontal = 'FILL';
  }

  // CTA buttons
  if (heroContent.cta) {
    const ctaContainer = createAutoFrame('CTAs', 'HORIZONTAL');
    ctaContainer.primaryAxisAlignItems = 'CENTER';
    ctaContainer.itemSpacing = 16;

    // Primary CTA
    const primaryBtn = createAutoFrame('PrimaryBtn', 'HORIZONTAL');
    primaryBtn.primaryAxisAlignItems = 'CENTER';
    primaryBtn.counterAxisAlignItems = 'CENTER';
    primaryBtn.paddingTop = 14;
    primaryBtn.paddingRight = 28;
    primaryBtn.paddingBottom = 14;
    primaryBtn.paddingLeft = 28;
    primaryBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
    primaryBtn.fills = [createSolidPaint(tokens.colors.primary[500])];

    const primaryText = await createText(heroContent.cta.primary, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: 16,
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.text.inverse,
    });
    primaryBtn.appendChild(primaryText);
    ctaContainer.appendChild(primaryBtn);

    // Secondary CTA
    if (heroContent.cta.secondary) {
      const secondaryBtn = createAutoFrame('SecondaryBtn', 'HORIZONTAL');
      secondaryBtn.primaryAxisAlignItems = 'CENTER';
      secondaryBtn.counterAxisAlignItems = 'CENTER';
      secondaryBtn.paddingTop = 14;
      secondaryBtn.paddingRight = 28;
      secondaryBtn.paddingBottom = 14;
      secondaryBtn.paddingLeft = 28;
      secondaryBtn.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
      secondaryBtn.strokes = [createSolidPaint(tokens.colors.border.medium)];
      secondaryBtn.strokeWeight = 1;

      const secondaryText = await createText(heroContent.cta.secondary, {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: 16,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.secondary,
      });
      secondaryBtn.appendChild(secondaryText);
      ctaContainer.appendChild(secondaryBtn);

      secondaryBtn.layoutSizingHorizontal = 'HUG';
      secondaryBtn.layoutSizingVertical = 'HUG';
    }

    contentContainer.appendChild(ctaContainer);

    primaryBtn.layoutSizingHorizontal = 'HUG';
    primaryBtn.layoutSizingVertical = 'HUG';
    ctaContainer.layoutSizingHorizontal = 'HUG';
    ctaContainer.layoutSizingVertical = 'HUG';
  }

  hero.appendChild(contentContainer);

  // Set sizing after appendChild
  hero.layoutSizingHorizontal = 'FIXED';
  hero.layoutSizingVertical = 'HUG';
  contentContainer.layoutSizingHorizontal = 'FIXED';
  contentContainer.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';

  hero.x = 0;
  hero.y = 400;
}

/**
 * Generate Features section
 */
async function generateFeaturesSection(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  const featuresContent = content.sections.find((s) => s.type === 'features');
  if (!featuresContent || !featuresContent.items) return;

  const features = figma.createComponent();
  features.name = 'Section/Features';

  // Setup auto-layout
  features.layoutMode = 'VERTICAL';
  features.primaryAxisAlignItems = 'CENTER';
  features.counterAxisAlignItems = 'CENTER';
  features.paddingTop = 96;
  features.paddingRight = 64;
  features.paddingBottom = 96;
  features.paddingLeft = 64;
  features.itemSpacing = 48;
  features.resize(1440, features.height);
  features.fills = [createSolidPaint(tokens.colors.neutral[50])];

  // Section header
  const header = createAutoFrame('Header');
  header.primaryAxisAlignItems = 'CENTER';
  header.counterAxisAlignItems = 'CENTER';
  header.itemSpacing = 12;
  header.resize(600, header.height);

  const headline = await createText(featuresContent.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['4xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  header.appendChild(headline);

  if (featuresContent.subheadline) {
    const subheadline = await createText(featuresContent.subheadline, {
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

  // Features grid
  const grid = createAutoFrame('Grid', 'HORIZONTAL');
  grid.primaryAxisAlignItems = 'CENTER';
  grid.itemSpacing = 32;

  for (const item of featuresContent.items.slice(0, 3)) {
    const featureCard = createAutoFrame(`Feature/${item.id}`);
    featureCard.itemSpacing = 12;
    featureCard.paddingTop = 24;
    featureCard.paddingRight = 24;
    featureCard.paddingBottom = 24;
    featureCard.paddingLeft = 24;
    featureCard.resize(320, featureCard.height);
    featureCard.cornerRadius = parseSize(tokens.effects.borderRadius.xl);
    featureCard.fills = [createSolidPaint(tokens.colors.background.primary)];

    // Icon
    const iconFrame = createAutoFrame('Icon', 'HORIZONTAL');
    iconFrame.primaryAxisAlignItems = 'CENTER';
    iconFrame.counterAxisAlignItems = 'CENTER';
    iconFrame.resize(48, 48);
    iconFrame.cornerRadius = parseSize(tokens.effects.borderRadius.lg);
    iconFrame.fills = [createSolidPaint(tokens.colors.primary[50])];

    const icon = await createText('✦', {
      fontSize: 24,
      color: tokens.colors.primary[500],
    });
    iconFrame.appendChild(icon);

    // Title
    const title = await createText(item.title, {
      fontFamily: tokens.typography.fontFamily.heading,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      fontWeight: tokens.typography.fontWeight.semibold,
      color: tokens.colors.text.primary,
    });

    // Description
    const description = await createText(item.description, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.base.lineHeight,
    });

    featureCard.appendChild(iconFrame);
    featureCard.appendChild(title);
    featureCard.appendChild(description);

    // Set sizing after appendChild
    featureCard.layoutSizingHorizontal = 'FIXED';
    featureCard.layoutSizingVertical = 'HUG';
    iconFrame.layoutSizingHorizontal = 'HUG';
    iconFrame.layoutSizingVertical = 'HUG';
    title.layoutSizingHorizontal = 'FILL';
    description.layoutSizingHorizontal = 'FILL';

    grid.appendChild(featureCard);
  }

  features.appendChild(grid);

  // Set sizing after appendChild
  features.layoutSizingHorizontal = 'FIXED';
  features.layoutSizingVertical = 'HUG';
  header.layoutSizingHorizontal = 'FIXED';
  header.layoutSizingVertical = 'HUG';
  headline.layoutSizingHorizontal = 'FILL';
  grid.layoutSizingHorizontal = 'HUG';
  grid.layoutSizingVertical = 'HUG';

  features.x = 0;
  features.y = 900;
}
