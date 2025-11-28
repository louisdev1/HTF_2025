interface ProgressChartProps {
  seen: number;
  unseen: number;
}

export default function ProgressChart({ seen, unseen }: ProgressChartProps) {
  const total = seen + unseen;
  const seenPercentage = total > 0 ? (seen / total) * 100 : 0;
  const unseenPercentage = total > 0 ? (unseen / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="relative h-16 bg-gray-100 rounded-full overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-500 transition-all duration-1000 ease-out flex items-center justify-end pr-4"
          style={{ width: `${seenPercentage}%` }}
        >
          {seenPercentage > 15 && (
            <span className="text-white font-bold text-lg drop-shadow-lg">
              {Math.round(seenPercentage)}%
            </span>
          )}
        </div>
        <div
          className="absolute top-0 right-0 h-full bg-gradient-to-r from-gray-300 to-gray-400 transition-all duration-1000 ease-out flex items-center justify-start pl-4"
          style={{ width: `${unseenPercentage}%` }}
        >
          {unseenPercentage > 15 && (
            <span className="text-white font-bold text-lg drop-shadow-lg">
              {Math.round(unseenPercentage)}%
            </span>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-md shadow"></div>
          <div>
            <span className="text-gray-700 font-medium">Spotted</span>
            <span className="text-gray-900 font-bold ml-2 text-lg">{seen}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-gray-400 rounded-md shadow"></div>
          <div>
            <span className="text-gray-700 font-medium">Not Spotted</span>
            <span className="text-gray-900 font-bold ml-2 text-lg">{unseen}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
