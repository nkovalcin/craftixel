'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore, ContentTokens } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { generateId } from '@/lib/utils';

const sectionTypes = [
  { id: 'hero', name: 'Hero Section' },
  { id: 'features', name: 'Features' },
  { id: 'how-it-works', name: 'How It Works' },
  { id: 'testimonials', name: 'Testimonials' },
  { id: 'pricing', name: 'Pricing' },
  { id: 'cta', name: 'Call to Action' },
  { id: 'faq', name: 'FAQ' },
  { id: 'about', name: 'About' },
  { id: 'team', name: 'Team' },
  { id: 'contact', name: 'Contact' },
];

const emptyContent: ContentTokens = {
  brand: {
    name: '',
    tagline: '',
    description: '',
  },
  sections: [
    {
      id: generateId(),
      type: 'hero',
      headline: '',
      subheadline: '',
      description: '',
      cta: { primary: '', secondary: '' },
    },
  ],
  microcopy: {
    navigation: ['Features', 'Pricing', 'About'],
    buttons: { primary: 'Get Started', secondary: 'Learn More' },
    labels: {},
    errors: {},
  },
};

export default function ContentPage() {
  const router = useRouter();
  const { getCurrentProject, setContent, setPhase } = useProjectStore();
  const project = getCurrentProject();

  const [content, setLocalContent] = useState<ContentTokens>(
    project?.content || emptyContent
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([content.sections[0]?.id]));

  useEffect(() => {
    if (project?.content) {
      setLocalContent(project.content);
    } else if (project?.strategyOutput) {
      // Pre-fill from strategy
      setLocalContent({
        ...emptyContent,
        brand: {
          name: project.strategyInput?.businessName || '',
          tagline: project.strategyOutput.messaging.tagline,
          description: project.strategyOutput.valueProposition,
        },
        sections: [
          {
            id: generateId(),
            type: 'hero',
            headline: project.strategyOutput.messaging.headline,
            subheadline: project.strategyOutput.messaging.subheadline,
            description: '',
            cta: { primary: 'Get Started', secondary: 'Learn More' },
          },
        ],
      });
    }
  }, [project?.content, project?.strategyOutput, project?.strategyInput]);

  const handleSave = () => {
    setContent(content);
  };

  const handleGenerate = async () => {
    if (!project?.strategyInput || !project?.strategyOutput) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate/content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          strategy: project.strategyInput,
          output: project.strategyOutput,
        }),
      });

      if (response.ok) {
        const generatedContent = await response.json();
        setLocalContent(generatedContent);
        setContent(generatedContent);
      }
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleContinue = () => {
    handleSave();
    setPhase('F3');
    router.push('/app/tokens');
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const addSection = () => {
    const newSection = {
      id: generateId(),
      type: 'features' as const,
      headline: '',
      subheadline: '',
      description: '',
    };
    setLocalContent((prev) => ({
      ...prev,
      sections: [...prev.sections, newSection],
    }));
    setExpandedSections((prev) => new Set([...prev, newSection.id]));
  };

  const removeSection = (sectionId: string) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: prev.sections.filter((s) => s.id !== sectionId),
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<ContentTokens['sections'][0]>) => {
    setLocalContent((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id === sectionId ? { ...s, ...updates } : s
      ),
    }));
  };

  const updateBrand = (updates: Partial<ContentTokens['brand']>) => {
    setLocalContent((prev) => ({
      ...prev,
      brand: { ...prev.brand, ...updates },
    }));
  };

  return (
    <>
      <AppHeader
        title="Content"
        description="Generate and edit your copy"
        showSaveButton
        onSave={handleSave}
        showNextButton
        onNext={handleContinue}
      />

      <main className="p-6 max-w-4xl mx-auto">
        {/* Generate Button */}
        <div className="mb-6 flex items-center gap-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !project?.strategyOutput}
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
                Generate All Content with AI
              </>
            )}
          </Button>
          {!project?.strategyOutput && (
            <p className="text-sm text-muted-foreground">
              Complete the Strategy phase first to generate content.
            </p>
          )}
        </div>

        {/* Brand Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Brand</CardTitle>
            <CardDescription>Core brand messaging</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Brand Name</Label>
                <Input
                  value={content.brand.name}
                  onChange={(e) => updateBrand({ name: e.target.value })}
                  placeholder="Your brand name"
                />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input
                  value={content.brand.tagline}
                  onChange={(e) => updateBrand({ tagline: e.target.value })}
                  placeholder="A memorable tagline"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Brand Description</Label>
              <Textarea
                value={content.brand.description}
                onChange={(e) => updateBrand({ description: e.target.value })}
                placeholder="A brief description of what your brand does..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Page Sections</h2>
          <Button variant="outline" size="sm" onClick={addSection}>
            <Plus className="h-4 w-4" />
            Add Section
          </Button>
        </div>

        <div className="space-y-4">
          {content.sections.map((section, index) => {
            const isExpanded = expandedSections.has(section.id);
            const sectionType = sectionTypes.find((t) => t.id === section.type);

            return (
              <Card key={section.id}>
                <CardHeader
                  className="cursor-pointer"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-base">
                          {sectionType?.name || section.type}
                        </CardTitle>
                        <CardDescription>
                          {section.headline || 'No headline yet'}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {content.sections.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeSection(section.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      )}
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </CardHeader>

                {isExpanded && (
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Section Type</Label>
                      <select
                        value={section.type}
                        onChange={(e) => updateSection(section.id, { type: e.target.value })}
                        className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                      >
                        {sectionTypes.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Headline</Label>
                      <Input
                        value={section.headline}
                        onChange={(e) =>
                          updateSection(section.id, { headline: e.target.value })
                        }
                        placeholder="Section headline"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Subheadline</Label>
                      <Input
                        value={section.subheadline}
                        onChange={(e) =>
                          updateSection(section.id, { subheadline: e.target.value })
                        }
                        placeholder="Supporting text"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={section.description}
                        onChange={(e) =>
                          updateSection(section.id, { description: e.target.value })
                        }
                        placeholder="Detailed description..."
                      />
                    </div>

                    {(section.type === 'hero' || section.type === 'cta') && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Primary CTA</Label>
                          <Input
                            value={section.cta?.primary || ''}
                            onChange={(e) =>
                              updateSection(section.id, {
                                cta: { primary: e.target.value, secondary: section.cta?.secondary },
                              })
                            }
                            placeholder="e.g., Get Started"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Secondary CTA</Label>
                          <Input
                            value={section.cta?.secondary || ''}
                            onChange={(e) =>
                              updateSection(section.id, {
                                cta: { primary: section.cta?.primary || '', secondary: e.target.value },
                              })
                            }
                            placeholder="e.g., Learn More"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </>
  );
}
