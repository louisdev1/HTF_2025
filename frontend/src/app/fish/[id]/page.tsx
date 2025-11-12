'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Fish } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function FishDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchFishDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = parseInt(resolvedParams.id);
      const data = await fishApi.getById(id);
      setFish(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fish details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFishDetails();
  }, [resolvedParams.id]);

  const toggleSeen = async () => {
    if (!fish || updating) return;

    try {
      setUpdating(true);
      const updatedFish = await fishApi.updateSeen(fish.id, !fish.seen, {
        latitude: 0,
        longitude: 0,
        location: 'Manual Entry'
      });
      setFish(updatedFish);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

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
        <ErrorMessage message={error} onRetry={fetchFishDetails} />
      </div>
    );
  }

  if (!fish) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <ErrorMessage message="Fish not found" />
      </div>
    );
  }

  const rarityColors = {
    Common: 'badge-common',
    Rare: 'badge-rare',
    Epic: 'badge-epic',
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <Link
        href="/catalog"
        className="inline-flex items-center space-x-2 text-ocean-600 hover:text-ocean-800 font-semibold mb-6 transition-colors duration-200 text-lg"
      >
        <span>←</span>
        <span>Back to Catalog</span>
      </Link>

      <div className={`bg-white rounded-2xl shadow-2xl overflow-hidden ${!fish.seen ? 'opacity-80' : ''}`}>
        <div className="relative h-96 bg-ocean-50">
          <Image
            src={fish.imageUrl}
            alt={fish.name}
            fill
            className={`object-cover ${!fish.seen ? 'grayscale' : ''}`}
            priority
          />
          <div className="absolute top-6 left-6">
            <span className={`badge ${rarityColors[fish.rarity]} text-base`}>
              {fish.rarity}
            </span>
          </div>
          {fish.seen && (
            <div className="absolute top-6 right-6 bg-green-500 text-white px-5 py-2 rounded-full text-lg font-bold shadow-xl flex items-center space-x-2">
              <span>✓</span>
              <span>Spotted</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-5xl font-bold text-ocean-900 mb-2">{fish.name}</h1>
            <p className="text-2xl text-ocean-600 italic">{fish.scientificName}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-ocean-900 mb-4">Description</h2>
            <p className="text-lg text-gray-700 leading-relaxed">{fish.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-ocean-50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-ocean-900 mb-2 uppercase tracking-wide">
                🌍 Habitat
              </h3>
              <p className="text-ocean-700 text-lg">{fish.habitat}</p>
            </div>
            <div className="bg-ocean-50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-ocean-900 mb-2 uppercase tracking-wide">
                📏 Size
              </h3>
              <p className="text-ocean-700 text-lg">{fish.size}</p>
            </div>
            <div className="bg-ocean-50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-ocean-900 mb-2 uppercase tracking-wide">
                📊 Depth Range
              </h3>
              <p className="text-ocean-700 text-lg">{fish.minDepth}m - {fish.maxDepth}m</p>
            </div>
            <div className="bg-ocean-50 rounded-xl p-6">
              <h3 className="text-sm font-bold text-ocean-900 mb-2 uppercase tracking-wide">
                👁️ Sightings
              </h3>
              <p className="text-ocean-700 text-lg">{fish.sightingCount || 0} recorded</p>
            </div>
          </div>

          {fish.seen && fish.lastSeen && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-xl">
              <p className="text-green-900 font-semibold text-lg">
                🎉 Last spotted: {new Date(fish.lastSeen).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-6 border-t-2 border-ocean-200">
            <div>
              <p className="text-sm text-ocean-600 mb-2 font-medium">Current Status</p>
              <p className="text-3xl font-bold text-ocean-900">
                {fish.seen ? '✓ Spotted in the wild' : '◯ Not yet spotted'}
              </p>
            </div>
            <button
              onClick={toggleSeen}
              disabled={updating}
              className={`px-10 py-4 rounded-xl font-bold text-xl transition-all duration-200 ${
                updating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : fish.seen
                  ? 'btn-danger'
                  : 'btn-success'
              }`}
            >
              {updating ? 'Updating...' : fish.seen ? 'Mark as Unspotted' : 'Mark as Spotted'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
