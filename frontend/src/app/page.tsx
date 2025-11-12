'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Stats } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import StatsCard from '@/components/StatsCard';
import ProgressChart from '@/components/ProgressChart';

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

  if (!stats) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-ocean-900 mb-3">Dashboard</h1>
        <p className="text-xl text-ocean-700">Track your fish spotting progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Species"
          value={stats.total}
          icon="🐠"
          gradient="from-ocean-500 to-ocean-600"
        />
        <StatsCard
          title="Fish Spotted"
          value={stats.seen}
          icon="✓"
          gradient="from-green-500 to-green-600"
        />
        <StatsCard
          title="Not Yet Spotted"
          value={stats.unseen}
          icon="◯"
          gradient="from-gray-500 to-gray-600"
        />
        <StatsCard
          title="Completion"
          value={`${stats.percentageSeen}%`}
          icon="📊"
          gradient="from-purple-500 to-purple-600"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-ocean-900 mb-6">Overall Progress</h2>
          <ProgressChart seen={stats.seen} unseen={stats.unseen} />
        </div>

        <div className="card p-8">
          <h2 className="text-2xl font-bold text-ocean-900 mb-6">By Rarity</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="badge badge-common">Common</span>
                <span className="text-gray-700 font-medium">
                  {stats.byRarity.common.seen} / {stats.byRarity.common.total}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-700">
                {stats.byRarity.common.total > 0
                  ? Math.round((stats.byRarity.common.seen / stats.byRarity.common.total) * 100)
                  : 0}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="badge badge-rare">Rare</span>
                <span className="text-blue-700 font-medium">
                  {stats.byRarity.rare.seen} / {stats.byRarity.rare.total}
                </span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                {stats.byRarity.rare.total > 0
                  ? Math.round((stats.byRarity.rare.seen / stats.byRarity.rare.total) * 100)
                  : 0}%
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="badge badge-epic">Epic</span>
                <span className="text-purple-700 font-medium">
                  {stats.byRarity.epic.seen} / {stats.byRarity.epic.total}
                </span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                {stats.byRarity.epic.total > 0
                  ? Math.round((stats.byRarity.epic.seen / stats.byRarity.epic.total) * 100)
                  : 0}%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-8 bg-gradient-to-r from-ocean-50 to-blue-50">
        <h2 className="text-3xl font-bold text-ocean-900 mb-4">Keep Exploring! 🌊</h2>
        <p className="text-ocean-700 text-lg mb-6">
          {stats.unseen > 0
            ? `You have ${stats.unseen} more ${stats.unseen === 1 ? 'species' : 'species'} to discover. Dive into the catalog and start spotting!`
            : 'Incredible! You\'ve spotted all fish species! 🎉'}
        </p>
        <div className="flex gap-4">
          <Link href="/catalog" className="btn-primary">
            Browse Catalog
          </Link>
          <Link href="/map" className="btn-secondary">
            View Map
          </Link>
        </div>
      </div>
    </div>
  );
}
