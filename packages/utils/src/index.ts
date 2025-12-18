// ============================================
// CRAFTIXEL - Shared Utilities
// ============================================

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Project, Phase, FigmaExport, ContentTokens, DesignTokens } from '@craftixel/types';

// ============================================
// CLASSNAME UTILITIES
// ============================================

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// ID GENERATION
// ============================================

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Generate a slug from a string
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Format date to ISO string
 */
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString();
}

/**
 * Format date for display
 */
export function formatDisplayDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ============================================
// PROJECT UTILITIES
// ============================================

/**
 * Create a new project
 */
export function createProject(name: string): Project {
  const now = new Date().toISOString();
  return {
    id: generateId(),
    name,
    createdAt: now,
    updatedAt: now,
    currentPhase: 'F1',
    strategy: null,
    content: null,
    tokens: null,
  };
}

/**
 * Get next phase
 */
export function getNextPhase(current: Phase): Phase | null {
  const phases: Phase[] = ['F1', 'F2', 'F3', 'F4', 'F5'];
  const index = phases.indexOf(current);
  return index < phases.length - 1 ? phases[index + 1] : null;
}

/**
 * Get previous phase
 */
export function getPreviousPhase(current: Phase): Phase | null {
  const phases: Phase[] = ['F1', 'F2', 'F3', 'F4', 'F5'];
  const index = phases.indexOf(current);
  return index > 0 ? phases[index - 1] : null;
}

/**
 * Get phase label
 */
export function getPhaseLabel(phase: Phase): string {
  const labels: Record<Phase, string> = {
    F1: 'Strategy',
    F2: 'Content',
    F3: 'Tokens',
    F4: 'Preview',
    F5: 'Export',
  };
  return labels[phase];
}

/**
 * Get phase description
 */
export function getPhaseDescription(phase: Phase): string {
  const descriptions: Record<Phase, string> = {
    F1: 'Tell us about your business',
    F2: 'Generate and edit your content',
    F3: 'Customize your design tokens',
    F4: 'Preview your components',
    F5: 'Export to Figma',
  };
  return descriptions[phase];
}

// ============================================
// EXPORT UTILITIES
// ============================================

/**
 * Create Figma export JSON
 */
export function createFigmaExport(
  project: Project,
  options: { variables?: boolean; components?: boolean; pages?: boolean } = {}
): FigmaExport | null {
  if (!project.content || !project.tokens) {
    return null;
  }

  return {
    version: '1.0.0',
    project: {
      name: project.name,
      id: project.id,
    },
    content: project.content,
    tokens: project.tokens,
    generateOptions: {
      variables: options.variables ?? true,
      components: options.components ?? true,
      pages: options.pages ?? true,
    },
  };
}

/**
 * Download JSON file
 */
export function downloadJson(data: object, filename: string): void {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Copy to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

// ============================================
// VALIDATION UTILITIES
// ============================================

/**
 * Check if project is ready for export
 */
export function isProjectReadyForExport(project: Project): boolean {
  return !!(project.content && project.tokens);
}

/**
 * Check if phase is accessible
 */
export function isPhaseAccessible(project: Project, phase: Phase): boolean {
  const requirements: Record<Phase, boolean> = {
    F1: true, // Always accessible
    F2: !!project.strategy, // Need strategy
    F3: !!project.content, // Need content
    F4: !!project.tokens, // Need tokens
    F5: !!project.content && !!project.tokens, // Need both
  };
  return requirements[phase];
}

// ============================================
// LOCAL STORAGE
// ============================================

const STORAGE_KEY = 'craftixel_project';

/**
 * Save project to localStorage
 */
export function saveProjectToStorage(project: Project): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(project));
  } catch (error) {
    console.error('Failed to save project:', error);
  }
}

/**
 * Load project from localStorage
 */
export function loadProjectFromStorage(): Project | null {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to load project:', error);
    return null;
  }
}

/**
 * Clear project from localStorage
 */
export function clearProjectFromStorage(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear project:', error);
  }
}

// ============================================
// STRING UTILITIES
// ============================================

/**
 * Truncate string with ellipsis
 */
export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Count words in string
 */
export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Count characters in string
 */
export function countCharacters(str: string): number {
  return str.length;
}
