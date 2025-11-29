'use client';

import { useState, useEffect } from 'react';
import { MiniKit } from '@worldcoin/minikit-js';
import { USDC_ABI, USDC_ADDRESS, USDC_DECIMALS } from '@/lib/usdc-abi';

interface UserStats {
  user: {
    fid: number;
    username: string;
    display_name: string;
    pfp_url: string;
    follower_count: number;
    following_count: number;
  };
  activity: {
    total_casts: number;
    total_likes: number;
    total_replies: number;
    total_recasts: number;
    avg_engagement: string;
  };
  topCasts: Array<{
    hash: string;
    text: string;
    likes: number;
    replies: number;
    recasts: number;
  }>;
}

export default function Home() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tipping, setTipping] = useState(false);
  const [tipAmount, setTipAmount] = useState('1');
  const [testFid, setTestFid] = useState(''); // For testing

  useEffect(() => {
    // For testing locally, we'll use a test FID
    // In production with MiniKit, this will get real user FID
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const fidParam = urlParams.get('fid') || '3'; // Default test FID
      setTestFid(fidParam);
      fetchUserStats(fidParam);
    }
  }, []);

  const fetchUserStats = async (fid: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/user-stats?fid=${fid}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch stats');
      }

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError('Failed to load engagement stats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTip = async () => {
    alert('Tip functionality will work when deployed as a Mini App with MiniKit!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading your stats...</div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error || 'Unable to load stats'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-500 to-blue-700 p-4 pb-8">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Testing Panel */}
        <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-4">
          <p className="text-sm text-yellow-800 mb-2">
            🧪 Testing Mode - Try different FIDs:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={testFid}
              onChange={(e) => setTestFid(e.target.value)}
              placeholder="Enter FID"
              className="flex-1 px-3 py-2 border rounded"
            />
            <button
              onClick={() => fetchUserStats(testFid)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Load
            </button>
          </div>
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={stats.user.pfp_url}
              alt={stats.user.display_name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {stats.user.display_name}
              </h1>
              <p className="text-gray-600">@{stats.user.username}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {stats.user.follower_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {stats.user.following_count.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
          </div>
        </div>

        {/* Engagement Stats Card */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            📊 Engagement Stats
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-purple-50 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {stats.activity.total_casts.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Casts</div>
            </div>
            
            <div className="p-3 bg-pink-50 rounded">
              <div className="text-2xl font-bold text-pink-600">
                {stats.activity.total_likes.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Likes</div>
            </div>
            
            <div className="p-3 bg-green-50 rounded">
              <div className="text-2xl font-bold text-green-600">
                {stats.activity.total_replies.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Replies</div>
            </div>
            
            <div className="p-3 bg-orange-50 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {stats.activity.total_recasts.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Recasts</div>
            </div>
          </div>

          <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded text-white text-center">
            <div className="text-3xl font-bold">
              {stats.activity.avg_engagement}
            </div>
            <div className="text-sm">Average Engagement per Cast</div>
          </div>
        </div>

        {/* Top Casts */}
        {stats.topCasts.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              🔥 Top Performing Casts
            </h2>
            
            <div className="space-y-3">
              {stats.topCasts.map((cast, index) => (
                <div key={cast.hash} className="p-3 bg-gray-50 rounded">
                  <div className="flex items-center mb-2">
                    <span className="text-lg font-bold text-blue-600 mr-2">
                      #{index + 1}
                    </span>
                    <span className="text-sm text-gray-700">{cast.text}...</span>
                  </div>
                  <div className="flex space-x-4 text-xs text-gray-600">
                    <span>❤️ {cast.likes}</span>
                    <span>💬 {cast.replies}</span>
                    <span>🔄 {cast.recasts}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tip Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Support the Developer 💙
            </h3>
            <p className="text-sm text-gray-600">
              Enjoying this app? Send a tip in USDC!
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tip Amount (USDC)
            </label>
            <div className="flex gap-2 mb-3">
              {['1', '5', '10'].map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTipAmount(amount)}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition ${
                    tipAmount === amount
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ${amount}
                </button>
              ))}
            </div>
            <input
              type="number"
              value={tipAmount}
              onChange={(e) => setTipAmount(e.target.value)}
              min="0.01"
              step="0.01"
              placeholder="Custom amount"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <button
            onClick={handleTip}
            disabled={tipping || !tipAmount || parseFloat(tipAmount) <= 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg transition disabled:opacity-50"
          >
            {tipping ? 'Processing...' : `💰 Send ${tipAmount} USDC Tip`}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-3">
            Wallet: 0x6bc6...2ae9
          </p>
        </div>
      </div>
    </div>
  );
}