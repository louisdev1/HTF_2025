interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 bg-red-50 border-2 border-red-200 rounded-xl shadow-lg animate-fade-in">
      <div className="flex items-start space-x-4">
        <div className="text-4xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-red-900 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-700 mb-4 text-lg">{message}</p>
          {onRetry && (
            <button onClick={onRetry} className="btn-danger">
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
