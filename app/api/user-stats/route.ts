import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get('fid');

  if (!fid) {
    return NextResponse.json(
      { error: 'FID (Farcaster ID) is required' },
      { status: 400 }
    );
  }

  try {
    // Get user data from Neynar API
    const userResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`,
      {
        headers: {
          'api_key': process.env.NEYNAR_API_KEY || '',
          'Content-Type': 'application/json',
        },
      }
    );

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user data');
    }

    const userData = await userResponse.json();
    const user = userData.users[0];

    // Get user's casts
    const castsResponse = await fetch(
      `https://api.neynar.com/v2/farcaster/feed/user/${fid}?limit=150`,
      {
        headers: {
          'api_key': process.env.NEYNAR_API_KEY || '',
          'Content-Type': 'application/json',
        },
      }
    );

    const castsData = await castsResponse.json();
    const casts = castsData.casts || [];

    // Calculate engagement metrics
    const totalLikes = casts.reduce((sum: number, cast: any) => 
      sum + (cast.reactions?.likes_count || 0), 0
    );
    
    const totalReplies = casts.reduce((sum: number, cast: any) => 
      sum + (cast.replies?.count || 0), 0
    );
    
    const totalRecasts = casts.reduce((sum: number, cast: any) => 
      sum + (cast.reactions?.recasts_count || 0), 0
    );

    const engagementStats = {
      user: {
        fid: user.fid,
        username: user.username,
        display_name: user.display_name,
        pfp_url: user.pfp_url,
        follower_count: user.follower_count,
        following_count: user.following_count,
      },
      activity: {
        total_casts: casts.length,
        total_likes: totalLikes,
        total_replies: totalReplies,
        total_recasts: totalRecasts,
        avg_engagement: casts.length > 0 
          ? ((totalLikes + totalReplies + totalRecasts) / casts.length).toFixed(2)
          : 0,
      },
      topCasts: casts
        .sort((a: any, b: any) => {
          const engagementA = (a.reactions?.likes_count || 0) + (a.replies?.count || 0);
          const engagementB = (b.reactions?.likes_count || 0) + (b.replies?.count || 0);
          return engagementB - engagementA;
        })
        .slice(0, 3)
        .map((cast: any) => ({
          hash: cast.hash,
          text: cast.text.substring(0, 100),
          likes: cast.reactions?.likes_count || 0,
          replies: cast.replies?.count || 0,
          recasts: cast.reactions?.recasts_count || 0,
        })),
    };

    return NextResponse.json(engagementStats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch engagement stats' },
      { status: 500 }
    );
  }
}