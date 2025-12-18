'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectStore } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ComponentType = 'atoms' | 'molecules' | 'organisms';

export default function ComponentsPage() {
  const router = useRouter();
  const { getCurrentProject, setPhase } = useProjectStore();
  const project = getCurrentProject();

  const [activeTab, setActiveTab] = useState<ComponentType>('atoms');

  const tokens = project?.tokens;
  const primaryColor = tokens?.colors.primary[500] || '#3B82F6';
  const primaryHover = tokens?.colors.primary[600] || '#2563EB';

  const handleContinue = () => {
    setPhase('F5');
    router.push('/app/generate');
  };

  const tabs: { id: ComponentType; label: string }[] = [
    { id: 'atoms', label: 'Atoms' },
    { id: 'molecules', label: 'Molecules' },
    { id: 'organisms', label: 'Organisms' },
  ];

  return (
    <>
      <AppHeader
        title="Components"
        description="Preview your component library"
        showNextButton
        onNext={handleContinue}
      />

      <main className="p-6">
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

        {/* Atoms */}
        {activeTab === 'atoms' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>Primary action elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg border border-input bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent">
                    Secondary
                  </button>
                  <button className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent">
                    Ghost
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex items-center justify-center rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Small
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Medium
                  </button>
                  <button
                    className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Large
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Inputs */}
            <Card>
              <CardHeader>
                <CardTitle>Inputs</CardTitle>
                <CardDescription>Form input elements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Default input"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-offset-2"
                  style={{ '--tw-ring-color': primaryColor } as React.CSSProperties}
                />
                <input
                  type="email"
                  placeholder="Email input"
                  className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                />
                <textarea
                  placeholder="Textarea"
                  className="flex min-h-[80px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground resize-none"
                />
              </CardContent>
            </Card>

            {/* Badges */}
            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Status and label indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Primary
                  </span>
                  <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">
                    Secondary
                  </span>
                  <span className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium">
                    Outline
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: tokens?.colors.success || '#22C55E' }}
                  >
                    Success
                  </span>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: tokens?.colors.error || '#EF4444' }}
                  >
                    Error
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Molecules */}
        {activeTab === 'molecules' && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Card Component */}
            <Card>
              <CardHeader>
                <CardTitle>Feature Card</CardTitle>
                <CardDescription>Card with icon and description</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border p-6">
                  <div
                    className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Feature Title</h3>
                  <p className="text-muted-foreground text-sm">
                    A brief description of this amazing feature and why it matters.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Form Group */}
            <Card>
              <CardHeader>
                <CardTitle>Form Group</CardTitle>
                <CardDescription>Label, input, and helper text</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">
                    We'll never share your email with anyone else.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Nav Item */}
            <Card>
              <CardHeader>
                <CardTitle>Navigation Items</CardTitle>
                <CardDescription>Menu and nav elements</CardDescription>
              </CardHeader>
              <CardContent>
                <nav className="space-y-1">
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white"
                    style={{ backgroundColor: primaryColor }}
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                      />
                    </svg>
                    Dashboard
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    Analytics
                  </a>
                  <a
                    href="#"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    Settings
                  </a>
                </nav>
              </CardContent>
            </Card>

            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing Card</CardTitle>
                <CardDescription>Subscription tier display</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border-2 p-6" style={{ borderColor: primaryColor }}>
                  <span
                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium text-white mb-4"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Popular
                  </span>
                  <h3 className="text-xl font-bold mb-1">Pro Plan</h3>
                  <div className="flex items-baseline gap-1 mb-4">
                    <span className="text-4xl font-bold">$29</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <ul className="space-y-2 mb-6 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4" style={{ color: tokens?.colors.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Unlimited projects
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4" style={{ color: tokens?.colors.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      All templates
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="h-4 w-4" style={{ color: tokens?.colors.success }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Priority support
                    </li>
                  </ul>
                  <button
                    className="w-full rounded-lg py-2 text-sm font-medium text-white transition-colors"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Get Started
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Organisms */}
        {activeTab === 'organisms' && (
          <div className="space-y-6">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle>Header</CardTitle>
                <CardDescription>Site navigation header</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-white font-bold"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {project?.strategyInput?.businessName?.[0] || 'C'}
                      </div>
                      <span className="font-bold">
                        {project?.strategyInput?.businessName || 'Brand'}
                      </span>
                    </div>
                    <nav className="flex items-center gap-6">
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Features
                      </a>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        Pricing
                      </a>
                      <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                        About
                      </a>
                      <button
                        className="rounded-lg px-4 py-2 text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        Get Started
                      </button>
                    </nav>
                  </header>
                </div>
              </CardContent>
            </Card>

            {/* Hero Section */}
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>Main landing section</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <section className="py-16 px-6 text-center bg-background">
                    <h1 className="text-4xl font-bold mb-4">
                      {project?.content?.sections[0]?.headline || 'Transform Your Workflow'}
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                      {project?.content?.sections[0]?.subheadline ||
                        'The all-in-one platform that helps you build better products faster.'}
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        className="rounded-lg px-6 py-3 text-sm font-medium text-white"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {project?.content?.sections[0]?.cta?.primary || 'Get Started'}
                      </button>
                      <button className="rounded-lg border border-input px-6 py-3 text-sm font-medium">
                        {project?.content?.sections[0]?.cta?.secondary || 'Learn More'}
                      </button>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>

            {/* Features Grid */}
            <Card>
              <CardHeader>
                <CardTitle>Features Section</CardTitle>
                <CardDescription>Feature showcase grid</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-xl border border-border overflow-hidden">
                  <section className="py-16 px-6 bg-secondary/30">
                    <h2 className="text-3xl font-bold text-center mb-12">
                      {project?.content?.sections.find((s) => s.type === 'features')?.headline ||
                        'Why Choose Us'}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="rounded-xl border border-border bg-background p-6">
                          <div
                            className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg"
                            style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                          >
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 10V3L4 14h7v7l9-11h-7z"
                              />
                            </svg>
                          </div>
                          <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
                          <p className="text-muted-foreground text-sm">
                            A brief description of this amazing feature.
                          </p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </>
  );
}
