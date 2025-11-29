const ROOT_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const minikitConfig = {
  accountAssociation: {
    // Akan diisi setelah sign manifest
    "header": "",
    "payload": "",
    "signature": ""
  },
  miniapp: {
    version: "1",
    name: "Base Engagement Checker", 
    subtitle: "Check Your Base Stats", 
    description: "View your Base app engagement metrics including casts, likes, replies, and followers. Support the developer with tips!",
    screenshotUrls: [`${ROOT_URL}/screenshot.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#0052FF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["analytics", "engagement", "stats", "metrics", "farcaster"],
    heroImageUrl: `${ROOT_URL}/hero.png`, 
    tagline: "Track Your Base Engagement",
    ogTitle: "Base Engagement Checker",
    ogDescription: "Check your Base app engagement metrics and activity",
    ogImageUrl: `${ROOT_URL}/hero.png`,
  },
} as const;

export default minikitConfig;