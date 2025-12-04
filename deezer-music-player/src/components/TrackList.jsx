import TrackCard from "./TrackCard";

export default function TrackList({
  tracks = [],
  activeId,
  isPlaying,
  onToggle,
}) {
  if (!tracks || tracks.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No tracks found. Try another search.
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tracks.map((t) => (
        <TrackCard
          key={t.id}
          track={t}
          isActive={activeId === t.id}
          isPlaying={isPlaying}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
