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
      // Figma export
      const figmaPayload = {
        tokens: project.tokens,
        content: project.content,
        strategy: project.strategyInput,
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
