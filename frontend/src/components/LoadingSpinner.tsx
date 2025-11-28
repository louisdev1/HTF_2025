export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin"></div>
        <div className="mt-6 text-ocean-700 font-semibold text-center text-lg">
          Loading fish data...
        </div>
      </div>
    </div>
  );
}
