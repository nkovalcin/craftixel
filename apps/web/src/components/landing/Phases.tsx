'use client';

const phases = [
  {
    id: 'F1',
    name: 'Strategy',
    description: 'Understand business, audience, positioning',
    color: 'bg-blue-500',
  },
  {
    id: 'F2',
    name: 'Content',
    description: 'Generate headlines, copy, CTAs',
    color: 'bg-indigo-500',
  },
  {
    id: 'F3',
    name: 'Tokens',
    description: 'Colors, typography, spacing, effects',
    color: 'bg-violet-500',
  },
  {
    id: 'F4',
    name: 'Components',
    description: 'Buttons, cards, sections, layouts',
    color: 'bg-purple-500',
  },
  {
    id: 'F5',
    name: 'Generate',
    description: 'Export to Figma with variables',
    color: 'bg-pink-500',
  },
];

export function Phases() {
  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            The 5 Phases
          </h2>
          <p className="text-lg text-muted-foreground">
            A structured flow from business idea to production-ready design system.
          </p>
        </div>

        {/* Phases */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 max-w-5xl mx-auto">
          {phases.map((phase, index) => (
            <div key={phase.id} className="flex items-center">
              <div className="flex flex-col items-center text-center">
                {/* Phase badge */}
                <div
                  className={`${phase.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}
                >
                  {phase.id}
                </div>

                {/* Phase card */}
                <div className="w-48 p-4 rounded-xl bg-background border border-border">
                  <h3 className="font-semibold mb-1">{phase.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {phase.description}
                  </p>
                </div>
              </div>

              {/* Arrow connector */}
              {index < phases.length - 1 && (
                <div className="hidden md:block mx-2 text-muted-foreground">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
