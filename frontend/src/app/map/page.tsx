'use client';

import { useState, useEffect } from 'react';
import { FishSighting } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import MapView from '@/components/MapView';

export default function MapPage() {
  const [sightings, setSightings] = useState<FishSighting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSightings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fishApi.getSightings();
      setSightings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load sightings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSightings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-ocean-900 mb-3">Sightings Map</h1>
        <p className="text-xl text-ocean-700">
          Explore where fish have been spotted around the world
        </p>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchSightings} />
      ) : (
        <>
          <MapView sightings={sightings} />

          <div className="mt-8 card p-6">
            <h2 className="text-2xl font-bold text-ocean-900 mb-6">Recent Sightings</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {sightings.slice(0, 9).map((sighting) => (
                <div key={sighting.id} className="p-4 bg-ocean-50 rounded-lg">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">📍</span>
                    <div className="flex-1">
                      <h3 className="font-bold text-ocean-900">{sighting.fish?.name}</h3>
                      <p className="text-sm text-ocean-600 mb-1">{sighting.location}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(sighting.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
