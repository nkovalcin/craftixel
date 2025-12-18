'use client';

import { useState } from 'react';
import { useProjectStore } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Copy, Check, Figma, FileJson, Code, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type ExportFormat = 'figma' | 'json' | 'css';

export default function GeneratePage() {
  const { getCurrentProject } = useProjectStore();
  const project = getCurrentProject();

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('figma');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!project) return;

    setIsGenerating(true);
    setGeneratedCode(null);

    // Simulate generation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    if (selectedFormat === 'json') {
      const exportData = {
        meta: {
          name: project.name,
          generatedAt: new Date().toISOString(),
          version: '1.0.0',
        },
        strategy: project.strategyInput,
        content: project.content,
        tokens: project.tokens,
      };
      setGeneratedCode(JSON.stringify(exportData, null, 2));
    } else if (selectedFormat === 'css') {
      setGeneratedCode(generateCSSVariables(project.tokens));
    } else {
      // Figma export - transform to plugin format
      const figmaPayload = {
        version: '1.0.0',
        project: {
          id: project.id,
          name: project.content?.brand?.name || project.strategyInput?.businessName || project.name,
          createdAt: project.createdAt,
        },
        tokens: transformTokensForFigma(project.tokens),
        content: transformContentForFigma(project.content, project.strategyInput),
        generateOptions: {
          variables: true,
          components: true,
          pages: true,
        },
      };
      setGeneratedCode(JSON.stringify(figmaPayload, null, 2));
    }

    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!generatedCode) return;

    const extensions: Record<ExportFormat, string> = {
      figma: 'json',
      json: 'json',
      css: 'css',
    };

    const blob = new Blob([generatedCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project?.name || 'design-system'}.${extensions[selectedFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formats: { id: ExportFormat; name: string; description: string; icon: React.ElementType }[] =
    [
      {
        id: 'figma',
        name: 'Figma Plugin',
        description: 'Export for Craftixel Figma plugin',
        icon: Figma,
      },
      {
        id: 'json',
        name: 'JSON Export',
        description: 'Full design system as JSON',
        icon: FileJson,
      },
      {
        id: 'css',
        name: 'CSS Variables',
        description: 'Export as CSS custom properties',
        icon: Code,
      },
    ];

  const isProjectComplete =
    project?.strategyInput && project?.content && project?.tokens;

  return (
    <>
      <AppHeader
        title="Generate"
        description="Export your design system"
      />

      <main className="p-6 max-w-4xl mx-auto">
        {!isProjectComplete ? (
          <Card>
            <CardContent className="py-16 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mx-auto mb-4">
                <Download className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">Complete all phases first</h3>
              <p className="text-muted-foreground mb-6">
                You need to complete Strategy, Content, and Tokens phases before generating.
              </p>
              <div className="flex justify-center gap-2">
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    project?.strategyInput
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  Strategy {project?.strategyInput ? '✓' : '○'}
                </div>
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    project?.content
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  Content {project?.content ? '✓' : '○'}
                </div>
                <div
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-medium',
                    project?.tokens
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  Tokens {project?.tokens ? '✓' : '○'}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Export Format Selection */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-4">Select Export Format</h2>
              <div className="grid md:grid-cols-3 gap-4">
                {formats.map((format) => {
                  const Icon = format.icon;
                  return (
                    <button
                      key={format.id}
                      onClick={() => {
                        setSelectedFormat(format.id);
                        setGeneratedCode(null);
                      }}
                      className={cn(
                        'flex flex-col items-start p-4 rounded-xl border transition-all text-left',
                        selectedFormat === format.id
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      <Icon
                        className={cn(
                          'h-8 w-8 mb-3',
                          selectedFormat === format.id
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                      <span className="font-medium">{format.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {format.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Generate Button */}
            <div className="mb-6">
              <Button onClick={handleGenerate} disabled={isGenerating} size="lg">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    Generate {formats.find((f) => f.id === selectedFormat)?.name}
                  </>
                )}
              </Button>
            </div>

            {/* Generated Output */}
            {generatedCode && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Generated Output</CardTitle>
                      <CardDescription>
                        {selectedFormat === 'figma'
                          ? 'Copy this JSON and paste it into the Craftixel Figma plugin'
                          : selectedFormat === 'json'
                            ? 'Complete design system export'
                            : 'CSS custom properties for your project'}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopy}>
                        {copied ? (
                          <>
                            <Check className="h-4 w-4" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-4 w-4" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="rounded-lg bg-muted p-4 overflow-auto max-h-[500px] text-sm font-mono">
                    {generatedCode}
                  </pre>
                </CardContent>
              </Card>
            )}

            {/* Figma Instructions */}
            {selectedFormat === 'figma' && generatedCode && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>How to use in Figma</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-3 text-sm">
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        1
                      </span>
                      <span>Open Figma and install the Craftixel plugin from the Community</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        2
                      </span>
                      <span>Run the plugin and click "Import Design System"</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        3
                      </span>
                      <span>Paste the generated JSON into the import field</span>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        4
                      </span>
                      <span>
                        Click "Generate" to create your complete design system with variables,
                        components, and pages
                      </span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </>
  );
}

function generateCSSVariables(tokens: ReturnType<typeof useProjectStore.getState>['projects'][0]['tokens']): string {
  if (!tokens) return '';

  const lines: string[] = [':root {'];

  // Colors
  lines.push('  /* Primary Colors */');
  Object.entries(tokens.colors.primary).forEach(([shade, color]) => {
    lines.push(`  --color-primary-${shade}: ${color};`);
  });

  lines.push('');
  lines.push('  /* Secondary Colors */');
  Object.entries(tokens.colors.secondary).forEach(([shade, color]) => {
    lines.push(`  --color-secondary-${shade}: ${color};`);
  });

  lines.push('');
  lines.push('  /* Semantic Colors */');
  lines.push(`  --color-success: ${tokens.colors.success};`);
  lines.push(`  --color-warning: ${tokens.colors.warning};`);
  lines.push(`  --color-error: ${tokens.colors.error};`);
  lines.push(`  --color-info: ${tokens.colors.info};`);

  lines.push('');
  lines.push('  /* Background & Text */');
  lines.push(`  --color-background: ${tokens.colors.background};`);
  lines.push(`  --color-foreground: ${tokens.colors.foreground};`);
  lines.push(`  --color-muted: ${tokens.colors.muted};`);
  lines.push(`  --color-muted-foreground: ${tokens.colors.mutedForeground};`);
  lines.push(`  --color-border: ${tokens.colors.border};`);

  // Typography
  lines.push('');
  lines.push('  /* Font Families */');
  lines.push(`  --font-sans: ${tokens.typography.fontFamily.sans};`);
  lines.push(`  --font-serif: ${tokens.typography.fontFamily.serif};`);
  lines.push(`  --font-mono: ${tokens.typography.fontFamily.mono};`);

  lines.push('');
  lines.push('  /* Font Sizes */');
  Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
    lines.push(`  --font-size-${size}: ${value};`);
  });

  // Spacing
  lines.push('');
  lines.push('  /* Spacing */');
  tokens.spacing.scale.forEach((value, index) => {
    lines.push(`  --spacing-${index}: ${value}px;`);
  });

  // Border Radius
  lines.push('');
  lines.push('  /* Border Radius */');
  Object.entries(tokens.effects.borderRadius).forEach(([size, value]) => {
    lines.push(`  --radius-${size}: ${value};`);
  });

  // Shadows
  lines.push('');
  lines.push('  /* Shadows */');
  Object.entries(tokens.effects.shadow).forEach(([size, value]) => {
    lines.push(`  --shadow-${size}: ${value};`);
  });

  lines.push('}');

  return lines.join('\n');
}

// Transform web app tokens to Figma plugin format
function transformTokensForFigma(tokens: ReturnType<typeof useProjectStore.getState>['projects'][0]['tokens']) {
  if (!tokens) return null;

  return {
    colors: {
      primary: tokens.colors.primary,
      secondary: tokens.colors.secondary,
      accent: tokens.colors.accent,
      semantic: {
        success: tokens.colors.success,
        warning: tokens.colors.warning,
        error: tokens.colors.error,
        info: tokens.colors.info,
      },
      neutral: {
        0: '#FFFFFF',
        50: tokens.colors.neutral[50],
        100: tokens.colors.neutral[100],
        200: tokens.colors.neutral[200],
        300: tokens.colors.neutral[300],
        400: tokens.colors.neutral[400],
        500: tokens.colors.neutral[500],
        600: tokens.colors.neutral[600],
        700: tokens.colors.neutral[700],
        800: tokens.colors.neutral[800],
        900: tokens.colors.neutral[900],
        1000: '#000000',
      },
      background: {
        primary: tokens.colors.background,
        secondary: tokens.colors.muted,
        tertiary: tokens.colors.muted,
        inverse: tokens.colors.foreground,
      },
      text: {
        primary: tokens.colors.foreground,
        secondary: tokens.colors.mutedForeground,
        muted: tokens.colors.mutedForeground,
        inverse: tokens.colors.background,
      },
      border: {
        light: tokens.colors.border,
        medium: tokens.colors.border,
        strong: tokens.colors.foreground,
      },
    },
    typography: {
      fontFamily: {
        heading: tokens.typography.fontFamily.sans,
        body: tokens.typography.fontFamily.sans,
        mono: tokens.typography.fontFamily.mono,
      },
      fontSize: {
        xs: { size: tokens.typography.fontSize.xs, lineHeight: 1.5, letterSpacing: '0' },
        sm: { size: tokens.typography.fontSize.sm, lineHeight: 1.5, letterSpacing: '0' },
        base: { size: tokens.typography.fontSize.base, lineHeight: 1.5, letterSpacing: '0' },
        lg: { size: tokens.typography.fontSize.lg, lineHeight: 1.5, letterSpacing: '0' },
        xl: { size: tokens.typography.fontSize.xl, lineHeight: 1.4, letterSpacing: '-0.01em' },
        '2xl': { size: tokens.typography.fontSize['2xl'], lineHeight: 1.3, letterSpacing: '-0.02em' },
        '3xl': { size: tokens.typography.fontSize['3xl'], lineHeight: 1.2, letterSpacing: '-0.02em' },
        '4xl': { size: tokens.typography.fontSize['4xl'], lineHeight: 1.1, letterSpacing: '-0.02em' },
        '5xl': { size: tokens.typography.fontSize['5xl'], lineHeight: 1.1, letterSpacing: '-0.02em' },
        '6xl': { size: tokens.typography.fontSize['6xl'], lineHeight: 1, letterSpacing: '-0.02em' },
      },
      fontWeight: tokens.typography.fontWeight,
      lineHeight: tokens.typography.lineHeight,
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
        wide: '0.02em',
      },
    },
    spacing: {
      baseUnit: tokens.spacing.base,
      scale: {
        0: '0',
        px: '1px',
        0.5: '2px',
        1: '4px',
        1.5: '6px',
        2: '8px',
        2.5: '10px',
        3: '12px',
        3.5: '14px',
        4: '16px',
        5: '20px',
        6: '24px',
        7: '28px',
        8: '32px',
        9: '36px',
        10: '40px',
        11: '44px',
        12: '48px',
        14: '56px',
        16: '64px',
        20: '80px',
        24: '96px',
        28: '112px',
        32: '128px',
      },
      section: {
        paddingY: '96px',
        paddingX: '24px',
        gap: '64px',
      },
      component: {
        paddingSmall: '8px',
        paddingMedium: '16px',
        paddingLarge: '24px',
        gap: '12px',
      },
    },
    effects: {
      borderRadius: tokens.effects.borderRadius,
      shadow: {
        none: 'none',
        sm: tokens.effects.shadow.sm,
        md: tokens.effects.shadow.md,
        lg: tokens.effects.shadow.lg,
        xl: tokens.effects.shadow.xl,
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
      },
      blur: {
        none: '0',
        sm: '4px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
      transition: {
        none: '0ms',
        fast: '150ms',
        normal: '300ms',
        slow: '500ms',
        slower: '700ms',
      },
    },
    layout: {
      container: tokens.layout.container,
      breakpoints: tokens.layout.breakpoints,
      grid: {
        columns: 12,
        gutter: '24px',
        margin: '24px',
      },
      zIndex: {
        base: 0,
        dropdown: 1000,
        sticky: 1100,
        fixed: 1200,
        modal: 1300,
        popover: 1400,
        tooltip: 1500,
      },
    },
  };
}

// Transform web app content to Figma plugin format
function transformContentForFigma(
  content: ReturnType<typeof useProjectStore.getState>['projects'][0]['content'],
  strategy: ReturnType<typeof useProjectStore.getState>['projects'][0]['strategyInput']
) {
  if (!content) return null;

  const tone = strategy?.tone?.toLowerCase().includes('professional') ? 'professional' :
               strategy?.tone?.toLowerCase().includes('friendly') ? 'friendly' :
               strategy?.tone?.toLowerCase().includes('bold') ? 'bold' :
               strategy?.tone?.toLowerCase().includes('playful') ? 'playful' : 'professional';

  return {
    brand: {
      name: content.brand.name,
      tagline: content.brand.tagline,
      description: content.brand.description,
      tone: tone,
      personality: [tone, 'trustworthy', 'innovative'],
      valueProposition: content.brand.description,
      keywords: {
        use: ['quality', 'simple', 'powerful'],
        avoid: ['complex', 'difficult'],
      },
    },
    sections: content.sections.map((section, index) => ({
      id: section.id,
      type: section.type === 'how-it-works' ? 'howItWorks' : section.type,
      enabled: true,
      order: index,
      headline: section.headline,
      subheadline: section.subheadline || '',
      body: section.description || '',
      cta: section.cta ? {
        primary: section.cta.primary,
        secondary: section.cta.secondary,
      } : undefined,
      items: section.items?.map((item, i) => ({
        id: `${section.id}-item-${i}`,
        title: item.title,
        description: item.description,
        icon: item.icon,
      })),
    })),
    microcopy: {
      nav: {
        home: 'Home',
        features: content.microcopy?.navigation?.[0] || 'Features',
        pricing: content.microcopy?.navigation?.[2] || 'Pricing',
        about: content.microcopy?.navigation?.[1] || 'About',
        contact: content.microcopy?.navigation?.[3] || 'Contact',
        login: 'Log in',
        signup: 'Sign up',
      },
      buttons: {
        submit: content.microcopy?.buttons?.submit || 'Submit',
        cancel: content.microcopy?.buttons?.cancel || 'Cancel',
        save: 'Save',
        delete: 'Delete',
        continue: 'Continue',
        back: 'Back',
        learnMore: content.microcopy?.buttons?.secondary || 'Learn More',
        getStarted: content.microcopy?.buttons?.primary || 'Get Started',
        tryFree: 'Try Free',
        contactUs: 'Contact Us',
      },
      forms: {
        labels: content.microcopy?.labels || {},
        placeholders: {},
        hints: {},
        errors: {
          required: 'This field is required',
          invalidEmail: 'Please enter a valid email',
          tooShort: 'Too short',
          tooLong: 'Too long',
          mismatch: 'Values do not match',
        },
        success: {
          saved: 'Saved successfully',
          sent: 'Sent successfully',
          subscribed: 'Subscribed successfully',
        },
      },
      states: {
        loading: 'Loading...',
        empty: 'No items found',
        error: 'Something went wrong',
        success: 'Success!',
      },
      meta: {
        copyright: `© ${new Date().getFullYear()} ${content.brand.name}. All rights reserved.`,
        madeWith: 'Made with Craftixel',
      },
    },
  };
}
