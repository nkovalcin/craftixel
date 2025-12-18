'use client';

import { useProjectStore, Phase } from '@/stores/project';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, Save, Loader2 } from 'lucide-react';

const phaseNames: Record<Phase, string> = {
  F1: 'Strategy',
  F2: 'Content',
  F3: 'Tokens',
  F4: 'Components',
  F5: 'Generate',
};

interface AppHeaderProps {
  title?: string;
  description?: string;
  showSaveButton?: boolean;
  showNextButton?: boolean;
  onSave?: () => void;
  onNext?: () => void;
  isSaving?: boolean;
  isNextDisabled?: boolean;
}

export function AppHeader({
  title,
  description,
  showSaveButton = false,
  showNextButton = false,
  onSave,
  onNext,
  isSaving = false,
  isNextDisabled = false,
}: AppHeaderProps) {
  const { getCurrentProject } = useProjectStore();
  const project = getCurrentProject();

  const phaseOrder: Phase[] = ['F1', 'F2', 'F3', 'F4', 'F5'];
  const currentPhaseIndex = project ? phaseOrder.indexOf(project.currentPhase) : -1;
  const nextPhase = currentPhaseIndex < 4 ? phaseOrder[currentPhaseIndex + 1] : null;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 backdrop-blur px-6">
      {/* Left side - Title and breadcrumb */}
      <div className="flex items-center gap-4">
        {project && (
          <>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="truncate max-w-[150px]">{project.name}</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </>
        )}
        <div>
          <h1 className="text-lg font-semibold">{title || 'Dashboard'}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        {showSaveButton && onSave && (
          <Button variant="outline" onClick={onSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>
        )}

        {showNextButton && onNext && nextPhase && (
          <Button onClick={onNext} disabled={isNextDisabled}>
            <Play className="h-4 w-4" />
            Continue to {phaseNames[nextPhase]}
          </Button>
        )}
      </div>
    </header>
  );
}
