"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TimelineData {
  date: string;
  count: number;
  common: number;
  rare: number;
  epic: number;
}

interface ProgressData {
  total: number;
  seen: number;
  unseen: number;
  percentage: number;
  byRarity: {
    common: { total: number; seen: number };
    rare: { total: number; seen: number };
    epic: { total: number; seen: number };
  };
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5555";

const COLORS = {
  common: "#14ffec",
  rare: "#ffa500",
  epic: "#ff4757",
  seen: "#14ffec",
  unseen: "#ff4757",
};

export default function AnalyticsDashboard() {
  const [timeline, setTimeline] = useState<TimelineData[]>([]);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [timelineRes, progressRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/analytics/timeline`),
        fetch(`${API_BASE_URL}/api/analytics/progress`),
      ]);

      const timelineData = await timelineRes.json();
      const progressData = await progressRes.json();

      setTimeline(timelineData);
      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-sonar-green font-mono">LOADING ANALYTICS...</div>
      </div>
    );
  }

  const pieData = progress
    ? [
        { name: "Seen", value: progress.seen },
        { name: "Unseen", value: progress.unseen },
      ]
    : [];

  const rarityData = progress
    ? [
        {
          rarity: "Common",
          seen: progress.byRarity.common.seen,
          unseen: progress.byRarity.common.total - progress.byRarity.common.seen,
        },
        {
          rarity: "Rare",
          seen: progress.byRarity.rare.seen,
          unseen: progress.byRarity.rare.total - progress.byRarity.rare.seen,
        },
        {
          rarity: "Epic",
          seen: progress.byRarity.epic.seen,
          unseen: progress.byRarity.epic.total - progress.byRarity.epic.seen,
        },
      ]
    : [];

  return (
    <div className="w-full h-full overflow-y-auto bg-deep-ocean p-6 space-y-6">
      {/* Header */}
      <div className="border-2 border-sonar-green p-4" style={{ boxShadow: "0 0 20px var(--color-sonar-green)" }}>
        <h1
          className="text-2xl font-bold text-sonar-green font-mono mb-2"
          style={{ textShadow: "var(--shadow-glow-text)" }}
        >
          ANALYTICS DASHBOARD
        </h1>
        <p className="text-text-secondary font-mono text-sm">
          Comprehensive mission statistics and progress tracking
        </p>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <div className="text-text-secondary font-mono text-xs mb-1">TOTAL SPECIES</div>
          <div className="text-sonar-green font-mono text-3xl font-bold">{progress?.total || 0}</div>
        </div>
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <div className="text-text-secondary font-mono text-xs mb-1">SPOTTED</div>
          <div className="text-sonar-green font-mono text-3xl font-bold">{progress?.seen || 0}</div>
        </div>
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <div className="text-text-secondary font-mono text-xs mb-1">REMAINING</div>
          <div className="text-danger-red font-mono text-3xl font-bold">{progress?.unseen || 0}</div>
        </div>
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <div className="text-text-secondary font-mono text-xs mb-1">COMPLETION</div>
          <div className="text-warning-amber font-mono text-3xl font-bold">
            {progress?.percentage || 0}%
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Timeline Chart */}
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <h2 className="text-sonar-green font-mono font-bold mb-4">SIGHTING TIMELINE</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d4059" />
              <XAxis dataKey="date" stroke="#a8dadc" style={{ fontSize: 10 }} />
              <YAxis stroke="#a8dadc" style={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1b2a",
                  border: "1px solid #14ffec",
                  borderRadius: 0,
                }}
                labelStyle={{ color: "#14ffec" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="count" stroke="#14ffec" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="epic" stroke="#ff4757" strokeWidth={2} name="Epic" />
              <Line type="monotone" dataKey="rare" stroke="#ffa500" strokeWidth={2} name="Rare" />
              <Line type="monotone" dataKey="common" stroke="#14ffec" strokeWidth={1} name="Common" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Progress Pie Chart */}
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <h2 className="text-sonar-green font-mono font-bold mb-4">OVERALL PROGRESS</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1b2a",
                  border: "1px solid #14ffec",
                  borderRadius: 0,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Rarity Breakdown Bar Chart */}
        <div
          className="bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] border border-panel-border p-4 lg:col-span-2"
          style={{ boxShadow: "var(--shadow-cockpit-border)" }}
        >
          <h2 className="text-sonar-green font-mono font-bold mb-4">RARITY BREAKDOWN</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rarityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d4059" />
              <XAxis dataKey="rarity" stroke="#a8dadc" />
              <YAxis stroke="#a8dadc" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0d1b2a",
                  border: "1px solid #14ffec",
                  borderRadius: 0,
                }}
              />
              <Legend />
              <Bar dataKey="seen" stackId="a" fill="#14ffec" name="Spotted" />
              <Bar dataKey="unseen" stackId="a" fill="#ff4757" name="Unspotted" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
