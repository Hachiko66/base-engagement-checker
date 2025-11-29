import { NextResponse } from 'next/server';

export async function GET() {
    
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  
  const manifest = {
  "accountAssociation": {
    "header": "eyJmaWQiOjMwMDQwNSwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDVhMWFEZDczNmVEYkVGYUZDODk0M0Q0NkYxZjU5ODNiRGM2MzA1YjUifQ",
    "payload": "eyJkb21haW4iOiJiYXNlLWVuZ2FnZW1lbnQtY2hlY2tlci52ZXJjZWwuYXBwIn0",
    "signature": "Mn3+I97TrkBNmQkPBrKo9I4t8lra5Kaxb0taQSWHbAM+wwscPsAtYdtoPSt4ZJfWD7ndiWzsixRn8ppZvHS60Bs="
},
    frame: {
      version: "1",
      name: "Base Engagement Checker",
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#0052FF",
      homeUrl: baseUrl,
      webhookUrl: `${baseUrl}/api/webhook`
    },
    miniApp: {
      version: "1",
      name: "Base Engagement Checker",
      subtitle: "Check Your Base Stats",
      description: "View your Base app engagement metrics including casts, likes, replies, and followers. Support the developer with tips!",
      screenshotUrls: [`${baseUrl}/screenshot.png`],
      iconUrl: `${baseUrl}/icon.png`,
      splashImageUrl: `${baseUrl}/splash.png`,
      splashBackgroundColor: "#0052FF",
      homeUrl: baseUrl,
      webhookUrl: `${baseUrl}/api/webhook`,
      primaryCategory: "social",
      tags: ["analytics", "engagement", "stats", "metrics", "farcaster"],
      heroImageUrl: `${baseUrl}/hero.png`,
      tagline: "Track Your Base Engagement",
      ogTitle: "Base Engagement Checker",
      ogDescription: "Check your Base app engagement metrics and activity",
      ogImageUrl: `${baseUrl}/hero.png`
    }
  };

  return NextResponse.json(manifest, {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}