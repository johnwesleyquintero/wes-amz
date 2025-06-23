export interface ContentItem {
  id: string;
  date: string;
  text: string;
}

export interface LandingContent {
  welcomeTitle: string;
  welcomeText: string;
  announcementsTitle: string;
  announcements: ContentItem[];
  featureUpdatesTitle: string;
  featureUpdates: ContentItem[];
  navigationTitle: string;
  navigationText: string;
}

const today = new Date().toLocaleDateString();

export const landingContent: LandingContent = {
  welcomeTitle: "Welcome to the Dashboard!",
  welcomeText:
    "Here you can find all the tools you need to manage your Amazon business.",
  announcementsTitle: "Announcements",
  announcements: [
    {
      id: "announcement-1",
      date: today,
      text: "New feature: PPC Campaign Auditor!",
    },
    {
      id: "announcement-2",
      date: today,
      text: "Improved Sales Trend Analyzer.",
    },
  ],
  featureUpdatesTitle: "Feature Updates",
  featureUpdates: [
    {
      id: "feature-1",
      date: today,
      text: "Added support for multiple Amazon marketplaces.",
    },
    {
      id: "feature-2",
      date: today,
      text: "Enhanced Keyword Analyzer with more data sources.",
    },
  ],
  navigationTitle: "Navigation",
  navigationText:
    "Use the sidebar to navigate to different tools and features.",
};
