'use client';

import { useEffect, useRef, useState } from 'react';
import { FishSighting } from '@/types/api';

interface MapViewProps {
  sightings: FishSighting[];
}

export default function MapView({ sightings }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);

  useEffect(() => {
    // Simple map implementation - in production, use MapLibre GL
    // For demo purposes, we'll show a static representation
    setMapError(false);
  }, [sightings]);

  if (mapError) {
    return (
      <div className="w-full h-96 bg-ocean-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🗺️</div>
          <p className="text-ocean-700">Map unavailable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-br from-ocean-100 to-blue-200 rounded-lg shadow-lg overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full">
        {/* Static map representation for demo */}
        <div className="w-full h-full flex items-center justify-center relative">
          <div className="absolute inset-0 opacity-10">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M20,50 Q40,30 50,50 T80,50" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <path d="M10,60 Q30,40 50,60 T90,60" stroke="currentColor" fill="none" strokeWidth="0.5" />
              <circle cx="30" cy="40" r="1" fill="currentColor" />
              <circle cx="60" cy="35" r="1" fill="currentColor" />
              <circle cx="45" cy="55" r="1" fill="currentColor" />
              <circle cx="70" cy="50" r="1" fill="currentColor" />
            </svg>
          </div>

          <div className="z-10 text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-2xl font-bold text-ocean-900 mb-2">Fish Sightings Map</h3>
            <p className="text-ocean-700 mb-4">{sightings.length} sightings recorded</p>

            <div className="bg-white/80 backdrop-blur rounded-lg p-6 max-w-md mx-auto">
              <div className="grid grid-cols-2 gap-4 text-left">
                {sightings.slice(0, 6).map((sighting) => (
                  <div key={sighting.id} className="flex items-center space-x-2">
                    <span className="text-2xl">📍</span>
                    <div className="text-sm">
                      <div className="font-semibold text-ocean-900">{sighting.fish?.name}</div>
                      <div className="text-xs text-ocean-600">{sighting.location}</div>
                    </div>
                  </div>
                ))}
              </div>
              {sightings.length > 6 && (
                <p className="text-sm text-ocean-600 mt-4 text-center">
                  +{sightings.length - 6} more sightings
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
