export default function ErrorBanner({ message, onRetry }) {
return (
<div className="bg-red-100 border border-red-300 text-red-900 p-3 rounded-md flex items-center justify-between">
<div>{message}</div>
{onRetry && (
<button onClick={onRetry} className="ml-4 bg-red-600 text-white px-3 py-1 rounded-md">Retry</button>
)}
</div>
)
}