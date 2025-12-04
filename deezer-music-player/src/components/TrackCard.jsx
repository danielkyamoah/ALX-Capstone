import { FiPlay, FiPause } from "react-icons/fi";

export default function TrackCard({ track, isActive, isPlaying, onToggle }) {
  const artists = track.artist
    ? track.artist.name
    : track.artists
    ? track.artists.map((a) => a.name).join(", ")
    : "Unknown";
  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border hover:shadow-md transition cursor-pointer ${
        isActive ? "ring-2 ring-indigo-400" : ""
      }`}
      onClick={() => onToggle(track)}
    >
      <img
        src={
          track.album?.cover_small || track.album?.cover || track.cover || ""
        }
        alt={track.title}
        className="w-14 h-14 rounded-md object-cover"
      />
      <div className="flex-1">
        <div className="font-semibold truncate">{track.title}</div>
        <div className="text-sm text-gray-500 truncate">{artists}</div>
        <div className="text-xs text-gray-400 truncate">
          {track.album?.title}
        </div>
      </div>
      <div className="w-10 h-10 flex items-center justify-center">
        {isActive && isPlaying ? <FiPause /> : <FiPlay />}
      </div>
    </div>
  );
}
