"use client";

import { useState } from "react";
import { Fish } from "@/types/fish";
import FishCard from "./FishCard";

interface FishListProps {
  fishes: Fish[];
  onFishHover: (fishId: string | null) => void;
}

type FilterType = "all" | "seen" | "unseen";

export default function FishList({ fishes, onFishHover }: FishListProps) {
  const [filter, setFilter] = useState<FilterType>("all");

  // Apply filter
  const filteredFishes = fishes.filter((fish) => {
    if (filter === "seen") return fish.seen;
    if (filter === "unseen") return !fish.seen;
    return true;
  });

  return (
    <div className="w-full h-full bg-[color-mix(in_srgb,var(--color-dark-navy)_85%,transparent)] border-2 border-panel-border backdrop-blur-[10px] overflow-hidden flex flex-col" style={{ boxShadow: 'var(--shadow-cockpit)' }}>
      {/* Section Header */}
      <div className="px-6 py-3 border-b border-panel-border">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-bold text-sonar-green font-mono" style={{ textShadow: 'var(--shadow-glow-text)' }}>
            DETECTED TARGETS
          </div>
          <div className="flex gap-2 text-xs font-mono">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-sonar-green" style={{ boxShadow: 'var(--shadow-glow-common)' }}></div>
              <span className="text-text-secondary">COMMON</span>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <div className="w-2 h-2 rounded-full bg-warning-amber" style={{ boxShadow: 'var(--shadow-glow-rare)' }}></div>
              <span className="text-text-secondary">RARE</span>
            </div>
            <div className="flex items-center gap-1 ml-3">
              <div className="w-2 h-2 rounded-full bg-danger-red" style={{ boxShadow: 'var(--shadow-glow-epic)' }}></div>
              <span className="text-text-secondary">EPIC</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all ${
              filter === "all"
                ? "bg-sonar-green text-deep-ocean border-sonar-green"
                : "bg-transparent text-text-secondary border-panel-border hover:border-sonar-green hover:text-sonar-green"
            }`}
            style={{
              boxShadow: filter === "all" ? "0 0 10px var(--color-sonar-green)" : "none",
            }}
          >
            ALL ({fishes.length})
          </button>
          <button
            onClick={() => setFilter("seen")}
            className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all ${
              filter === "seen"
                ? "bg-sonar-green text-deep-ocean border-sonar-green"
                : "bg-transparent text-text-secondary border-panel-border hover:border-sonar-green hover:text-sonar-green"
            }`}
            style={{
              boxShadow: filter === "seen" ? "0 0 10px var(--color-sonar-green)" : "none",
            }}
          >
            SEEN ({fishes.filter((f) => f.seen).length})
          </button>
          <button
            onClick={() => setFilter("unseen")}
            className={`px-3 py-1.5 text-xs font-mono font-bold border transition-all ${
              filter === "unseen"
                ? "bg-danger-red text-white border-danger-red"
                : "bg-transparent text-text-secondary border-panel-border hover:border-danger-red hover:text-danger-red"
            }`}
            style={{
              boxShadow: filter === "unseen" ? "0 0 10px var(--color-danger-red)" : "none",
            }}
          >
            UNSEEN ({fishes.filter((f) => !f.seen).length})
          </button>
        </div>
      </div>

      {/* Scrollable Fish Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filteredFishes.map((fish) => (
            <FishCard key={fish.id} fish={fish} onHover={onFishHover} />
          ))}
        </div>
        {filteredFishes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-text-secondary font-mono text-sm">
              NO TARGETS DETECTED
            </div>
            <div className="text-text-secondary font-mono text-xs mt-2">
              {filter === "seen" && "No fish have been spotted yet"}
              {filter === "unseen" && "All fish have been spotted!"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
