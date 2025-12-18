// ============================================
// ORGANISM COMPONENTS GENERATOR
// Header, Footer, Hero, FeaturesGrid
// ============================================

import type { DesignTokens, ContentTokens } from '../types';
import { createSolidPaint } from '../utils/colors';
import { createText, parseSize } from '../utils/typography';
import { createComponent, createAutoLayoutFrame } from '../utils/layout';

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
 * Generate Header component
 */
async function generateHeaderComponent(
  tokens: DesignTokens,
  content: ContentTokens
): Promise<void> {
  const header = createComponent('Header', {
    direction: 'HORIZONTAL',
    primaryAlign: 'SPACE_BETWEEN',
    counterAlign: 'CENTER',
    padding: { top: 16, right: 64, bottom: 16, left: 64 },
    width: 1440,
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.background.primary)],
    strokes: [createSolidPaint(tokens.colors.border.light)],
    strokeWeight: 1,
  });

  // Logo / Brand name
  const logo = await createText(content.brand.name, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: 24,
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
  });

  // Nav container
  const nav = createAutoLayoutFrame('Nav', {
    direction: 'HORIZONTAL',
    itemSpacing: 32,
    width: 'HUG',
    height: 'HUG',
  });

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
  const ctaContainer = createAutoLayoutFrame('CTAs', {
    direction: 'HORIZONTAL',
    itemSpacing: 12,
    width: 'HUG',
    height: 'HUG',
  });

  // Login button (ghost)
  const loginBtn = createAutoLayoutFrame('LoginBtn', {
    direction: 'HORIZONTAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 8, right: 16, bottom: 8, left: 16 },
    cornerRadius: parseSize(tokens.effects.borderRadius.lg),
    width: 'HUG',
    height: 'HUG',
  });
  const loginText = await createText(content.microcopy.nav.login || 'Log in', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: 14,
    fontWeight: tokens.typography.fontWeight.medium,
    color: tokens.colors.text.secondary,
  });
  loginBtn.appendChild(loginText);

  // Signup button (primary)
  const signupBtn = createAutoLayoutFrame('SignupBtn', {
    direction: 'HORIZONTAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 8, right: 16, bottom: 8, left: 16 },
    cornerRadius: parseSize(tokens.effects.borderRadius.lg),
    fills: [createSolidPaint(tokens.colors.primary[500])],
    width: 'HUG',
    height: 'HUG',
  });
  const signupText = await createText(content.microcopy.nav.signup || 'Sign up', {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: 14,
    fontWeight: tokens.typography.fontWeight.semibold,
    color: tokens.colors.text.inverse,
  });
  signupBtn.appendChild(signupText);

  ctaContainer.appendChild(loginBtn);
  ctaContainer.appendChild(signupBtn);

  header.appendChild(logo);
  header.appendChild(nav);
  header.appendChild(ctaContainer);

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
  const footer = createComponent('Footer', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 48, right: 64, bottom: 48, left: 64 },
    itemSpacing: 24,
    width: 1440,
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.neutral[50])],
  });

  // Brand + Description
  const brandSection = createAutoLayoutFrame('BrandSection', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 8,
    width: 'HUG',
    height: 'HUG',
  });

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
  const copyright = await createText(content.microcopy.meta.copyright || `© ${new Date().getFullYear()} ${content.brand.name}. All rights reserved.`, {
    fontFamily: tokens.typography.fontFamily.body,
    fontSize: parseSize(tokens.typography.fontSize.sm.size),
    color: tokens.colors.text.muted,
  });

  footer.appendChild(brandSection);
  footer.appendChild(copyright);

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

  const hero = createComponent('Section/Hero', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 96, right: 64, bottom: 96, left: 64 },
    itemSpacing: 24,
    width: 1440,
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.background.primary)],
  });

  // Content container (centered, max-width)
  const contentContainer = createAutoLayoutFrame('Content', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 24,
    width: 800,
    height: 'HUG',
  });

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
  headline.layoutSizingHorizontal = 'FILL';

  // Subheadline
  if (heroContent.subheadline) {
    const subheadline = await createText(heroContent.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.xl.size),
      fontWeight: tokens.typography.fontWeight.regular,
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.xl.lineHeight,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    subheadline.layoutSizingHorizontal = 'FILL';
    contentContainer.appendChild(subheadline);
  }

  // CTA buttons
  if (heroContent.cta) {
    const ctaContainer = createAutoLayoutFrame('CTAs', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      itemSpacing: 16,
      width: 'HUG',
      height: 'HUG',
    });

    // Primary CTA
    const primaryBtn = createAutoLayoutFrame('PrimaryBtn', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      padding: { top: 14, right: 28, bottom: 14, left: 28 },
      cornerRadius: parseSize(tokens.effects.borderRadius.lg),
      fills: [createSolidPaint(tokens.colors.primary[500])],
      width: 'HUG',
      height: 'HUG',
    });
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
      const secondaryBtn = createAutoLayoutFrame('SecondaryBtn', {
        direction: 'HORIZONTAL',
        primaryAlign: 'CENTER',
        counterAlign: 'CENTER',
        padding: { top: 14, right: 28, bottom: 14, left: 28 },
        cornerRadius: parseSize(tokens.effects.borderRadius.lg),
        strokes: [createSolidPaint(tokens.colors.border.medium)],
        strokeWeight: 1,
        width: 'HUG',
        height: 'HUG',
      });
      const secondaryText = await createText(heroContent.cta.secondary, {
        fontFamily: tokens.typography.fontFamily.body,
        fontSize: 16,
        fontWeight: tokens.typography.fontWeight.medium,
        color: tokens.colors.text.secondary,
      });
      secondaryBtn.appendChild(secondaryText);
      ctaContainer.appendChild(secondaryBtn);
    }

    contentContainer.appendChild(ctaContainer);
  }

  // Insert headline at the beginning
  contentContainer.insertChild(0, headline);

  hero.appendChild(contentContainer);
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

  const features = createComponent('Section/Features', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    padding: { top: 96, right: 64, bottom: 96, left: 64 },
    itemSpacing: 48,
    width: 1440,
    height: 'HUG',
    fills: [createSolidPaint(tokens.colors.neutral[50])],
  });

  // Section header
  const header = createAutoLayoutFrame('Header', {
    direction: 'VERTICAL',
    primaryAlign: 'CENTER',
    counterAlign: 'CENTER',
    itemSpacing: 12,
    width: 600,
    height: 'HUG',
  });

  const headline = await createText(featuresContent.headline, {
    fontFamily: tokens.typography.fontFamily.heading,
    fontSize: parseSize(tokens.typography.fontSize['4xl'].size),
    fontWeight: tokens.typography.fontWeight.bold,
    color: tokens.colors.text.primary,
    textAlign: 'CENTER',
  });
  headline.textAutoResize = 'WIDTH_AND_HEIGHT';
  headline.layoutSizingHorizontal = 'FILL';

  if (featuresContent.subheadline) {
    const subheadline = await createText(featuresContent.subheadline, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.lg.size),
      color: tokens.colors.text.secondary,
      textAlign: 'CENTER',
    });
    subheadline.textAutoResize = 'WIDTH_AND_HEIGHT';
    subheadline.layoutSizingHorizontal = 'FILL';
    header.appendChild(subheadline);
  }

  header.insertChild(0, headline);

  // Features grid
  const grid = createAutoLayoutFrame('Grid', {
    direction: 'HORIZONTAL',
    primaryAlign: 'CENTER',
    itemSpacing: 32,
    width: 'HUG',
    height: 'HUG',
  });

  for (const item of featuresContent.items.slice(0, 3)) {
    const featureCard = createAutoLayoutFrame(`Feature/${item.id}`, {
      direction: 'VERTICAL',
      itemSpacing: 12,
      padding: 24,
      width: 320,
      height: 'HUG',
      cornerRadius: parseSize(tokens.effects.borderRadius.xl),
      fills: [createSolidPaint(tokens.colors.background.primary)],
    });

    // Icon
    const iconFrame = createAutoLayoutFrame('Icon', {
      direction: 'HORIZONTAL',
      primaryAlign: 'CENTER',
      counterAlign: 'CENTER',
      width: 48,
      height: 48,
      cornerRadius: parseSize(tokens.effects.borderRadius.lg),
      fills: [createSolidPaint(tokens.colors.primary[50])],
    });
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
    title.layoutSizingHorizontal = 'FILL';

    // Description
    const description = await createText(item.description, {
      fontFamily: tokens.typography.fontFamily.body,
      fontSize: parseSize(tokens.typography.fontSize.base.size),
      color: tokens.colors.text.secondary,
      lineHeight: tokens.typography.fontSize.base.lineHeight,
    });
    description.layoutSizingHorizontal = 'FILL';

    featureCard.appendChild(iconFrame);
    featureCard.appendChild(title);
    featureCard.appendChild(description);
    grid.appendChild(featureCard);
  }

  features.appendChild(header);
  features.appendChild(grid);

  features.x = 0;
  features.y = 900;
}
