"use client";

import { useEffect, useState } from "react";

interface LeaderboardUser {
  id: number;
  username: string;
  displayName: string;
  points: number;
  rank: number;
  sightingCount: number;
  avatarUrl: string | null;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

export default function Leaderboard() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [period, setPeriod] = useState<"week" | "month" | "alltime">("alltime");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, [period]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/leaderboard?period=${period}`);
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return { icon: "🥇", color: "text-warning-amber", glow: "0 0 15px #ffa500" };
      case 2:
        return { icon: "🥈", color: "text-text-secondary", glow: "0 0 15px #a8dadc" };
      case 3:
        return { icon: "🥉", color: "text-warning-amber", glow: "0 0 15px #cd7f32" };
      default:
        return { icon: `#${rank}`, color: "text-text-secondary", glow: "none" };
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto bg-deep-ocean p-6">
      {/* Header */}
      <div className="border-2 border-sonar-green p-4 mb-6" style={{ boxShadow: "0 0 20px var(--color-sonar-green)" }}>
        <h1
          className="text-2xl font-bold text-sonar-green font-mono mb-2"
          style={{ textShadow: "var(--shadow-glow-text)" }}
        >
          🏆 LEADERBOARD
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Top marine explorers ranked by points and discoveries
        </p>
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        {(["week", "month", "alltime"] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`px-4 py-2 font-mono text-sm font-bold border transition-all ${
              period === p
                ? "bg-sonar-green text-deep-ocean border-sonar-green"
                : "bg-transparent text-text-secondary border-panel-border hover:border-sonar-green hover:text-sonar-green"
            }`}
            style={{
              boxShadow: period === p ? "0 0 15px var(--color-sonar-green)" : "none",
            }}
          >
            {p.toUpperCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-sonar-green font-mono">LOADING LEADERBOARD...</div>
        </div>
      ) : (
        <div className="space-y-3">
          {users.map((user) => {
            const rankBadge = getRankBadge(user.rank);
            return (
              <div
                key={user.id}
                className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4 flex items-center justify-between hover:border-sonar-green transition-all"
                style={{ boxShadow: "var(--shadow-cockpit-border)" }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div
                    className={`font-mono font-bold text-2xl ${rankBadge.color} w-16 text-center`}
                    style={{ textShadow: rankBadge.glow }}
                  >
                    {rankBadge.icon}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-nautical-blue border-2 border-sonar-green flex items-center justify-center">
                    <span className="text-sonar-green font-mono font-bold text-lg">
                      {user.displayName.charAt(0)}
                    </span>
                  </div>

                  {/* User Info */}
                  <div>
                    <div className="text-sonar-green font-mono font-bold">{user.displayName}</div>
                    <div className="text-text-secondary font-mono text-xs">@{user.username}</div>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8">
                  <div className="text-right">
                    <div className="text-text-secondary font-mono text-xs">POINTS</div>
                    <div className="text-warning-amber font-mono font-bold text-xl">{user.points}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-text-secondary font-mono text-xs">SIGHTINGS</div>
                    <div className="text-sonar-green font-mono font-bold text-xl">{user.sightingCount}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
