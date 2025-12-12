export default function ErrorBanner({ message, onRetry }) {
return (
<div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
<div className="text-sm">{message}</div>
{onRetry && (
<button onClick={onRetry} className="self-start sm:self-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors touch-manipulation">Retry</button>
)}
</div>
)
}