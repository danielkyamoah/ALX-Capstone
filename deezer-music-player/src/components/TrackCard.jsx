import { FiPlay, FiPause } from "react-icons/fi";

export default function TrackCard({ track, isActive, isPlaying, onToggle }) {
  const artists = track.artist
    ? track.artist.name
    : track.artists
    ? track.artists.map((a) => a.name).join(", ")
    : "Unknown";
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-xl border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all cursor-pointer bg-white ${
        isActive ? "ring-2 ring-blue-400 shadow-md bg-blue-50" : ""
      }`}
      onClick={() => onToggle(track)}
    >
      <img
        src={
          track.album?.cover_small || track.album?.cover || track.cover || ""
        }
        alt={track.title}
        className="w-16 h-16 md:w-14 md:h-14 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-gray-900 truncate text-base md:text-sm">
          {track.title}
        </div>
        <div className="text-sm text-gray-600 truncate mt-1">{artists}</div>
        <div className="text-xs text-gray-500 truncate mt-0.5">
          {track.album?.title}
        </div>
      </div>
      <div className="w-12 h-12 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0">
        {isActive && isPlaying ? (
          <FiPause className="w-5 h-5 text-indigo-600" />
        ) : (
          <FiPlay className="w-5 h-5 text-gray-700 ml-0.5" />
        )}
      </div>
    </div>
  );
}
