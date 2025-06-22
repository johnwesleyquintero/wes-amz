// Define specific types for each data category
type StaticDataTypes = {
  projects: { title: string; description: string; [key: string]: unknown };
  blog: { title: string; content: string; [key: string]: unknown };
  "case-studies": {
    title: string;
    description: string;
    [key: string]: unknown;
  };
  changelog: { version: string; changes: string[]; [key: string]: unknown };
  experience: { company: string; role: string; [key: string]: unknown };
};

// Utility function to load static data from JSON files
export async function loadStaticData<T extends keyof StaticDataTypes>(
  file: T,
): Promise<StaticDataTypes[T]> {
  if (file === "projects") {
    return (await import("../data/portfolio-data/projects.json")).default;
  }
  if (file === "blog") {
    return (await import("../data/portfolio-data/blog.json")).default;
  }
  if (file === "case-studies") {
    return (await import("../data/portfolio-data/case-studies.json")).default;
  }
  if (file === "changelog") {
    return (await import("../data/portfolio-data/changelog.json")).default;
  }
  if (file === "experience") {
    return (await import("../data/portfolio-data/experience.json")).default;
  }
  throw new Error(`Invalid file type: ${file}`);
}

// Example usage:
// const projectsData = await loadStaticData<ProjectsData>('projects');
