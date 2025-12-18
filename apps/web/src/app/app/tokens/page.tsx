'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, DesignTokens, ColorScale } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Copy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const defaultTokens: DesignTokens = {
  colors: {
    primary: generateColorScale('#3B82F6'),
    secondary: generateColorScale('#6366F1'),
    accent: generateColorScale('#EC4899'),
    neutral: generateColorScale('#6B7280'),
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    background: '#FFFFFF',
    foreground: '#0F172A',
    muted: '#F1F5F9',
    mutedForeground: '#64748B',
    border: '#E2E8F0',
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      serif: 'Georgia, serif',
      mono: 'JetBrains Mono, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    base: 4,
    scale: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128],
  },
  effects: {
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    shadow: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
  },
  layout: {
    container: {
      maxWidth: '1280px',
      padding: '1rem',
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
  },
};

function generateColorScale(baseColor: string): ColorScale {
  // Simple HSL-based color scale generation
  const hex = baseColor.replace('#', '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    const rNorm = r / 255;
    const gNorm = g / 255;
    const bNorm = b / 255;

    switch (max) {
      case rNorm:
        h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6;
        break;
      case gNorm:
        h = ((bNorm - rNorm) / d + 2) / 6;
        break;
      case bNorm:
        h = ((rNorm - gNorm) / d + 4) / 6;
        break;
    }
  }

  const hslToHex = (h: number, s: number, l: number): string => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let rOut, gOut, bOut;
    if (s === 0) {
      rOut = gOut = bOut = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      rOut = hue2rgb(p, q, h + 1 / 3);
      gOut = hue2rgb(p, q, h);
      bOut = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) =>
      Math.round(x * 255)
        .toString(16)
        .padStart(2, '0');
    return `#${toHex(rOut)}${toHex(gOut)}${toHex(bOut)}`.toUpperCase();
  };

  return {
    50: hslToHex(h, s * 0.3, 0.97),
    100: hslToHex(h, s * 0.4, 0.94),
    200: hslToHex(h, s * 0.5, 0.86),
    300: hslToHex(h, s * 0.6, 0.74),
    400: hslToHex(h, s * 0.7, 0.62),
    500: hslToHex(h, s, l),
    600: hslToHex(h, s * 1.1, l * 0.85),
    700: hslToHex(h, s * 1.2, l * 0.7),
    800: hslToHex(h, s * 1.2, l * 0.55),
    900: hslToHex(h, s * 1.1, l * 0.4),
    950: hslToHex(h, s * 1.0, l * 0.25),
  };
}

type Tab = 'colors' | 'typography' | 'spacing' | 'effects';

export default function TokensPage() {
  const router = useRouter();
  const { getCurrentProject, setTokens, setPhase } = useProjectStore();
  const project = getCurrentProject();

  const [tokens, setLocalTokens] = useState<DesignTokens>(
    project?.tokens || defaultTokens
  );
  const [activeTab, setActiveTab] = useState<Tab>('colors');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (project?.tokens) {
      setLocalTokens(project.tokens);
    }
  }, [project?.tokens]);

  const handleSave = () => {
    setTokens(tokens);
  };

  const handleContinue = () => {
    handleSave();
    setPhase('F4');
    router.push('/app/components');
  };

  const handleColorChange = (
    colorKey: keyof DesignTokens['colors'],
    value: string | ColorScale
  ) => {
    setLocalTokens((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value,
      },
    }));
  };

  const handlePrimaryColorChange = (baseColor: string) => {
    const scale = generateColorScale(baseColor);
    handleColorChange('primary', scale);
  };

  const copyToClipboard = (value: string, key: string) => {
    navigator.clipboard.writeText(value);
    setCopiedColor(key);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const handleGenerateFromBrand = async () => {
    if (!project?.strategyInput) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessName: project.strategyInput.businessName,
          businessType: project.strategyInput.businessType,
          tone: project.strategyInput.tone,
        }),
      });

      if (response.ok) {
        const generatedTokens = await response.json();
        setLocalTokens(generatedTokens);
        setTokens(generatedTokens);
      }
    } catch (error) {
      console.error('Error generating tokens:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'colors', label: 'Colors' },
    { id: 'typography', label: 'Typography' },
    { id: 'spacing', label: 'Spacing' },
    { id: 'effects', label: 'Effects' },
  ];

  return (
    <>
      <AppHeader
        title="Design Tokens"
        description="Configure your visual design system"
        showSaveButton
        onSave={handleSave}
        showNextButton
        onNext={handleContinue}
      />

      <main className="p-6">
        {/* Generate Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={handleGenerateFromBrand}
            disabled={isGenerating || !project?.strategyInput}
            variant="outline"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Tokens from Brand
              </>
            )}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors',
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Colors Tab */}
        {activeTab === 'colors' && (
          <div className="space-y-6">
            {/* Primary Color Picker */}
            <Card>
              <CardHeader>
                <CardTitle>Primary Color</CardTitle>
                <CardDescription>
                  Set your brand's primary color to generate a complete scale
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={tokens.colors.primary[500]}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="h-12 w-24 cursor-pointer rounded-lg border-0"
                  />
                  <Input
                    value={tokens.colors.primary[500]}
                    onChange={(e) => handlePrimaryColorChange(e.target.value)}
                    className="w-32 font-mono"
                    placeholder="#3B82F6"
                  />
                </div>

                {/* Color Scale */}
                <div className="mt-4 flex gap-1">
                  {Object.entries(tokens.colors.primary).map(([shade, color]) => (
                    <button
                      key={shade}
                      onClick={() => copyToClipboard(color, `primary-${shade}`)}
                      className="group relative flex-1"
                    >
                      <div
                        className="h-12 rounded-md transition-transform hover:scale-105"
                        style={{ backgroundColor: color }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        {copiedColor === `primary-${shade}` ? (
                          <Check className="h-4 w-4 text-white drop-shadow-md" />
                        ) : (
                          <Copy className="h-4 w-4 text-white drop-shadow-md" />
                        )}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground text-center">
                        {shade}
                      </span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Semantic Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Semantic Colors</CardTitle>
                <CardDescription>
                  Colors for specific UI states and feedback
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {(['success', 'warning', 'error', 'info'] as const).map((color) => (
                    <div key={color} className="space-y-2">
                      <Label className="capitalize">{color}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={tokens.colors[color]}
                          onChange={(e) => handleColorChange(color, e.target.value)}
                          className="h-10 w-10 cursor-pointer rounded border-0"
                        />
                        <Input
                          value={tokens.colors[color]}
                          onChange={(e) => handleColorChange(color, e.target.value)}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Background Colors */}
            <Card>
              <CardHeader>
                <CardTitle>Background & Text</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {(['background', 'foreground', 'muted', 'mutedForeground', 'border'] as const).map(
                    (color) => (
                      <div key={color} className="space-y-2">
                        <Label className="capitalize">
                          {color.replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={tokens.colors[color]}
                            onChange={(e) => handleColorChange(color, e.target.value)}
                            className="h-10 w-10 cursor-pointer rounded border-0"
                          />
                          <Input
                            value={tokens.colors[color]}
                            onChange={(e) => handleColorChange(color, e.target.value)}
                            className="font-mono text-sm"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Font Families</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(tokens.typography.fontFamily).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key}</Label>
                    <Input
                      value={value}
                      onChange={(e) =>
                        setLocalTokens((prev) => ({
                          ...prev,
                          typography: {
                            ...prev.typography,
                            fontFamily: {
                              ...prev.typography.fontFamily,
                              [key]: e.target.value,
                            },
                          },
                        }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Type Scale</CardTitle>
                <CardDescription>Preview of your typography scale</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.entries(tokens.typography.fontSize).map(([size, value]) => (
                    <div key={size} className="flex items-baseline gap-4">
                      <span className="w-12 text-sm text-muted-foreground">{size}</span>
                      <span style={{ fontSize: value }} className="font-medium">
                        The quick brown fox
                      </span>
                      <span className="text-sm text-muted-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Spacing Tab */}
        {activeTab === 'spacing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Spacing Scale</CardTitle>
                <CardDescription>
                  Base unit: {tokens.spacing.base}px
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {tokens.spacing.scale.map((value, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-8 text-sm text-muted-foreground">{index}</span>
                      <div
                        className="bg-primary rounded"
                        style={{ width: value, height: 24 }}
                      />
                      <span className="text-sm text-muted-foreground">{value}px</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Effects Tab */}
        {activeTab === 'effects' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Border Radius</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {Object.entries(tokens.effects.borderRadius).map(([size, value]) => (
                    <div key={size} className="text-center">
                      <div
                        className="w-16 h-16 bg-primary mb-2"
                        style={{ borderRadius: value }}
                      />
                      <span className="text-xs text-muted-foreground">{size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shadows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-6">
                  {Object.entries(tokens.effects.shadow).map(([size, value]) => (
                    <div key={size} className="text-center">
                      <div
                        className="w-24 h-24 bg-background rounded-lg mb-2"
                        style={{ boxShadow: value }}
                      />
                      <span className="text-xs text-muted-foreground">{size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
