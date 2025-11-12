interface EmptyStateProps {
  message: string;
  description?: string;
}

export default function EmptyState({ message, description }: EmptyStateProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 p-12 bg-white rounded-xl shadow-md text-center">
      <div className="text-6xl mb-4">🔍</div>
      <h3 className="text-2xl font-bold text-ocean-900 mb-2">{message}</h3>
      {description && (
        <p className="text-ocean-600 text-lg">{description}</p>
      )}
    </div>
  );
}
