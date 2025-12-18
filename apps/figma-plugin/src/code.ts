// ============================================
// CRAFTIXEL FIGMA PLUGIN
// Main Entry Point
// ============================================

import { generateVariables } from './generators/variables';
import { generateAtoms } from './generators/atoms';
import { generateMolecules } from './generators/molecules';
import { generateOrganisms } from './generators/organisms';
import { generatePages } from './generators/pages';
import type { FigmaExport } from './types';

// ============================================
// PLUGIN CONFIGURATION
// ============================================

const PLUGIN_WIDTH = 400;
const PLUGIN_HEIGHT = 600;

// ============================================
// MAIN
// ============================================

figma.showUI(__html__, {
  width: PLUGIN_WIDTH,
  height: PLUGIN_HEIGHT,
  title: 'Craftixel Generator',
});

// Current project data
let currentProject: FigmaExport | null = null;

// ============================================
// MESSAGE HANDLERS
// ============================================

figma.ui.onmessage = async (msg: { type: string; data?: unknown }) => {
  try {
    switch (msg.type) {
      case 'import-json':
        await handleImport(msg.data as string);
        break;

      case 'generate-all':
        await handleGenerateAll();
        break;

      case 'generate-variables':
        await handleGenerateVariables();
        break;

      case 'generate-components':
        await handleGenerateComponents();
        break;

      case 'generate-pages':
        await handleGeneratePages();
        break;

      case 'cancel':
        figma.closePlugin();
        break;

      default:
        console.warn('Unknown message type:', msg.type);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    figma.notify(`Error: ${errorMessage}`, { error: true });
    figma.ui.postMessage({ type: 'error', message: errorMessage });
  }
};

// ============================================
// HANDLERS
// ============================================

async function handleImport(jsonString: string): Promise<void> {
  try {
    const data = JSON.parse(jsonString) as FigmaExport;

    // Validate structure
    if (!data.version || !data.project || !data.content || !data.tokens) {
      throw new Error('Invalid project format. Missing required fields.');
    }

    currentProject = data;
    figma.notify(`Project "${data.project.name}" imported successfully!`);
    figma.ui.postMessage({
      type: 'import-success',
      projectName: data.project.name,
    });
  } catch (error) {
    throw new Error(`Failed to parse JSON: ${error instanceof Error ? error.message : 'Invalid JSON'}`);
  }
}

async function handleGenerateAll(): Promise<void> {
  if (!currentProject) {
    throw new Error('No project imported. Please import a project first.');
  }

  figma.ui.postMessage({ type: 'generation-start' });

  const { tokens, content, generateOptions } = currentProject;

  // Step 1: Variables
  if (generateOptions.variables) {
    figma.ui.postMessage({ type: 'progress', step: 'variables', progress: 10 });
    await generateVariables(tokens);
    figma.notify('Variables created');
  }

  // Step 2: Atoms
  if (generateOptions.components) {
    figma.ui.postMessage({ type: 'progress', step: 'atoms', progress: 30 });
    await generateAtoms(tokens);
    figma.notify('Atom components created');

    // Step 3: Molecules
    figma.ui.postMessage({ type: 'progress', step: 'molecules', progress: 50 });
    await generateMolecules(tokens);
    figma.notify('Molecule components created');

    // Step 4: Organisms
    figma.ui.postMessage({ type: 'progress', step: 'organisms', progress: 70 });
    await generateOrganisms(tokens, content);
    figma.notify('Organism components created');
  }

  // Step 5: Pages
  if (generateOptions.pages) {
    figma.ui.postMessage({ type: 'progress', step: 'pages', progress: 90 });
    await generatePages(tokens, content, currentProject.project.name);
    figma.notify('Pages created');
  }

  figma.ui.postMessage({ type: 'progress', step: 'complete', progress: 100 });
  figma.notify('Design system generated successfully!', { timeout: 3000 });
  figma.ui.postMessage({ type: 'generation-complete' });
}

async function handleGenerateVariables(): Promise<void> {
  if (!currentProject) {
    throw new Error('No project imported. Please import a project first.');
  }

  figma.ui.postMessage({ type: 'generation-start' });
  await generateVariables(currentProject.tokens);
  figma.ui.postMessage({ type: 'generation-complete' });
  figma.notify('Variables created successfully!');
}

async function handleGenerateComponents(): Promise<void> {
  if (!currentProject) {
    throw new Error('No project imported. Please import a project first.');
  }

  figma.ui.postMessage({ type: 'generation-start' });

  await generateAtoms(currentProject.tokens);
  await generateMolecules(currentProject.tokens);
  await generateOrganisms(currentProject.tokens, currentProject.content);

  figma.ui.postMessage({ type: 'generation-complete' });
  figma.notify('Components created successfully!');
}

async function handleGeneratePages(): Promise<void> {
  if (!currentProject) {
    throw new Error('No project imported. Please import a project first.');
  }

  figma.ui.postMessage({ type: 'generation-start' });
  await generatePages(
    currentProject.tokens,
    currentProject.content,
    currentProject.project.name
  );
  figma.ui.postMessage({ type: 'generation-complete' });
  figma.notify('Pages created successfully!');
}
