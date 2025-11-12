export default function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center py-12">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-ocean-200 border-t-ocean-600 rounded-full animate-spin"></div>
        <div className="mt-4 text-ocean-700 font-medium text-center">Loading...</div>
      </div>
    </div>
  );
}
