export interface ContentItem {
  id: string;
  date: string; // Consider using Date or a more specific date string format if needed elsewhere
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

// Calculate the date string once when the module is initialized.
// This is suitable for static data intended to reflect the date the data source was built or processed.
const todayString: string = new Date().toLocaleDateString();

export const landingContent: LandingContent = {
  welcomeTitle: "Welcome to the Dashboard!",
  welcomeText: "Here you can find all the tools you need to manage your Amazon business.",
  announcementsTitle: "Announcements",
  announcements: [
    {
      id: "announcement-1",
      date: todayString,
      text: "New feature: PPC Campaign Auditor!",
    },
    {
      id: "announcement-2",
      date: todayString,
      text: "Improved Sales Trend Analyzer.",
    },
  ],
  featureUpdatesTitle: "Feature Updates",
  featureUpdates: [
    {
      id: "feature-1",
      date: todayString,
      text: "Added support for multiple Amazon marketplaces.",
    },
    {
      id: "feature-2",
      date: todayString,
      text: "Enhanced Keyword Analyzer with more data sources.",
    },
  ],
  navigationTitle: "Navigation",
  navigationText: "Use the sidebar to navigate to different tools and features.",
};