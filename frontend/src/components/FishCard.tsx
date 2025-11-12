"use client";

import { Fish } from "@/types/fish";
import { getRarityColor, getRarityBadgeClass } from "@/utils/rarity";
import { formatDistanceToNow } from "date-fns";

interface FishCardProps {
  fish: Fish;
  onHover?: (fishId: string | null) => void;
}

export default function FishCard({ fish, onHover }: FishCardProps) {
  const rarityColor = getRarityColor(fish.rarity);
  const badgeClass = getRarityBadgeClass(fish.rarity);

  return (
    <div
      className="group relative bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-3 transition-all duration-300 hover:border-sonar-green cursor-pointer"
      style={{
        boxShadow: "var(--shadow-cockpit-border)",
      }}
      onMouseEnter={() => onHover?.(fish.id.toString())}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Seen/Unseen Status Indicator */}
      <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
        <div
          className={`w-2.5 h-2.5 rounded-full ${
            fish.seen
              ? "bg-sonar-green animate-pulse"
              : "bg-danger-red opacity-60"
          }`}
          style={{
            boxShadow: fish.seen
              ? "0 0 8px var(--color-sonar-green)"
              : "0 0 8px var(--color-danger-red)",
          }}
        />
        <span
          className={`text-[10px] font-mono font-bold ${
            fish.seen ? "text-sonar-green" : "text-danger-red"
          }`}
        >
          {fish.seen ? "SEEN" : "UNSEEN"}
        </span>
      </div>

      {/* Rarity Badge */}
      <div className="absolute top-2 right-2 z-10">
        <div
          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${badgeClass}`}
          style={{
            backgroundColor: `color-mix(in srgb, ${rarityColor} 20%, transparent)`,
            border: `1px solid ${rarityColor}`,
            color: rarityColor,
            boxShadow: `0 0 5px ${rarityColor}`,
          }}
        >
          {fish.rarity}
        </div>
      </div>

      {/* Fish Name */}
      <div className="mt-6 mb-2">
        <div
          className="text-sm font-bold text-sonar-green font-mono truncate"
          style={{ textShadow: "0 0 3px var(--color-sonar-green)" }}
        >
          {fish.name}
        </div>
        <div className="text-[10px] text-text-secondary font-mono mt-0.5 truncate">
          {fish.scientificName || "Unknown species"}
        </div>
      </div>

      {/* Location Data */}
      {fish.latestSighting && (
        <div className="space-y-1 text-[10px] font-mono">
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">LAT:</span>
            <span className="text-sonar-green">
              {fish.latestSighting.latitude.toFixed(4)}°
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text-secondary">LON:</span>
            <span className="text-sonar-green">
              {fish.latestSighting.longitude.toFixed(4)}°
            </span>
          </div>
          {fish.latestSighting.timestamp && (
            <div className="pt-1 border-t border-panel-border">
              <div className="text-text-secondary">
                LAST SEEN:{" "}
                <span className="text-warning-amber">
                  {formatDistanceToNow(new Date(fish.latestSighting.timestamp), {
                    addSuffix: true,
                  })}
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
