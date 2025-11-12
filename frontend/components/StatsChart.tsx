interface StatsChartProps {
  seen: number;
  unseen: number;
}

export default function StatsChart({ seen, unseen }: StatsChartProps) {
  const total = seen + unseen;
  const seenPercentage = total > 0 ? (seen / total) * 100 : 0;
  const unseenPercentage = total > 0 ? (unseen / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="relative h-12 bg-ocean-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out flex items-center justify-center"
          style={{ width: `${seenPercentage}%` }}
        >
          {seenPercentage > 10 && (
            <span className="text-white font-bold text-sm">
              {Math.round(seenPercentage)}%
            </span>
          )}
        </div>
        <div
          className="absolute top-0 right-0 h-full bg-gradient-to-r from-ocean-300 to-ocean-400 transition-all duration-1000 ease-out flex items-center justify-center"
          style={{ width: `${unseenPercentage}%` }}
        >
          {unseenPercentage > 10 && (
            <span className="text-white font-bold text-sm">
              {Math.round(unseenPercentage)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <div>
            <span className="text-ocean-700 font-medium">Seen</span>
            <span className="text-ocean-900 font-bold ml-2">{seen}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-ocean-400 rounded"></div>
          <div>
            <span className="text-ocean-700 font-medium">Not Seen</span>
            <span className="text-ocean-900 font-bold ml-2">{unseen}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
