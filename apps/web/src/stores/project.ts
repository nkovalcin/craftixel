'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Phase = 'F1' | 'F2' | 'F3' | 'F4' | 'F5';

export interface StrategyInput {
  businessName: string;
  businessType: string;
  targetAudience: string;
  problem: string;
  solution: string;
  uniqueValue: string;
  tone: string;
  competitors: string;
}

export interface StrategyOutput {
  positioning: string;
  valueProposition: string;
  messaging: {
    headline: string;
    subheadline: string;
    tagline: string;
  };
  sections: string[];
  toneGuidelines: string[];
}

export interface ContentTokens {
  brand: {
    name: string;
    tagline: string;
    description: string;
  };
  sections: {
    id: string;
    type: string;
    headline: string;
    subheadline: string;
    description: string;
    cta?: {
      primary: string;
      secondary?: string;
    };
    items?: {
      title: string;
      description: string;
      icon?: string;
    }[];
  }[];
  microcopy: {
    navigation: string[];
    buttons: Record<string, string>;
    labels: Record<string, string>;
    errors: Record<string, string>;
  };
}

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    accent: ColorScale;
    neutral: ColorScale;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    foreground: string;
    muted: string;
    mutedForeground: string;
    border: string;
  };
  typography: {
    fontFamily: {
      sans: string;
      serif: string;
      mono: string;
    };
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
      '5xl': string;
      '6xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  spacing: {
    base: number;
    scale: number[];
  };
  effects: {
    borderRadius: {
      none: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      full: string;
    };
    shadow: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
    };
  };
  layout: {
    container: {
      maxWidth: string;
      padding: string;
    };
    breakpoints: {
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
    };
  };
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  currentPhase: Phase;
  strategyInput: StrategyInput | null;
  strategyOutput: StrategyOutput | null;
  content: ContentTokens | null;
  tokens: DesignTokens | null;
}

interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;

  // Actions
  createProject: (name: string) => Project;
  deleteProject: (id: string) => void;
  setCurrentProject: (id: string | null) => void;
  getCurrentProject: () => Project | null;
  updateProject: (id: string, updates: Partial<Project>) => void;

  // Phase actions
  setPhase: (phase: Phase) => void;
  updateStrategyInput: (input: Partial<StrategyInput>) => void;
  setStrategyOutput: (output: StrategyOutput) => void;
  setContent: (content: ContentTokens) => void;
  setTokens: (tokens: DesignTokens) => void;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set, get) => ({
      projects: [],
      currentProjectId: null,

      createProject: (name: string) => {
        const project: Project = {
          id: generateId(),
          name,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          currentPhase: 'F1',
          strategyInput: null,
          strategyOutput: null,
          content: null,
          tokens: null,
        };

        set((state) => ({
          projects: [...state.projects, project],
          currentProjectId: project.id,
        }));

        return project;
      },

      deleteProject: (id: string) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId: state.currentProjectId === id ? null : state.currentProjectId,
        }));
      },

      setCurrentProject: (id: string | null) => {
        set({ currentProjectId: id });
      },

      getCurrentProject: () => {
        const { projects, currentProjectId } = get();
        return projects.find((p) => p.id === currentProjectId) || null;
      },

      updateProject: (id: string, updates: Partial<Project>) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id
              ? { ...p, ...updates, updatedAt: new Date().toISOString() }
              : p
          ),
        }));
      },

      setPhase: (phase: Phase) => {
        const { currentProjectId, updateProject } = get();
        if (currentProjectId) {
          updateProject(currentProjectId, { currentPhase: phase });
        }
      },

      updateStrategyInput: (input: Partial<StrategyInput>) => {
        const { currentProjectId, projects, updateProject } = get();
        if (currentProjectId) {
          const project = projects.find((p) => p.id === currentProjectId);
          if (project) {
            updateProject(currentProjectId, {
              strategyInput: { ...project.strategyInput, ...input } as StrategyInput,
            });
          }
        }
      },

      setStrategyOutput: (output: StrategyOutput) => {
        const { currentProjectId, updateProject } = get();
        if (currentProjectId) {
          updateProject(currentProjectId, { strategyOutput: output });
        }
      },

      setContent: (content: ContentTokens) => {
        const { currentProjectId, updateProject } = get();
        if (currentProjectId) {
          updateProject(currentProjectId, { content });
        }
      },

      setTokens: (tokens: DesignTokens) => {
        const { currentProjectId, updateProject } = get();
        if (currentProjectId) {
          updateProject(currentProjectId, { tokens });
        }
      },
    }),
    {
      name: 'craftixel-projects',
    }
  )
);
