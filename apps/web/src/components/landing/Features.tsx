'use client';

import { FileText, Palette, Component, Download } from 'lucide-react';

const features = [
  {
    icon: FileText,
    title: 'Content-First Approach',
    description:
      'Start with your message, not templates. AI generates copy based on your business goals, audience, and tone.',
  },
  {
    icon: Palette,
    title: 'Token-Based Design',
    description:
      'Every color, spacing, and typography value is parametrized. Change once, update everywhere.',
  },
  {
    icon: Component,
    title: 'Production Components',
    description:
      'Generate buttons, cards, sections — all with proper variants, auto-layout, and Figma Variables.',
  },
  {
    icon: Download,
    title: 'Figma-Native Export',
    description:
      'One-click export to Figma with real components, connected variables, and clean layer structure.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need to design faster
          </h2>
          <p className="text-lg text-muted-foreground">
            From content strategy to Figma export — one seamless flow powered by AI.
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all"
            >
              {/* Icon */}
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
