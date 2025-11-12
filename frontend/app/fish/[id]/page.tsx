'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Fish } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function FishDetails() {
  const params = useParams();
  const router = useRouter();
  const [fish, setFish] = useState<Fish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const fetchFishDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const id = parseInt(params.id as string);
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
  }, [params.id]);

  const toggleSeen = async () => {
    if (!fish || updating) return;

    try {
      setUpdating(true);
      const updatedFish = await fishApi.updateSeen(fish.id, !fish.seen);
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-ocean-600 hover:text-ocean-800 font-medium mb-6 transition-colors duration-200"
      >
        <span>←</span>
        <span>Back to Catalogue</span>
      </Link>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="relative h-96 bg-ocean-100">
          <Image
            src={fish.imageUrl}
            alt={fish.name}
            fill
            className="object-cover"
            priority
          />
          {fish.seen && (
            <div className="absolute top-6 right-6 bg-green-500 text-white px-5 py-2 rounded-full text-lg font-bold shadow-xl flex items-center space-x-2">
              <span>✓</span>
              <span>Seen</span>
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-ocean-900 mb-2">{fish.name}</h1>
            <p className="text-xl text-ocean-600 italic">{fish.scientificName}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold text-ocean-900 mb-3">Description</h2>
            <p className="text-lg text-ocean-700 leading-relaxed">{fish.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-ocean-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ocean-900 mb-2 uppercase tracking-wide">Habitat</h3>
              <p className="text-ocean-700 text-lg">{fish.habitat}</p>
            </div>
            <div className="bg-ocean-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-ocean-900 mb-2 uppercase tracking-wide">Size</h3>
              <p className="text-ocean-700 text-lg">{fish.size}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-ocean-200">
            <div>
              <p className="text-sm text-ocean-600 mb-1">Status</p>
              <p className="text-2xl font-bold text-ocean-900">
                {fish.seen ? '✓ Seen in the wild' : '◯ Not yet seen'}
              </p>
            </div>
            <button
              onClick={toggleSeen}
              disabled={updating}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                updating
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : fish.seen
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-green-500 hover:bg-green-600 text-white'
              }`}
            >
              {updating ? 'Updating...' : fish.seen ? 'Mark as Unseen' : 'Mark as Seen'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
