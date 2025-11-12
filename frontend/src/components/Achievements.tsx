"use client";

import { useEffect, useState } from "react";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold: number;
  points: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

const CATEGORY_COLORS = {
  milestone: "#14ffec",
  rarity: "#ffa500",
  social: "#ff4757",
  streak: "#9b59b6",
};

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [filter, setFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/achievements`);
      const data = await response.json();
      setAchievements(data);
    } catch (error) {
      console.error("Error fetching achievements:", error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["all", ...new Set(achievements.map((a) => a.category))];

  const filteredAchievements =
    filter === "all"
      ? achievements
      : achievements.filter((a) => a.category === filter);

  const groupedByCategory = filteredAchievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, Achievement[]>);

  return (
    <div className="w-full h-full overflow-y-auto bg-deep-ocean p-6">
      {/* Header */}
      <div className="border-2 border-sonar-green p-4 mb-6" style={{ boxShadow: "0 0 20px var(--color-sonar-green)" }}>
        <h1
          className="text-2xl font-bold text-sonar-green font-mono mb-2"
          style={{ textShadow: "var(--shadow-glow-text)" }}
        >
          🏅 ACHIEVEMENTS
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Unlock badges and earn points for your discoveries
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 font-mono text-xs font-bold border transition-all uppercase ${
              filter === cat
                ? "bg-sonar-green text-deep-ocean border-sonar-green"
                : "bg-transparent text-text-secondary border-panel-border hover:border-sonar-green hover:text-sonar-green"
            }`}
            style={{
              boxShadow: filter === cat ? "0 0 10px var(--color-sonar-green)" : "none",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-sonar-green font-mono">LOADING ACHIEVEMENTS...</div>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category}>
              {/* Category Header */}
              <h2
                className="text-lg font-bold font-mono mb-3 uppercase"
                style={{
                  color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || "#14ffec",
                }}
              >
                {category}
              </h2>

              {/* Achievement Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4 hover:border-sonar-green transition-all"
                    style={{ boxShadow: "var(--shadow-cockpit-border)" }}
                  >
                    {/* Icon and Title */}
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className="text-4xl"
                        style={{
                          filter: "drop-shadow(0 0 5px currentColor)",
                        }}
                      >
                        {achievement.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sonar-green font-mono font-bold text-sm mb-1">
                          {achievement.name}
                        </h3>
                        <p className="text-text-secondary font-mono text-xs">
                          {achievement.description}
                        </p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex justify-between items-center pt-3 border-t border-panel-border">
                      <div>
                        <div className="text-text-secondary font-mono text-[10px]">THRESHOLD</div>
                        <div className="text-warning-amber font-mono font-bold text-sm">
                          {achievement.threshold}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-text-secondary font-mono text-[10px]">POINTS</div>
                        <div className="text-sonar-green font-mono font-bold text-sm">
                          +{achievement.points}
                        </div>
                      </div>
                    </div>

                    {/* Unlock Status (for demo - always locked) */}
                    <div className="mt-3 text-center">
                      <div className="text-danger-red font-mono text-xs">🔒 LOCKED</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
