export const siteConfig = {
  name: "Wesley Quintero",
  title: "Data Analytics Innovator",
  description:
    "Building tools that streamline workflows and provide valuable insights.",
  url: "https://wesleyquintero.dev",
  links: {
    github: "https://github.com/johnwesleyquintero",
    linkedin: "https://linkedin.com/in/wesleyquintero",
    twitter: "https://twitter.com/wesleyquintero",
    email: "johnwesleyquintero@gmail.com",
  },
  env: {
    VITE_REDIS_URL: import.meta.env.VITE_REDIS_URL,
    VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL,
  },
};
