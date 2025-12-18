'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  FileText,
  Palette,
  Component,
  Download,
  Plus,
  ChevronRight,
  Settings,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProjectStore, Phase } from '@/stores/project';

const phases: {
  id: Phase;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
}[] = [
  {
    id: 'F1',
    name: 'Strategy',
    description: 'Define your business',
    icon: MessageSquare,
    href: '/app/strategy',
  },
  {
    id: 'F2',
    name: 'Content',
    description: 'Generate copy',
    icon: FileText,
    href: '/app/content',
  },
  {
    id: 'F3',
    name: 'Tokens',
    description: 'Design system',
    icon: Palette,
    href: '/app/tokens',
  },
  {
    id: 'F4',
    name: 'Components',
    description: 'UI elements',
    icon: Component,
    href: '/app/components',
  },
  {
    id: 'F5',
    name: 'Generate',
    description: 'Export to Figma',
    icon: Download,
    href: '/app/generate',
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { getCurrentProject, projects, createProject, setCurrentProject } = useProjectStore();
  const currentProject = getCurrentProject();

  const handleCreateProject = () => {
    const name = `Project ${projects.length + 1}`;
    createProject(name);
  };

  const getPhaseStatus = (phaseId: Phase): 'completed' | 'current' | 'locked' => {
    if (!currentProject) return 'locked';

    const phaseOrder: Phase[] = ['F1', 'F2', 'F3', 'F4', 'F5'];
    const currentIndex = phaseOrder.indexOf(currentProject.currentPhase);
    const phaseIndex = phaseOrder.indexOf(phaseId);

    if (phaseIndex < currentIndex) return 'completed';
    if (phaseIndex === currentIndex) return 'current';
    return 'locked';
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-background">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              C
            </div>
            <span className="text-lg font-bold">Craftixel</span>
          </Link>
        </div>

        {/* Project Selector */}
        <div className="border-b border-border p-4">
          {currentProject ? (
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-muted-foreground">Current Project</p>
                <p className="text-sm font-medium truncate">{currentProject.name}</p>
              </div>
              <button
                onClick={handleCreateProject}
                className="p-1.5 rounded-md hover:bg-accent transition-colors"
                title="New project"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleCreateProject}
              className="flex items-center gap-2 w-full p-2 rounded-lg border border-dashed border-border hover:border-primary hover:bg-accent/50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              <span className="text-sm">New Project</span>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          {/* Dashboard */}
          <Link
            href="/app"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors mb-2',
              pathname === '/app'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>

          {/* Phases */}
          <div className="mt-6">
            <p className="px-3 text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Phases
            </p>
            <div className="space-y-1">
              {phases.map((phase) => {
                const status = getPhaseStatus(phase.id);
                const Icon = phase.icon;
                const isActive = pathname === phase.href;
                const isLocked = status === 'locked' && !currentProject;

                return (
                  <Link
                    key={phase.id}
                    href={isLocked ? '#' : phase.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors group',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : isLocked
                          ? 'text-muted-foreground/50 cursor-not-allowed'
                          : status === 'completed'
                            ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            : status === 'current'
                              ? 'text-foreground bg-accent/50 hover:bg-accent'
                              : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                    onClick={(e) => isLocked && e.preventDefault()}
                  >
                    <div
                      className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-md text-xs font-bold',
                        isActive
                          ? 'bg-primary-foreground/20 text-primary-foreground'
                          : status === 'completed'
                            ? 'bg-green-500/10 text-green-500'
                            : status === 'current'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-muted text-muted-foreground'
                      )}
                    >
                      {phase.id}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{phase.name}</p>
                      <p className="text-xs opacity-70 truncate">{phase.description}</p>
                    </div>
                    {!isLocked && (
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4 space-y-1">
          <Link
            href="/app/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === '/app/settings'
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Docs
          </Link>
        </div>
      </div>
    </aside>
  );
}
