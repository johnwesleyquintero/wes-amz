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
    VITE_REDIS_URL: import.meta.env.VITE_REDIS_URL || "redis://default:jsMU2rG7qIKR8KJTOyi3SDClPnRzvmE@redis-14221.c270.us-east-1-3.ec2.redns.redis-cloud.com:14221",
    VITE_DATABASE_URL: import.meta.env.VITE_DATABASE_URL || "postgresql://WesData_owner:npg_nZOIul1i3kmc@ep-rough-sky-a4kbpgs5-pooler.us-east-1.aws.neon.tech/WesData?sslmode=require",
  },
};
