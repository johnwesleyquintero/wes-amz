export interface Skill {
  name: string;
  level: number;
  icon: string;
}

export interface Experience {
  title: string;
  company: string;
  period: string;
  description: string;
  achievements: string[];
}

export interface Education {
  degree: string;
  institution: string;
  period: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  category: "frontend" | "backend" | "fullstack" | "data";
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  image: string;
  readingTime?: string;
  author?: string;
  content?: string;
  relatedPosts?: {
    slug: string;
    title: string;
    description: string;
  }[];
}
