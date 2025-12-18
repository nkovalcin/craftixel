'use client';

import { useProjectStore } from '@/stores/project';
import { AppHeader } from '@/components/app/AppHeader';
import { Button } from '@/components/ui/button';
import { Plus, Folder, Clock, Trash2, MoreVertical } from 'lucide-react';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const phaseColors: Record<string, string> = {
  F1: 'bg-blue-500',
  F2: 'bg-indigo-500',
  F3: 'bg-violet-500',
  F4: 'bg-purple-500',
  F5: 'bg-pink-500',
};

export default function AppDashboard() {
  const router = useRouter();
  const { projects, createProject, deleteProject, setCurrentProject } = useProjectStore();

  const handleCreateProject = () => {
    const project = createProject(`Project ${projects.length + 1}`);
    router.push('/app/strategy');
  };

  const handleOpenProject = (projectId: string) => {
    setCurrentProject(projectId);
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const phaseRoutes = {
        F1: '/app/strategy',
        F2: '/app/content',
        F3: '/app/tokens',
        F4: '/app/components',
        F5: '/app/generate',
      };
      router.push(phaseRoutes[project.currentPhase]);
    }
  };

  const handleDeleteProject = (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(projectId);
    }
  };

  return (
    <>
      <AppHeader title="Dashboard" description="Manage your design system projects" />

      <main className="p-6">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Folder className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-muted-foreground">Total Projects</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter((p) => p.currentPhase !== 'F5').length}
                </p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-pink-500/10">
                <Plus className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter((p) => p.currentPhase === 'F5').length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Projects</h2>
          <Button onClick={handleCreateProject}>
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <Folder className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-sm">
              Create your first project to start generating pixel-perfect design systems with AI.
            </p>
            <Button onClick={handleCreateProject}>
              <Plus className="h-4 w-4" />
              Create Your First Project
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenProject(project.id)}
                className="group relative rounded-xl border border-border bg-card p-6 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
              >
                {/* Phase badge */}
                <div
                  className={cn(
                    'absolute top-4 right-4 px-2 py-0.5 rounded-full text-xs font-bold text-white',
                    phaseColors[project.currentPhase]
                  )}
                >
                  {project.currentPhase}
                </div>

                {/* Project info */}
                <div className="mb-4">
                  <h3 className="font-semibold mb-1 pr-12">{project.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Updated {formatRelativeTime(project.updatedAt)}
                  </p>
                </div>

                {/* Progress */}
                <div className="flex gap-1 mb-4">
                  {['F1', 'F2', 'F3', 'F4', 'F5'].map((phase) => {
                    const phaseOrder = ['F1', 'F2', 'F3', 'F4', 'F5'];
                    const currentIndex = phaseOrder.indexOf(project.currentPhase);
                    const phaseIndex = phaseOrder.indexOf(phase);
                    const isCompleted = phaseIndex < currentIndex;
                    const isCurrent = phaseIndex === currentIndex;

                    return (
                      <div
                        key={phase}
                        className={cn(
                          'h-1.5 flex-1 rounded-full',
                          isCompleted
                            ? 'bg-green-500'
                            : isCurrent
                              ? 'bg-primary'
                              : 'bg-muted'
                        )}
                      />
                    );
                  })}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {project.strategyInput?.businessName || 'No business name yet'}
                  </span>
                  <button
                    onClick={(e) => handleDeleteProject(e, project.id)}
                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* New project card */}
            <button
              onClick={handleCreateProject}
              className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-6 min-h-[180px] hover:border-primary hover:bg-accent/50 transition-all"
            >
              <Plus className="h-8 w-8 text-muted-foreground mb-2" />
              <span className="text-sm text-muted-foreground">New Project</span>
            </button>
          </div>
        )}
      </main>
    </>
  );
}
