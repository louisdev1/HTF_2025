'use client';

import { useState, useEffect } from 'react';
import { Fish, FilterType } from '@/types/api';
import { fishApi } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import SearchFilter from '@/components/SearchFilter';
import FishGrid from '@/components/FishGrid';

export default function Catalog() {
  const [fish, setFish] = useState<Fish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');
  const [rarity, setRarity] = useState('');

  const fetchFish = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fishApi.getAll(search, filter, rarity);
      setFish(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load fish');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchFish();
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, filter, rarity]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-ocean-900 mb-3">Fish Catalog</h1>
        <p className="text-xl text-ocean-700">
          Explore our comprehensive collection of ocean species
        </p>
      </div>

      <SearchFilter
        search={search}
        filter={filter}
        rarity={rarity}
        onSearchChange={setSearch}
        onFilterChange={setFilter}
        onRarityChange={setRarity}
      />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorMessage message={error} onRetry={fetchFish} />
      ) : (
        <>
          <div className="mb-6 text-ocean-700 font-semibold text-lg">
            {fish.length} {fish.length === 1 ? 'species' : 'species'} found
          </div>
          <FishGrid fish={fish} />
        </>
      )}
    </div>
  );
}
