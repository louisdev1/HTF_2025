'use client';

import { FilterType, RarityType } from '@/types/api';

interface SearchFilterProps {
  search: string;
  filter: FilterType;
  rarity: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: FilterType) => void;
  onRarityChange: (value: string) => void;
}

export default function SearchFilter({
  search,
  filter,
  rarity,
  onSearchChange,
  onFilterChange,
  onRarityChange,
}: SearchFilterProps) {
  const filterButtons: { value: FilterType; label: string; icon: string }[] = [
    { value: 'all', label: 'All Fish', icon: '🐠' },
    { value: 'seen', label: 'Spotted', icon: '✓' },
    { value: 'unseen', label: 'Not Spotted', icon: '◯' },
  ];

  const rarityButtons: { value: string; label: string }[] = [
    { value: '', label: 'All Rarities' },
    { value: 'Common', label: 'Common' },
    { value: 'Rare', label: 'Rare' },
    { value: 'Epic', label: 'Epic' },
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="relative">
        <input
          type="text"
          placeholder="Search by name, scientific name, habitat..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="input-field pl-12"
        />
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-ocean-400 text-xl">
          🔍
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onFilterChange(btn.value)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                filter === btn.value
                  ? 'bg-ocean-600 text-white shadow-md scale-105'
                  : 'bg-white text-ocean-700 hover:bg-ocean-50 border-2 border-ocean-200'
              }`}
            >
              <span>{btn.icon}</span>
              <span>{btn.label}</span>
            </button>
          ))}
        </div>

        <div className="h-8 w-px bg-ocean-200" />

        <div className="flex gap-2">
          {rarityButtons.map((btn) => (
            <button
              key={btn.value}
              onClick={() => onRarityChange(btn.value)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                rarity === btn.value
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'bg-white text-purple-700 hover:bg-purple-50 border-2 border-purple-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
