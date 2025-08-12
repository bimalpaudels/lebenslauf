export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
};

// Central registry of templates. Extend this when adding new templates.
const registry: TemplateMeta[] = [
  {
    id: "modern-onepage",
    name: "Modern One-Page",
    description: "Clean one-page CV with styled header and sections",
  },
];

// Map id -> dynamic import for the template module
const loaders: Record<string, () => Promise<any>> = {
  "modern-onepage": () => import("@/templates/modern-onepage/Template"),
};

export function getTemplates(): TemplateMeta[] {
  return registry.slice();
}

export function getTemplateById(id: string): TemplateMeta | undefined {
  return registry.find((t) => t.id === id);
}

export async function loadTemplateModule(id: string): Promise<any | null> {
  const loader = loaders[id];
  if (!loader) return null;
  try {
    return await loader();
  } catch {
    return null;
  }
}

export async function getSampleMarkdown(id: string): Promise<string | null> {
  const mod = await loadTemplateModule(id);
  if (!mod) return null;
  const sample = (mod as any).sampleMarkdown as string | undefined;
  return sample ?? null;
}
