'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stats } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import StatsChart from '@/components/StatsChart';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fishApi.getStats();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message={error} onRetry={fetchStats} />
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-ocean-900 mb-2">Dashboard</h1>
        <p className="text-lg text-ocean-700">Track your fish sighting progress</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-ocean-500 to-ocean-600 text-white">
          <div className="text-5xl mb-3">🐟</div>
          <div className="text-ocean-100 text-sm font-medium mb-1">Total Fish</div>
          <div className="text-4xl font-bold">{stats.total}</div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <div className="text-5xl mb-3">✓</div>
          <div className="text-green-100 text-sm font-medium mb-1">Fish Seen</div>
          <div className="text-4xl font-bold">{stats.seen}</div>
        </div>

        <div className="card p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <div className="text-5xl mb-3">◯</div>
          <div className="text-blue-100 text-sm font-medium mb-1">Not Yet Seen</div>
          <div className="text-4xl font-bold">{stats.unseen}</div>
        </div>
      </div>

      <div className="card p-8 mb-8">
        <h2 className="text-2xl font-bold text-ocean-900 mb-6">Progress Overview</h2>
        <StatsChart seen={stats.seen} unseen={stats.unseen} />

        <div className="mt-8 text-center">
          <div className="inline-block bg-ocean-50 rounded-full px-8 py-4">
            <div className="text-sm text-ocean-600 font-medium mb-1">Completion Rate</div>
            <div className="text-5xl font-bold text-ocean-900">{stats.percentageSeen}%</div>
          </div>
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-r from-ocean-50 to-blue-50">
        <h2 className="text-2xl font-bold text-ocean-900 mb-4">Keep Exploring!</h2>
        <p className="text-ocean-700 text-lg mb-6">
          {stats.unseen > 0
            ? `You have ${stats.unseen} more ${stats.unseen === 1 ? 'fish' : 'fish'} to discover. Keep exploring the ocean!`
            : 'Congratulations! You\'ve seen all the fish in the catalogue! 🎉'}
        </p>
        <Link
          href="/"
          className="inline-block bg-ocean-600 hover:bg-ocean-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
        >
          Browse Fish Catalogue
        </Link>
      </div>
    </div>
  );
}
