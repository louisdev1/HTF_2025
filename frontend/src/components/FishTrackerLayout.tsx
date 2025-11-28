"use client";

import { useState } from "react";
import FishTrackerClient from "./FishTrackerClient";
import AddSightingModal from "./AddSightingModal";
import AnalyticsDashboard from "./AnalyticsDashboard";
import Leaderboard from "./Leaderboard";
import Achievements from "./Achievements";
import AIChatAssistant from "./AIChatAssistant";
import FishIdentifier from "./FishIdentifier";
import { Fish } from "@/types/fish";

interface FishTrackerLayoutProps {
  fishes: Fish[];
  sortedFishes: Fish[];
}

type ViewType = "tracker" | "analytics" | "leaderboard" | "achievements";

export default function FishTrackerLayout({ fishes, sortedFishes }: FishTrackerLayoutProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isIdentifierOpen, setIsIdentifierOpen] = useState(false);
  const [key, setKey] = useState(0);
  const [activeView, setActiveView] = useState<ViewType>("tracker");

  const handleSightingSuccess = () => {
    window.location.reload();
  };

  const handleChatAction = (action: string, data: any) => {
    if (action === 'log_sighting') {
      setIsChatOpen(false);
      setIsModalOpen(true);
    } else if (action === 'filter_fish') {
      // Could trigger filter in the tracker view
      console.log('Filter requested:', data);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <div className="bg-[color-mix(in_srgb,var(--color-dark-navy)_85%,transparent)] border-2 border-panel-border shadow-[var(--shadow-cockpit)] backdrop-blur-[10px] border-b-2 border-panel-border z-10">
        {/* Top Bar */}
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-sonar-green" style={{ textShadow: 'var(--shadow-glow-text)' }}>
              FISH TRACKER
            </div>
            <div className="text-xs text-text-secondary font-mono">
              GLOBAL MARINE MONITORING SYSTEM
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <button
              onClick={() => setIsChatOpen(true)}
              className="px-4 py-2 bg-purple-600 text-white font-bold border-2 border-purple-500 hover:bg-purple-700 transition-all"
              style={{ boxShadow: "0 0 15px rgba(168, 85, 247, 0.4)" }}
              title="AI Chat Assistant"
            >
              🤖 AI CHAT
            </button>
            <button
              onClick={() => setIsIdentifierOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white font-bold border-2 border-blue-500 hover:bg-blue-700 transition-all"
              style={{ boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)" }}
              title="AI Fish Identifier"
            >
              🔍 IDENTIFY
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-sonar-green text-deep-ocean font-bold border-2 border-sonar-green hover:bg-opacity-90 transition-all"
              style={{ boxShadow: "0 0 15px var(--color-sonar-green)" }}
            >
              + ADD SIGHTING
            </button>
            <div className="border border-panel-border px-3 py-1 rounded" style={{ boxShadow: 'var(--shadow-cockpit-border)' }}>
              <span className="text-sonar-green">STATUS:</span>
              <span className="text-sonar-green ml-2 font-bold">OPERATIONAL</span>
            </div>
            <div className="border border-panel-border px-3 py-1 rounded" style={{ boxShadow: 'var(--shadow-cockpit-border)' }}>
              <span className="text-text-secondary">TARGETS:</span>
              <span className="text-sonar-green ml-2 font-bold">
                {fishes.length}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 pb-0 flex gap-2 border-t border-panel-border">
          {[
            { id: "tracker", label: "TRACKER", icon: "🗺️" },
            { id: "analytics", label: "ANALYTICS", icon: "📊" },
            { id: "leaderboard", label: "LEADERBOARD", icon: "🏆" },
            { id: "achievements", label: "ACHIEVEMENTS", icon: "🏅" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveView(tab.id as ViewType)}
              className={`px-4 py-2 font-mono text-xs font-bold border-t-2 border-x-2 transition-all ${
                activeView === tab.id
                  ? "bg-[color-mix(in_srgb,var(--color-nautical-blue)_60%,transparent)] text-sonar-green border-sonar-green"
                  : "bg-transparent text-text-secondary border-transparent hover:text-sonar-green hover:border-panel-border"
              }`}
              style={{
                boxShadow: activeView === tab.id ? "0 -2px 10px var(--color-sonar-green)" : "none",
                marginBottom: "-2px"
              }}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-hidden">
        {activeView === "tracker" && (
          <FishTrackerClient key={key} fishes={fishes} sortedFishes={sortedFishes} />
        )}
        {activeView === "analytics" && <AnalyticsDashboard />}
        {activeView === "leaderboard" && <Leaderboard />}
        {activeView === "achievements" && <Achievements />}
      </div>

      {/* Add Sighting Modal */}
      <AddSightingModal
        fishes={fishes}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSightingSuccess}
      />

      {/* AI Chat Assistant Modal */}
      {isChatOpen && (
        <AIChatAssistant
          onClose={() => setIsChatOpen(false)}
          onAction={handleChatAction}
        />
      )}

      {/* Fish Identifier Modal */}
      {isIdentifierOpen && (
        <FishIdentifier
          onClose={() => setIsIdentifierOpen(false)}
          onIdentified={(result) => {
            console.log('Fish identified:', result);
            // Could open add sighting modal with pre-filled fish if matched
          }}
        />
      )}
    </div>
  );
}
